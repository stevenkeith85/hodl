// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "hardhat/console.sol";

contract HodlNFT is
    ReentrancyGuardUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIds;
    address public marketAddress;
    mapping(address => uint256[]) private _addressToTokenIds;

    uint256 public mintFee;

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

    function setMintFee(uint256 _mintFee) public onlyOwner {
        mintFee = _mintFee;
    }

    // e.g. offset of 0, limit of 10, total items of 100
    // we return [ [0 -> 9], 0 + 10, 100 ]
    function addressToTokenIds(
        address _address,
        uint256 offset,
        uint256 limit
    )
        public
        view
        returns (
            uint256[] memory page,
            uint256 next,
            uint256 total
        )
    {
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

    function createToken(string memory tokenURI)
        public
        payable
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require(msg.value == mintFee, "Mint Fee not sent");

        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(marketAddress, true);

        (bool received, ) = owner().call{value: msg.value}("");
        require(
            received,
            "Could not send the contract owner the minting fee"
        );

        return tokenId;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._afterTokenTransfer(from, to, tokenId); // Call parent hook

        uint256[] storage fromTokens = _addressToTokenIds[from];

        // The array order isn't important.
        // TODO: Array order should be maintained
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

    // TODO: Burn mechanism for token owner
}
