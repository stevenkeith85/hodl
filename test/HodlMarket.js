const { expect } = require("chai");
const { upgrades } = require("hardhat");
const { BigNumber, utils } = require("ethers");
const fs = require('fs');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' })

const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

describe("HodlMarket Contract", function () {
    let ownerAccount; // the account that will deploy the NFT and Market contracts
    let userAccount; // the account that will interact with the contracts
    let userAccount2; // a 2nd account that will interact with the contracts

    let HodlMarketFactory; // Contract Factory for the market, with signer set as owner
    let HodlNFTFactory; // Contract Factory for the token, with signer set as owner;
    let MyTokenFactory; // Contract Factory for another ERC721 token, with signer set as owner;
    
    let hodlMarketAsOwner; // Deployed Market Contract instance with signer as owner;
    let hodlMarketAsUser; // Deployed Market Contract instance with signer as user
    let hodlMarketAsUser2; // Deployed Market Contract instance with signer as user2

    let hodlNFTAsOwner; // Deployed NFT Contract Instance (via proxy) with the signer set as owner
    let hodlNFTAsUser; // Deployed NFT Contract Instance (via proxy) with the signer set as user
    let hodlNFTAsUser2; // Deployed NFT Contract Instance (via proxy) with the signer set as user2

    let myTokenAsOwner; // Deployed MyToken contract instance with the signer set as owner


    beforeEach(async () => {
        ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
        userAccount = new ethers.Wallet(process.env.ACCOUNT1_PRIVATE_KEY, ethers.provider);
        userAccount2 = new ethers.Wallet(process.env.ACCOUNT2_PRIVATE_KEY, ethers.provider);

        HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);
        hodlMarketAsOwner = await HodlMarketFactory.deploy();
        await hodlMarketAsOwner.deployed();

        hodlMarketAsUser = hodlMarketAsOwner.connect(userAccount);
        hodlMarketAsUser2 = hodlMarketAsOwner.connect(userAccount2);

        HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);
        hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
        await hodlNFTAsOwner.deployed();

        hodlNFTAsUser = hodlNFTAsOwner.connect(userAccount);
        hodlNFTAsUser2 = hodlNFTAsOwner.connect(userAccount2);

        // Another token
        MyToken = await ethers.getContractFactory("MyToken", ownerAccount);
        myTokenAsOwner = await MyToken.deploy(hodlMarketAsOwner.address);
        await myTokenAsOwner.deployed();
    });

    it("Should set the market owner as the deployment address", async function () {
        expect(await hodlMarketAsOwner.marketOwner()).to.equal(ownerAccount.address);    
    });   

    it("Should set the commision rate as 1 percent", async function () {
        expect(await hodlMarketAsOwner.marketSaleFeeInPercent()).to.equal(1);
    });   

    it("Should only let the owner change the commision rate", async function () {
        await hodlMarketAsOwner.setMarketSaleFeeInPercent(2);
        expect(await hodlMarketAsOwner.marketSaleFeeInPercent()).to.equal(2);

        try {
            await hodlMarketAsUser.setMarketSaleFeeInPercent(1);
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        expect(await hodlMarketAsOwner.marketSaleFeeInPercent()).to.equal(2);
    });

    it("Should set the minimum price a user can list their token at as 1 Matic", async function () {
        expect(await hodlMarketAsOwner.minListingPriceInMatic()).to.equal(ethers.utils.parseEther("1"));
    });
    
    it("Should only let the owner change the min listing price", async function () {
        await hodlMarketAsOwner.setMinListingPriceInMatic(2);
        expect(await hodlMarketAsOwner.minListingPriceInMatic()).to.equal(2);

        try {
            await hodlMarketAsUser.setMinListingPriceInMatic(1);
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        expect(await hodlMarketAsOwner.minListingPriceInMatic()).to.equal(2);
    });

    it("Should allow user to list their token", async function () {
        let tx = await hodlNFTAsUser.createToken('ipfs://12345');
        await tx.wait();

        const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        const tokenId = transferEvents[0].args.tokenId;

        tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
        await tx.wait();

        const listingCreatedEvents = await hodlMarketAsUser.queryFilter("ListingCreated")   
        
        expect(listingCreatedEvents[0].args.tokenId).to.equal(tokenId);
        expect(listingCreatedEvents[0].args.price).to.equal(ethers.utils.parseEther("5"));
        expect(listingCreatedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
    });

    it("Should NOT allow user to list their token whilst it is already listed", async function () {
        let tx = await hodlNFTAsUser.createToken('ipfs://12345');
        await tx.wait();

        const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        const tokenId = transferEvents[0].args.tokenId;

        tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
        await tx.wait();

        try {
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'You do not own this token or it is already listed'");
        }

        const listingCreatedEvents = await hodlMarketAsUser.queryFilter("ListingCreated")   
        expect(listingCreatedEvents.length).to.equal(1);
        expect(listingCreatedEvents[0].args.tokenId).to.equal(tokenId);
        expect(listingCreatedEvents[0].args.price).to.equal(ethers.utils.parseEther("5"));
        expect(listingCreatedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
    });

    it("Should NOT allow user to list another user's token", async function () {
        // 1st user creates tokenId1 and does not list it
        let tx = await hodlNFTAsUser.createToken('ipfs://12345');
        await tx.wait();

        let transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        const tokenId1 = transferEvents[0].args.tokenId;

        // 2nd user creates tokenId2 and lists it for 10 matic
        tx = await hodlNFTAsUser2.createToken('ipfs://6789');
        await tx.wait();

        transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        const tokenId2 = transferEvents[1].args.tokenId;

        tx = await hodlMarketAsUser2.listToken(hodlNFTAsUser2.address, tokenId2, ethers.utils.parseEther("10"));
        await tx.wait();

        // 2nd user tries to list 1st users token for 5 matic
        try {
            tx = await hodlMarketAsUser2.listToken(hodlNFTAsUser2.address, tokenId1, ethers.utils.parseEther("5"));
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'You do not own this token or it is already listed'");
        }

        // only 1 listing should have been created
        const listingCreatedEvents = await hodlMarketAsUser.queryFilter("ListingCreated")   
        expect(listingCreatedEvents.length).to.equal(1);
    });

    it("Should NOT allow user to list their token for less than min listing price", async function () {
        let tx = await hodlNFTAsUser.createToken('ipfs://12345');
        await tx.wait();

        const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        const tokenId = transferEvents[0].args.tokenId;

        try {
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseUnits("0.9", "ether"));
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token must be listed at minListingPrice or higher'");
        }
    });

    // This will only check the token name and symbol at the moment, which do not have to be unique.
    //
    // Other developers could create their own contracts to use with the same name and symbol, which would allow them to list. (spoof)
    
    // Once the HoldNFT contract is deployed we could upgrade the HodlMarket contract to only let users list tokens with that address. (which will stop spoofing)
    //
    // We could also blacklist users trying to do malicious stuff in general (still to be implemented)
    //
    // It's more about alerting the 'good' user that what they are trying to do isn't intended to work on the website at the moment.
    //
    // These spoof tokens wouldn't show on the website regardless, as we consult the HodlNFT contract before storing data in redis
    //
    // We MAY consider letting other tokens list in future, but we'd have to then store the image, metadata etc in our database at that point (probably want to differentiate tokens by contract etc too)
    it("Should only allow user to list tokens created with HodlNFT contract (at the moment)", async function () {
        let tx = await myTokenAsOwner.safeMint();
        await tx.wait();

        const transferEvents = await myTokenAsOwner.queryFilter("Transfer")
        const tokenId = transferEvents[0].args.tokenId;

        try {
            tx = await hodlMarketAsOwner.listToken(myTokenAsOwner.address, tokenId, ethers.utils.parseUnits("1", "ether"));
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'We only support HodlTokens on the market at the moment'");
        }

        const listingCreatedEvents = await hodlMarketAsUser.queryFilter("ListingCreated")   
        expect(listingCreatedEvents.length).to.equal(1);
        expect(listingCreatedEvents[0].args.tokenId).to.equal(tokenId);
        expect(listingCreatedEvents[0].args.price).to.equal(ethers.utils.parseEther("1"));
        expect(listingCreatedEvents[0].args.seller).to.equal(process.env.ACCOUNT0_PUBLIC_KEY);
    });
});
