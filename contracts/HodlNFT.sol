// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";


contract HodlNFT is ERC721URIStorageUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    address private _marketAddress;
    mapping(address => uint256[]) private _addressToTokenIds;

    event TokenMappingUpdated (
        address fromAddress,
        uint256[] fromTokens,
        address toAddress,
        uint256[] toTokens,
        uint256 indexed tokenId
    );

    // constructor(address _address) ERC721("Hodl NFT", "HNFT") {
    //     _marketAddress = _address;
    // }

    function initialize(address _address) public initializer {
         __ERC721_init("Hodl NFT", "HNFT");
         __Ownable_init();
         __Pausable_init();
        _marketAddress = _address;
    }

    function marketAddress() public view returns (address) {
        return _marketAddress;
    }

    // e.g. offset of 0, limit of 10, total items of 100
    // we return [ [0 ->9], 0 + 10, 100 ]
    function addressToTokenIds(address _address, uint256 offset, uint256 limit)
        public
        view
        returns (uint256[] memory page, uint256 next, uint256 total)
    {
        uint256[] storage allTokenIds = _addressToTokenIds[_address];

        console.log("This is mighty good for debugging");

        require(limit > 0, "Limit must be a positive number");
        require(limit < 500, "Limited to 500 items per page");
        require(offset <= allTokenIds.length, "Offset is greater than number of tokens");
        

        // e.g. limit of 100, and an offset of 10 (i.e. we asked for 10 to 99)
        // there might be only 10 items though!

        // if so, we set the limit to
        // 100 (total) - 10 (offset); and iterate of 10 - 89
        if (limit > (allTokenIds.length - offset)) {
            limit = allTokenIds.length - offset;
        }

        page = new uint256[](limit);
        for (uint256 i = 0; i < limit; i++) {
            page[i] = allTokenIds[i + offset];
        }

        return (page, offset + limit, allTokenIds.length);
    }

    function createToken(string memory tokenURI) public whenNotPaused returns (uint256) {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(_marketAddress, true);

        return tokenId;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._afterTokenTransfer(from, to, tokenId); // Call parent hook

        uint256[] storage fromTokens = _addressToTokenIds[from];

        // The array order isn't important
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
