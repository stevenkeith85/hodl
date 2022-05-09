// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Adapted from https://docs.openzeppelin.com/contracts/4.x/wizard
contract MyToken is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address private hodlMarket;

    constructor(address _hodlMarket) ERC721("MyToken", "MTK") {
        hodlMarket = _hodlMarket;
    }

    function safeMint() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _approve(hodlMarket, tokenId);
    }
}