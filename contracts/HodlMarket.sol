// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";


contract HodlMarket is
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable
{
    uint256 public marketSaleFeeInPercent;
    uint256 public minListingPriceInMatic;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address payable seller;
    }

    mapping(uint256 => Listing) public listings; // tokenId to Listing
    uint256[] listingKeys; // tokenIds on the market

    // tokens that 'address' currently has listed on the market
    mapping(address => uint256[]) public addressToTokenIds;

    // Events
    event TokenListed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );

    event TokenDelisted(
        address indexed seller, 
        uint256 indexed tokenId
    );

    event TokenBought(
        address indexed buyer,
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );

    function initialize() public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        marketSaleFeeInPercent = 3;
        minListingPriceInMatic = 1 ether;
    }

    // Returns the number of NFTs _address has currently listed on the market
    function balanceOf(address _address) external view returns (uint256) {
        return addressToTokenIds[_address].length;
    }

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

    function remove(uint256[] storage array, uint256 _index) private {
        require(_index < array.length, "index out of bound");

        for (uint256 i = _index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }

        array.pop();
    }

    function listToken(
        address tokenContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant whenNotPaused {
        require(
            keccak256(bytes(ERC721Upgradeable(tokenContract).name())) ==
                keccak256(bytes("Hodl NFT")) &&
                keccak256(bytes(ERC721Upgradeable(tokenContract).symbol())) ==
                keccak256(bytes("HNFT")),
            "We only support HodlNFTs on the market at the moment"
        );

        require(
            msg.sender == IERC721Upgradeable(tokenContract).ownerOf(tokenId),
            "You do not own this token or it is already listed"
        );

        require(
            price >= minListingPriceInMatic,
            "Token must be listed at the minimum listing price or higher."
        );

        listings[tokenId] = Listing(tokenId, price, payable(msg.sender));
        listingKeys.push(tokenId);
        addressToTokenIds[msg.sender].push(tokenId);

        emit TokenListed(msg.sender, tokenId, price);

        IERC721Upgradeable(tokenContract).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );
    }

    function delistToken(address tokenContract, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        bool found = false;
        for (uint256 i = 0; i < listingKeys.length; i++) {
            if (listingKeys[i] == tokenId) {
                found = true;
                remove(listingKeys, i);
                break;
            }
        }

        require(found, "Token is not listed on Market");
        require(
            msg.sender == listings[tokenId].seller,
            "Only the token seller can delist it"
        );

        address seller = listings[tokenId].seller;

        bool removedTokenFromAddress = false;
        for (uint256 j = 0; j < addressToTokenIds[seller].length; j++) {
            if (addressToTokenIds[seller][j] == tokenId) {
                remove(addressToTokenIds[seller], j);
                removedTokenFromAddress = true;
                break;
            }
        }

        assert(removedTokenFromAddress);

        delete listings[tokenId];

        emit TokenDelisted(msg.sender, tokenId);

        IERC721Upgradeable(tokenContract).transferFrom(
            address(this),
            seller,
            tokenId
        );
    }

    function buyToken(address tokenContract, uint256 tokenId)
        public
        payable
        nonReentrant
        whenNotPaused
    {
        bool found = false;
        for (uint256 i = 0; i < listingKeys.length; i++) {
            if (listingKeys[i] == tokenId) {
                found = true;
                remove(listingKeys, i);
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

        address payable sellerAddress = listings[tokenId].seller;

        bool removedTokenFromAddress = false;
        for (uint256 j = 0; j < addressToTokenIds[sellerAddress].length; j++) {
            if (addressToTokenIds[sellerAddress][j] == tokenId) {
                remove(addressToTokenIds[sellerAddress], j);
                removedTokenFromAddress = true;
                break;
            }
        }

        assert(removedTokenFromAddress);

        uint256 ownerFee = (marketSaleFeeInPercent * listings[tokenId].price) / 100;
        uint256 sellerFee = listings[tokenId].price - ownerFee;

        emit TokenBought(
            msg.sender,
            listings[tokenId].seller,
            tokenId,
            listings[tokenId].price
        );

        delete listings[tokenId];

        IERC721Upgradeable(tokenContract).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        (bool ownerReceivedFee, ) = owner().call{value: ownerFee}("");
        require(ownerReceivedFee, "Could not send the owner their fee");

        (bool sellerReceivedFee, ) = sellerAddress.call{value: sellerFee}("");
        require(sellerReceivedFee, "Could not send the seller their fee");
    }

    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }

    // e.g. 100 items, offset of 0, limit of 10
    // we return [0..9], 0 + 10 (next offset for pagination),
    function fetchMarketItems(uint256 offset, uint256 limit)
        public
        view
        returns (
            Listing[] memory page,
            uint256 nextOffset,
            uint256 totalItems
        )
    {
        require(limit > 0, "Limit must be a positive number");
        require(limit < 500, "Limited to 500 items per page");
        require(
            offset <= listingKeys.length,
            "Offset is greater than number of listings"
        );

        // e.g. limit of 100, and an offset of 10 (i.e. we asked for 10 to 99)
        // there might be only 10 items though!

        // if so, we set the limit to
        // 100 (total) - 10 (offset); and iterate of 10 - 89
        if (limit > (listingKeys.length - offset)) {
            limit = listingKeys.length - offset;
        }

        page = new Listing[](limit);

        uint256 current = 0;

        if (listingKeys.length == 0) {
            return (page, 0, 0);
        }

        for (uint256 i = listingKeys.length - 1; current < limit; --i) {
            uint256 tokenId = listingKeys[i - offset];
            page[current] = listings[tokenId];
            current += 1;

            if (i == 0) {
                break; // prevent unsigned wraparound
            }
        }

        return (page, offset + limit, listingKeys.length);
    }

    function getListingsForAddress(
        address _address,
        uint256 offset,
        uint256 limit
    )
        public
        view
        returns (
            Listing[] memory page,
            uint256 nextOffset,
            uint256 totalItems
        )
    {
        require(limit > 0, "Limit must be a positive number");
        require(limit < 500, "Limited to 500 items per page");
        require(
            offset <= listingKeys.length,
            "Offset is greater than number of listings"
        );

        // e.g. limit of 100, and an offset of 10 (i.e. we asked for 10 to 99)
        // there might be only 10 items though!

        // if so, we set the limit to
        // 100 (total) - 10 (offset); and iterate of 10 - 89
        if (limit > (addressToTokenIds[_address].length - offset)) {
            limit = addressToTokenIds[_address].length - offset;
        }

        page = new Listing[](limit);

        uint256 current = 0;

        if (addressToTokenIds[_address].length == 0) {
            return (page, 0, 0);
        }

        for (
            uint256 i = addressToTokenIds[_address].length - 1;
            current < limit;
            --i
        ) {
            uint256 tokenId = addressToTokenIds[_address][i - offset];
            page[current] = listings[tokenId];
            current += 1;

            if (i == 0) {
                break; // prevent unsigned wraparound
            }
        }

        return (page, offset + limit, addressToTokenIds[_address].length);
    }

    // Emergency stop mechanism for contract owner
    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }
}
