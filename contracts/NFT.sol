// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// TODO: Use proxy contract
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    mapping(address => uint256[]) public userOwnedTokens;
    mapping(uint256 => uint256) public tokenIsAtIndex;

    constructor(address marketplaceAddress)
        ERC721("NFT Market Token", "NFTMT")
    {
        contractAddress = marketplaceAddress;
    }

    function getTokensForAddress(address _address)
        public
        view
        returns (uint256[] memory)
    {
        return userOwnedTokens[_address];
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(contractAddress, true);

        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        ////////////////////////////////////////
        // Update the mapping of who owns what
        ////////////////////////////////////////

        // We don't care about the order of the token array
        // For removal, just copy the last element into the empty slot and delete the last element
        console.log("Removing token from old address");
        for (uint256 i = 0; i < userOwnedTokens[from].length; i++) {
            if (userOwnedTokens[from][i] == tokenId) {
                userOwnedTokens[from][i] = userOwnedTokens[from][
                    userOwnedTokens[from].length - 1
                ];
                delete userOwnedTokens[from][userOwnedTokens[from].length - 1];
                userOwnedTokens[from].pop();
                break;
            }
        }

        console.log("Adding token to new address");
        // append the tokenId to new owners array
        userOwnedTokens[to].push(tokenId);
    }
}
