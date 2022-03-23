// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ABDKMathQuad.sol";
import "./HodlNFT.sol";
import "hardhat/console.sol";


contract HodlMarket is ReentrancyGuard, Ownable {
    address payable public marketOwner;
    uint256 public marketSaleFeeInPercent;
    uint256 public minListingPriceInMatic;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address payable seller;
    }

    // Main DS
    mapping(uint256 => Listing) private listings; // tokenId to Listing
    uint256[] listingKeys; // tokenIds on the market

    // Keep track of the number of tokens per address
    mapping(address => uint256) private numberOfTokensForAddress;

    // Events
    event TokenListed (
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );

    event TokenDelisted (
        address indexed seller,
        uint256 indexed tokenId
    );

    event TokenBought (
        address indexed buyer,
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor() {
        marketOwner = payable(msg.sender);
        marketSaleFeeInPercent = 1;
        minListingPriceInMatic = 1 ether;
    }

    // Fee Setters
    function setMarketSaleFeeInPercent(uint256 _marketSaleFeeInPercent)
        public
        onlyOwner
    {
        marketSaleFeeInPercent = _marketSaleFeeInPercent;
    }

    function setMinListingPriceInMatic(uint256 _minListingPriceInMatic)
        public
        onlyOwner
    {
        minListingPriceInMatic = _minListingPriceInMatic;
    }

    function remove(uint256 _index) private {
        require(_index < listingKeys.length, "index out of bound");

        for (uint256 i = _index; i < listingKeys.length - 1; i++) {
            listingKeys[i] = listingKeys[i + 1];
        }

        listingKeys.pop();
    }

    function mulDiv(
        uint256 x,
        uint256 y,
        uint256 z
    ) public pure returns (uint256) {
        return
            ABDKMathQuad.toUInt(
                ABDKMathQuad.div(
                    ABDKMathQuad.mul(
                        ABDKMathQuad.fromUInt(x),
                        ABDKMathQuad.fromUInt(y)
                    ),
                    ABDKMathQuad.fromUInt(z)
                )
            );
    }

    function listToken(
        address tokenContract,
        uint256 tokenId,
        uint256 price
    ) public payable {
        require(
            msg.sender == IERC721(tokenContract).ownerOf(tokenId),
            "You do not own this token or it is already listed"
        );

        require(
            price >= minListingPriceInMatic,
            "Token must be listed at minListingPrice or higher"
        );

        require(
            keccak256(bytes(ERC721Upgradeable(tokenContract).name())) == keccak256(bytes("Hodl NFT")) && 
            keccak256(bytes(ERC721Upgradeable(tokenContract).symbol())) == keccak256(bytes("HNFT")),
            "We only support HodlNFTs on the market at the moment");

        listings[tokenId] = Listing(tokenId, price, payable(msg.sender));

        listingKeys.push(tokenId);

        IERC721(tokenContract).transferFrom(msg.sender, address(this), tokenId);

        numberOfTokensForAddress[msg.sender]++;

        emit TokenListed(msg.sender, tokenId, price);
    }

    function delistToken(address tokenContract, uint256 tokenId)
        public
        payable
    {
        bool found = false;

        for (uint256 i = 0; i < listingKeys.length; i++) {
            if (listingKeys[i] == tokenId) {
                found = true;
                remove(i);
                break;
            }
        }

        require(found, "Token is not listed on Market");
        require(msg.sender == listings[tokenId].seller, "Only the token seller can delist it");

        IERC721(tokenContract).transferFrom(address(this), msg.sender, tokenId);

        numberOfTokensForAddress[msg.sender]--;

        Listing memory empty;
        listings[tokenId] = empty;

        emit TokenDelisted(msg.sender, tokenId);
    }

    function buyToken(address tokenContract, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        bool found = false;

        for (uint256 i = 0; i < listingKeys.length; i++) {
            if (listingKeys[i] == tokenId) {
                found = true;
                remove(i);
                break;
            }
        }

        require(found, "Token is not listed on Market");

        Listing storage token = listings[tokenId];

        require(msg.sender != token.seller, "You should delist your item instead");
        require(msg.value == token.price, "Item asking price not sent");

        uint256 sellerFee = mulDiv( (100 - marketSaleFeeInPercent) , token.price, 100 );
        uint256 marketOwnerFee = mulDiv (marketSaleFeeInPercent, token.price, 100);

        (bool sellerReceivedFee, ) = token.seller.call{value: sellerFee}("");
        require(sellerReceivedFee, "Could not send the seller their fee");

        (bool marketOwnerReceivedFee, ) = marketOwner.call{value: marketOwnerFee}("");
        require(marketOwnerReceivedFee, "Could not send the market owner their fee");

        IERC721(tokenContract).transferFrom(address(this), msg.sender, tokenId);

        numberOfTokensForAddress[token.seller]--;

        emit TokenBought (
            msg.sender, 
            token.seller,
            tokenId,
            token.price
        );

        Listing memory empty;
        listings[tokenId] = empty;
    }
    
    // We do not check if the token is listed for performance reasons. 
    // The assumption is the caller will know this.
    function getListing(uint256 tokenId)
        public
        view
        returns (Listing memory)
    {
        return listings[tokenId];
    }

    // e.g. 100 items, offset of 0, limit of 10
    // we return [0..9], 0 + 10 (next offset for pagination),
    function fetchMarketItems(uint256 offset, uint256 limit) public view
        returns (Listing[] memory, uint256 nextOffset, uint256 totalItems) {

        if (limit == 0) {
            limit = 1;
        }

        // Asked for limit of 1000, and an offset of 10 (i.e. we asked for 10 to 999 with a zero based index)
        //
        // There might be only 100 items though!
        // In that case,
        // 100 (total) - 10 (offset) = 90 (new limit) and we get an iteration of 10 - 89 (zero based index)
        if (limit > (listingKeys.length - offset)) {
            limit = listingKeys.length - offset;
        }

        Listing[] memory items = new Listing[](limit);

        for (uint256 i = 0; i < limit; i++) {
            uint256 tokenId = listingKeys[i + offset];
            items[i] = listings[tokenId];
        }

        return (items, offset + limit, listingKeys.length);
    }

    function getListingsForAddress(address _address) public view returns (Listing[] memory) {
        
        Listing[] memory items = new Listing[](numberOfTokensForAddress[_address]);

        uint256 itemCount = 0;
        uint256 numberOfItemsOnMarket = listingKeys.length;
        
        for (uint256 i = 0; i < numberOfItemsOnMarket; i++) {

            uint tokenId = listingKeys[i];

            if (listings[tokenId].seller == _address) {
                items[itemCount] = listings[tokenId];
                itemCount++;
            }

            // We've found them all
            if (itemCount == numberOfTokensForAddress[_address]) {
                break;
            }
        }
        
        return items;
    }
}
