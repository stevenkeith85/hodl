// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ABDKMathQuad.sol";

import "hardhat/console.sol";


contract HodlMarket is ReentrancyGuard, Ownable {
    address payable marketOwner;
    uint256 private marketSaleFeeInPercent;
    uint256 private minListingPriceInMatic;

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
    event ListingCreated(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );

    constructor() {
        marketOwner = payable(msg.sender);
        marketSaleFeeInPercent = 1;
        minListingPriceInMatic = 1 ether;
    }

    // Fee Getters/Setters
    function getMarketSaleFeeInPercent() public view returns (uint256) {
        return marketSaleFeeInPercent;
    }

    function setMarketSaleFeeInPercent(uint256 _marketSaleFeeInPercent)
        public
        onlyOwner
    {
        marketSaleFeeInPercent = _marketSaleFeeInPercent;
    }

    function getMinListingPriceInMatic() public view returns (uint256) {
        return minListingPriceInMatic;
    }

    function setMinListingPriceInMatic(uint256 _minListingPriceInMatic)
        public
        onlyOwner
    {
        minListingPriceInMatic = _minListingPriceInMatic;
    }

    // Utility functions
    function remove(uint256 _index) public {
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

        listings[tokenId] = Listing(tokenId, price, payable(msg.sender));

        listingKeys.push(tokenId);

        // Token owner will become the market
        IERC721(tokenContract).transferFrom(msg.sender, address(this), tokenId);

        numberOfTokensForAddress[msg.sender]++;

        console.log(msg.sender, ' has this number of tokens ', numberOfTokensForAddress[msg.sender]);

        emit ListingCreated(tokenId, price, msg.sender);

        console.log(msg.sender, " has listed tokenId ", tokenId);
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

        console.log(msg.sender, " has delisted item with tokenId ", tokenId);
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

        require(
            msg.sender != listings[tokenId].seller,
            "You should delist your item instead"
        );
        require(
            msg.value == listings[tokenId].price,
            "Item asking price not sent"
        );

        uint256 sellerFee = mulDiv( (100 - marketSaleFeeInPercent) , listings[tokenId].price, 100 );
        uint256 marketOwnerFee = mulDiv (marketSaleFeeInPercent, listings[tokenId].price, 100);

        (bool sellerReceivedFee, ) = listings[tokenId].seller.call{value: sellerFee}("");
        require(sellerReceivedFee, "Could not send the seller their fee");

        (bool marketOwnerReceivedFee, ) = marketOwner.call{value: marketOwnerFee}("");
        require(marketOwnerReceivedFee, "Could not send the seller their fee");

        IERC721(tokenContract).transferFrom(address(this), msg.sender, tokenId);

        numberOfTokensForAddress[listings[tokenId].seller]--;

        Listing memory empty;
        listings[tokenId] = empty;

        console.log(msg.sender, " has purchased tokenId ", tokenId);
        console.log(listings[tokenId].seller, " has received fee");
        console.log(marketOwner, " has received commision");
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
