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

    describe("Admin functions", function () {
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
    });

    describe("listToken", function () {
        it("Should allow user to list their token", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            await tx.wait();

            const TokenListedEvents = await hodlMarketAsUser.queryFilter("TokenListed")   
            
            expect(TokenListedEvents[0].args.tokenId).to.equal(tokenId);
            expect(TokenListedEvents[0].args.price).to.equal(ethers.utils.parseEther("5"));
            expect(TokenListedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
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

            const TokenListedEvents = await hodlMarketAsUser.queryFilter("TokenListed")   
            expect(TokenListedEvents.length).to.equal(1);
            expect(TokenListedEvents[0].args.tokenId).to.equal(tokenId);
            expect(TokenListedEvents[0].args.price).to.equal(ethers.utils.parseEther("5"));
            expect(TokenListedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
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
            const TokenListedEvents = await hodlMarketAsUser.queryFilter("TokenListed")   
            expect(TokenListedEvents.length).to.equal(1);
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

        it("Should NOT allow user to list their token with a negative value for price", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            try {
                tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseUnits("-10", "ether"));
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal('value out-of-bounds (argument="price", value={"type":"BigNumber","hex":"-0x8ac7230489e80000"}, code=INVALID_ARGUMENT, version=abi/5.5.0)');
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
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'We only support HodlNFTs on the market at the moment'");
            }

            const TokenListedEvents = await hodlMarketAsUser.queryFilter("TokenListed")   
            expect(TokenListedEvents.length).to.equal(0);
        });
    });



    describe("DelistToken", function () {
        it("Should allow user to delist their token", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            await tx.wait();

            tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser.address, tokenId);
            await tx.wait();

            const TokenDelistedEvents = await hodlMarketAsUser.queryFilter("TokenDelisted")   
            expect(TokenDelistedEvents.length).to.equal(1);
            expect(TokenDelistedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(TokenDelistedEvents[0].args.tokenId).to.equal(tokenId);
        });

        it("Should allow user to delist their token twice", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            await tx.wait();

            tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser.address, tokenId);
            await tx.wait();

            try {
                tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser.address, tokenId);
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token is not listed on Market'");
            }

            const TokenDelistedEvents = await hodlMarketAsUser.queryFilter("TokenDelisted")   
            expect(TokenDelistedEvents.length).to.equal(1);
            expect(TokenDelistedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(TokenDelistedEvents[0].args.tokenId).to.equal(tokenId);
        });

        it("Should NOT allow user to delist their token if it isn't listed", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            // Don't list it!
            // tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            // await tx.wait();

            try {
                tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser.address, tokenId);
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token is not listed on Market'");
            }

            const TokenDelistedEvents = await hodlMarketAsUser.queryFilter("TokenDelisted");
            expect(TokenDelistedEvents.length).to.equal(0);
        });

        it("Should NOT allow user to delist another user's token", async function () {
            // user creates token and lists it for 10 matic
            tx = await hodlNFTAsUser.createToken('ipfs://6789');
            await tx.wait();

            transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("10"));
            await tx.wait();

            // user 2 tries to delist first user's token
            try {
                tx = await hodlMarketAsUser2.delistToken(hodlNFTAsUser2.address, tokenId);
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Only the token seller can delist it'");
            }

            const TokenDelistedEvents = await hodlMarketAsUser.queryFilter("TokenDelisted");
            expect(TokenDelistedEvents.length).to.equal(0);
        });

        it("Should NOT allow user to delist a non-existent token", async function () {
            try {
                tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser2.address, 1);
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token is not listed on Market'");
            }
        });
    });

    describe("BuyToken", function () {
        it("Should allow user to buy another users token if correct amount is provided", async function () {
            // user 1 creates a token
            let tx = await hodlNFTAsUser.createToken('ipfs://12345');
            await tx.wait();

            let transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            
            const tokenId = transferEvents[0].args.tokenId;
            const price = ethers.utils.parseEther("5");
            
            // market is empty
            let marketItems = await hodlMarketAsOwner.fetchMarketItems(0, 1);
            expect(marketItems[0].length).to.equal(0);

            // user 1 lists the token for 'price'
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, price);
            await tx.wait();

            // market now has the listing
            marketItems = await hodlMarketAsOwner.fetchMarketItems(0, 1);
            expect(marketItems[0].length).to.equal(1);

            expect(marketItems[0][0].tokenId).to.equal(1);
            expect(marketItems[0][0].price).to.equal(price);
            expect(marketItems[0][0].seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);

            // user 2 pays 'price' to buy the token
            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, tokenId, { value: price })
            await tx.wait();

            // market is once again, empty
            marketItems = await hodlMarketAsOwner.fetchMarketItems(0, 1);
            expect(marketItems[0].length).to.equal(0);

            // events were emmited
            const TokenBoughtEvents = await hodlMarketAsUser.queryFilter("TokenBought");
            expect(TokenBoughtEvents.length).to.equal(1);
            expect(TokenBoughtEvents[0].args.buyer).to.equal(process.env.ACCOUNT2_PUBLIC_KEY);
            expect(TokenBoughtEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(TokenBoughtEvents[0].args.tokenId).to.equal(tokenId);
            expect(TokenBoughtEvents[0].args.price).to.equal(price);

            transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            expect(transferEvents.length).to.equal(3);

            expect(transferEvents[0].args.from).to.equal(ethers.constants.AddressZero);
            expect(transferEvents[0].args.to).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(transferEvents[0].args.tokenId).to.equal(1);

            expect(transferEvents[1].args.from).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(transferEvents[1].args.to).to.equal(hodlMarketAsOwner.address);
            expect(transferEvents[1].args.tokenId).to.equal(1);

            expect(transferEvents[2].args.from).to.equal(hodlMarketAsOwner.address);
            expect(transferEvents[2].args.to).to.equal(process.env.ACCOUNT2_PUBLIC_KEY);
            expect(transferEvents[2].args.tokenId).to.equal(1);
            
            // Neither user has anything on the market
            const account1listings = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(account1listings.length).to.equal(0);

            const account2listings = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT2_PUBLIC_KEY);
            expect(account2listings.length).to.equal(0);
        });
    });

});
