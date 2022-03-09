// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

// TODO: Use proxy contract
contract NFTMarket is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable marketOwner; // marketplace owner

    uint256 private listingPrice = 0.025 ether; // fee for the marketplace owner
    uint256 private minSellingPrice = 0.025 ether; // minimum price we will let users lift NFTs at.

    constructor() {
        marketOwner = payable(msg.sender);
    }

    struct MarketItem {
        address nftContract;
        uint256 tokenId;
        address payable seller; // Who has given us their NFT to sell. They will receive 'price' when it is sold. (unless they delist)
        address boughtBy; // We record who bought the NFT for informational purposes
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem; // tokenId to listing

    event MarketItemCreated(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address boughtBy,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint256 _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    function getMinSellingPrice() public view returns (uint256) {
        return minSellingPrice;
    }

    function setMinSellingPrice(uint256 _minSellingPrice) public onlyOwner {
        minSellingPrice = _minSellingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        // This stops others trying to list things they don't own.
        // It also prevents a duplicate 'live' listing happening as
        // the token owner will be the marketplace for the duration of the listing
        require(
            msg.sender == IERC721(nftContract).ownerOf(tokenId),
            "You do not own this token!"
        );
        require(
            price >= minSellingPrice,
            "Price must at least the minimum selling price"
        );
        require(msg.value == listingPrice, "Listing price not sent");

        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            nftContract,
            tokenId,
            payable(msg.sender), // seller
            payable(address(0)), // boughtBy
            price,
            false // sold
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        _itemIds.increment();

        emit MarketItemCreated(
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // Sellers can remove their item from the marketplace at any time.
    function delistToken(address nftContract, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        bool found = false;
        uint256 index;

        for (uint256 i = _itemIds.current(); i >= 0; i--) {
            if (
                idToMarketItem[i].tokenId == tokenId && !idToMarketItem[i].sold
            ) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Token not currently on the market");
        require(
            msg.sender == idToMarketItem[index].seller,
            "Only the token seller can delist it"
        );

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToMarketItem[index].sold = true;
        idToMarketItem[index].boughtBy = msg.sender;

        _itemsSold.increment();

        console.log(msg.sender, " has delisted item with tokenId ", tokenId);
    }

    // transfer the token ownership, and collect transaction fee
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        bool found = false;
        uint256 index;

        for (uint256 i = _itemIds.current(); i >= 0; i--) {
            if (
                idToMarketItem[i].tokenId == itemId && !idToMarketItem[i].sold
            ) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Token not currently on the market");
        require(
            msg.sender != idToMarketItem[index].seller,
            "You do not need to buy your item back, just de-list it"
        );
        require(
            msg.value == idToMarketItem[index].price,
            "Asking price not sent"
        );

        (bool sellerReceivedFee, ) = idToMarketItem[index].seller.call{
            value: msg.value
        }("");
        require(sellerReceivedFee, "Unable to send coins to the seller");

        IERC721(nftContract).transferFrom(
            address(this),
            msg.sender,
            idToMarketItem[index].tokenId
        );

        idToMarketItem[index].sold = true;
        idToMarketItem[index].boughtBy = msg.sender;
        _itemsSold.increment();

        (bool marketOwnerReceivedFee, ) = payable(marketOwner).call{
            value: listingPrice
        }("");
        require(
            marketOwnerReceivedFee,
            "Unable to transaction fee to the marketplace owner"
        );

        console.log(
            msg.sender,
            " has purchased item with tokenId ",
            idToMarketItem[index].tokenId
        );
    }

    // We will be adding MarketItems sequentially;
    // Search backwards until we find the tokenId && check it hasn't been sold
    function fetchMarketItem(uint256 tokenId)
        public
        view
        returns (MarketItem memory)
    {
        for (uint256 i = _itemIds.current(); i >= 0; i--) {
            if (
                idToMarketItem[i].tokenId == tokenId && !idToMarketItem[i].sold
            ) {
                return idToMarketItem[i];
            }
        }
        revert("Token not currently on the market");
    }

    // Fetch all active listings
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 forSaleCount = 0;
        uint256 itemCount = _itemIds.current();

        for (uint256 i = 0; i < itemCount; i++) {
            if (!idToMarketItem[i].sold) {
                forSaleCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](forSaleCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (!idToMarketItem[i].sold) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }

        return items;
    }

    // Fetch the NFTS that I'm the seller of. Only return active listings.
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i].seller == msg.sender &&
                !idToMarketItem[i].sold
            ) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i].seller == msg.sender &&
                !idToMarketItem[i].sold
            ) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return items;
    }

    // Fetch the market listings for the supplied address. Only return active listings.
    function getListingsForAddress(address seller)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].seller == seller && !idToMarketItem[i].sold) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i].seller == seller && !idToMarketItem[i].sold) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return items;
    }
}
