// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";

import "hardhat/console.sol";

contract HodlNFT is
    ReentrancyGuardUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    IERC2981Upgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction;
    }

    CountersUpgradeable.Counter private _tokenIds;
    address public marketAddress;
    mapping(address => uint256[]) private _addressToTokenIds;
    uint256 public mintFee;

    // V2 - Royalties
    RoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 => RoyaltyInfo) private _tokenRoyaltyInfo;
    uint96 public maxRoyaltyFee; // In Basis Points

    // V3 - Meta Txs
    address private _trustedForwarder;

    event TokenMappingUpdated(
        address fromAddress,
        uint256[] fromTokens,
        address toAddress,
        uint256[] toTokens,
        uint256 indexed tokenId
    );

    function initialize(address _address) public initializer {
        __ReentrancyGuard_init();
        __ERC721_init("Hodl NFT", "HNFT");
        __Ownable_init();
        __Pausable_init();

        marketAddress = _address;
        mintFee = 1 ether;
    }

    // Initialize V2, set the maxRoyaltyFee to 15%
    function initializeV2() public reinitializer(2) {
        maxRoyaltyFee = 1500; // initially set this to 15%
    }

    // Initialize V3, set the _trustedForwarder to biconomy's forwarder
    function initializeV3(address _forwarder) public reinitializer(3) {
        _trustedForwarder = _forwarder;
    }

    function setMintFee(uint256 _mintFee) public onlyOwner {
        mintFee = _mintFee;
    }

    function setMaxRoyaltyFee(uint96 _maxRoyaltyFee) public onlyOwner {
        maxRoyaltyFee = _maxRoyaltyFee;
    }

    function setTrustedForwarder(address _forwarder) public onlyOwner {
        _trustedForwarder = _forwarder;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    // e.g. offset of 0, limit of 10, total items of 100
    // we return [ [0 -> 9], 0 + 10, 100 ]
    function addressToTokenIds(
        address _address,
        uint256 offset,
        uint256 limit
    ) public view returns (uint256[] memory page, uint256 next, uint256 total) {
        uint256[] storage allTokenIds = _addressToTokenIds[_address];

        require(limit > 0, "Limit must be a positive number");
        require(limit < 500, "Limited to 500 items per page");
        require(
            offset <= allTokenIds.length,
            "Offset is greater than number of tokens"
        );

        // e.g. limit of 100, and an offset of 10 (i.e. we asked for 10 to 99)
        // there might be only 10 items though!

        // if so, we set the limit to
        // 100 (total) - 10 (offset); and iterate of 10 - 89
        if (limit > (allTokenIds.length - offset)) {
            limit = allTokenIds.length - offset;
        }

        page = new uint256[](limit);

        uint256 current = 0;

        if (allTokenIds.length == 0) {
            return (page, 0, 0);
        }

        for (uint256 i = allTokenIds.length - 1; current < limit; --i) {
            page[current] = allTokenIds[i - offset];
            current += 1;

            if (i == 0) {
                break; // prevent unsigned wraparound
            }
        }

        return (page, offset + limit, allTokenIds.length);
    }

    function createToken(
        string memory _tokenURI,
        uint96 _royaltyFeeInBasisPoints
    ) public payable whenNotPaused nonReentrant returns (uint256) {
        require(msg.value == mintFee, "Mint Fee not sent");
        require(
            _royaltyFeeInBasisPoints <= maxRoyaltyFee,
            "Cannot set a royalty fee above the max"
        );
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        address minter = _msgSender();

        _mint(minter, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setTokenRoyalty(tokenId, minter, _royaltyFeeInBasisPoints); // setting a 5% royalty would be 500 basis points

        // Approve the marketplace to transfer hodltokens for this user
        // If the user nevers mint a token, then they will need to approve the market place on
        // their first attempt to list a token. this can be done client-side
        setApprovalForAll(marketAddress, true);

        // TODO: We should check if there's a value to transfer and skip this if not to save gas
        (bool received, ) = owner().call{value: msg.value}("");
        require(received, "Could not send the contract owner the minting fee");

        return tokenId;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._afterTokenTransfer(from, to, tokenId); // Call parent hook

        uint256[] storage fromTokens = _addressToTokenIds[from];

        // The array order isn't important; just swap the last entry to the deleted entry to save gas
        for (uint256 i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                fromTokens[i] = fromTokens[fromTokens.length - 1];

                delete fromTokens[fromTokens.length - 1];
                fromTokens.pop();

                break;
            }
        }

        uint256[] storage toTokens = _addressToTokenIds[to];
        toTokens.push(tokenId);

        emit TokenMappingUpdated(
            from,
            _addressToTokenIds[from],
            to,
            _addressToTokenIds[to],
            tokenId
        );
    }

    // Emergency stop mechanism for contract owner
    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }

    /**
     * @dev See {ERC721-_burn}. This override:
     *
     * checks to see if a token-specific URI was set for the token, and if so, it deletes the token URI from the storage mapping and
     * clears the royalty information for the token
     */
    function _burn(
        uint256 tokenId
    ) internal virtual override(ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981Upgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IERC2981Upgradeable
     */
    function royaltyInfo(
        uint256 _tokenId,
        uint256 _salePrice
    ) public view virtual override returns (address, uint256) {
        RoyaltyInfo memory royalty = _tokenRoyaltyInfo[_tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (_salePrice * royalty.royaltyFraction) /
            _feeDenominator();

        return (royalty.receiver, royaltyAmount);
    }

    /**
     * @dev The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
     * fraction of the sale price. Defaults to 10000 so fees are expressed in basis points, but may be customized by an
     * override.
     */
    function _feeDenominator() internal pure virtual returns (uint96) {
        return 10000;
    }

    /**
     * @dev Sets the royalty information that all ids in this contract will default to.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function _setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) internal virtual {
        require(
            feeNumerator <= _feeDenominator(),
            "ERC2981: royalty fee will exceed salePrice"
        );
        require(receiver != address(0), "ERC2981: invalid receiver");

        _defaultRoyaltyInfo = RoyaltyInfo(receiver, feeNumerator);
    }

    /**
     * @dev Removes default royalty information.
     */
    function _deleteDefaultRoyalty() internal virtual {
        delete _defaultRoyaltyInfo;
    }

    /**
     * @dev Sets the royalty information for a specific token id, overriding the global default.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator.
     */
    function _setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) internal virtual {
        require(
            feeNumerator <= _feeDenominator(),
            "ERC2981: royalty fee will exceed salePrice"
        );
        require(receiver != address(0), "ERC2981: Invalid parameters");

        _tokenRoyaltyInfo[tokenId] = RoyaltyInfo(receiver, feeNumerator);
    }

    /**
     * @dev Resets royalty information for the token id back to the global default.
     */
    function _resetTokenRoyalty(uint256 tokenId) internal virtual {
        delete _tokenRoyaltyInfo[tokenId];
    }

    function isTrustedForwarder(address forwarder) public view virtual returns (bool) {
        return forwarder == _trustedForwarder;
    }

    function _msgSender() internal view virtual override returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            /// @solidity memory-safe-assembly
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}
