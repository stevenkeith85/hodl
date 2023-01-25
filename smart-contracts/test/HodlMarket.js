const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");
const { BigNumber } = require("ethers");

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test.local') })


describe("HodlMarket Contract", function () {
    let ownerAccount; // the account that will deploy the NFT and Market contracts
    let userAccount; // the account that will interact with the contracts
    let userAccount2; // a 2nd account that will interact with the contracts
    let userAccount3; // a 3rd account that will interact with the contracts

    let HodlMarketFactory; // Contract Factory for the market, with signer set as owner
    let HodlNFTFactory; // Contract Factory for the token, with signer set as owner;

    let hodlMarketAsOwner; // Deployed Market Contract instance with signer as owner;
    let hodlMarketAsUser; // Deployed Market Contract instance with signer as user
    let hodlMarketAsUser2; // Deployed Market Contract instance with signer as user2
    let hodlMarketAsUser3; // Deployed Market Contract instance with signer as user3

    let hodlNFTAsOwner; // Deployed NFT Contract Instance (via proxy) with the signer set as owner
    let hodlNFTAsUser; // Deployed NFT Contract Instance (via proxy) with the signer set as user
    let hodlNFTAsUser2; // Deployed NFT Contract Instance (via proxy) with the signer set as user2
    let hodlNFTAsUser3; // Deployed NFT Contract Instance (via proxy) with the signer set as user3

    let myTokenAsOwner; // Deployed MyToken contract instance with the signer set as owner

    let hodlNFTAddress;

    let mintFee;

    // helper
    const pageToObjects = page => {
        const newPage = []
        for (let struct of page) {
            [tokenId, price, seller] = struct;
            newPage.push({ tokenId, price, seller })
        }
        return newPage;
    }

    beforeEach(async () => {
        ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
        userAccount = new ethers.Wallet(process.env.ACCOUNT1_PRIVATE_KEY, ethers.provider);
        userAccount2 = new ethers.Wallet(process.env.ACCOUNT2_PRIVATE_KEY, ethers.provider);
        userAccount3 = new ethers.Wallet(process.env.ACCOUNT3_PRIVATE_KEY, ethers.provider);

        // Market
        HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);

        // Deploy
        hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' });
        await hodlMarketAsOwner.deployed();

        // Upgrade
        hodlMarketAsOwner = await upgrades.upgradeProxy(hodlMarketAsOwner, HodlMarketFactory);
        await hodlMarketAsOwner.deployed();

        hodlMarketAsUser = hodlMarketAsOwner.connect(userAccount);
        hodlMarketAsUser2 = hodlMarketAsOwner.connect(userAccount2);
        hodlMarketAsUser3 = hodlMarketAsOwner.connect(userAccount3);

        // NFT
        HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);

        // Deploy
        hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
        await hodlNFTAsOwner.deployed();

        // Upgrade
        hodlNFTAsOwner = await upgrades.upgradeProxy(hodlNFTAsOwner, HodlNFTFactory, { call: 'initializeV2' });
        await hodlNFTAsOwner.deployed();

        hodlNFTAsUser = hodlNFTAsOwner.connect(userAccount);
        hodlNFTAsUser2 = hodlNFTAsOwner.connect(userAccount2);
        hodlNFTAsUser3 = hodlNFTAsOwner.connect(userAccount3);

        // Another token
        MyToken = await ethers.getContractFactory("MyToken", ownerAccount);
        myTokenAsOwner = await MyToken.deploy(hodlMarketAsOwner.address);
        await myTokenAsOwner.deployed();

        hodlNFTAddress = hodlNFTAsOwner.address;

        mintFee = await hodlNFTAsUser.mintFee();
    });

    describe("Admin functions", function () {
        it("Should set the market owner as the deployment address", async function () {
            expect(await hodlMarketAsOwner.owner()).to.equal(ownerAccount.address);
        });

        it("Should set the commision rate as 3 percent", async function () {
            expect(await hodlMarketAsOwner.marketSaleFeeInPercent()).to.equal(3);
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            let transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId1 = transferEvents[0].args.tokenId;

            // 2nd user creates tokenId2 and lists it for 10 matic
            tx = await hodlNFTAsUser2.createToken('ipfs://6789', 0, { value: mintFee });
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            try {
                tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseUnits("0.9", "ether"));
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token must be listed at the minimum listing price or higher.'");
            }
        });

        it("Should NOT allow user to list their token with a negative value for price", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            try {
                tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseUnits("-10", "ether"));
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal('value out-of-bounds (argument="price", value={"type":"BigNumber","hex":"-0x8ac7230489e80000"}, code=INVALID_ARGUMENT, version=abi/5.7.0)');
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("5"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 2, ethers.utils.parseEther("10"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 3, ethers.utils.parseEther("15"));
            await tx.wait();

            let usersSecondToken = await hodlMarketAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 1);
            expect(usersSecondToken).to.eql(BigNumber.from(2))

            tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser.address, 2); // array should close the gap
            await tx.wait();

            const TokenDelistedEvents = await hodlMarketAsUser.queryFilter("TokenDelisted")
            expect(TokenDelistedEvents.length).to.equal(1);
            expect(TokenDelistedEvents[0].args.seller).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(TokenDelistedEvents[0].args.tokenId).to.equal(2);

            try {
            } catch (e) {
                expect(e.message).to.equal('Transaction reverted without a reason string')
            }

            usersSecondToken = await hodlMarketAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 1);
            expect(usersSecondToken).to.eql(BigNumber.from(3)) // array shifted left to close the gap

        });

        it("Should NOT allow user to delist their token once it has been delisted (without relisting it first)", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
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
            tx = await hodlNFTAsUser.createToken('ipfs://6789', 0, { value: mintFee });
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
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
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
            const [page, offset, totalItems] = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT1_PUBLIC_KEY, 0, 5);
            expect(totalItems).to.equal(0);

            const [page2, offset2, totalItems2] = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT2_PUBLIC_KEY, 0, 5);
            expect(totalItems2).to.equal(0);
        });

        it("Should send the creator their royalty for secondary sales", async function () {
            // creator creates a token with a 5% royalty
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 500, { value: mintFee });
            let receipt = await tx.wait();

            // they list it for 100 MATIC
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("100"));
            receipt = await tx.wait();

            //
            // Primary sale
            //
            // Marketplace commision is 3%
            // Royalty is set to 5%
            // Sale price is 100 Matic
            
            // Get balances of marketplace owner, creator/seller, and buyer
            let ownerBeforeBalance = await ownerAccount.getBalance();
            let sellerBeforeBalance = await userAccount.getBalance();
            let buyerBeforeBalance = await userAccount2.getBalance();
            
            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, 1, { value: ethers.utils.parseEther("100") })
            receipt = await tx.wait();

            let ownerAfterBalance = await ownerAccount.getBalance();
            let sellerAfterBalance = await userAccount.getBalance();
            let buyerAfterBalance = await userAccount2.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("3")));
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("97")));
            expect(buyerAfterBalance).to.equal(buyerBeforeBalance.sub(ethers.utils.parseEther("100")).sub(receipt.effectiveGasPrice * receipt.gasUsed)); // and the gas fee needs to be factored in
            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount2.address);

            //
            // Secondary sale
            //
            // Marketplace commision is 3%
            // Royalty is set to 5%
            // Sale price is 200 Matic
            
            // We need to re-approve as a transfer event clears the approved operator
            await hodlNFTAsUser2.approve(hodlMarketAsOwner.address, 1);
            tx = await hodlMarketAsUser2.listToken(hodlNFTAsUser2.address, 1, ethers.utils.parseEther("200"));
            receipt = await tx.wait();

            // Get balances of the creator (who will receive the royalty), marketplace owner, seller, and buyer
            let creatorBeforeBalance = await userAccount.getBalance();
            ownerBeforeBalance = await ownerAccount.getBalance();
            sellerBeforeBalance = await userAccount2.getBalance();
            buyerBeforeBalance = await userAccount3.getBalance();

            tx = await hodlMarketAsUser3.buyToken(hodlNFTAsUser3.address, 1, { value: ethers.utils.parseEther("200") })
            receipt = await tx.wait();
            
            let creatorAfterBalance = await userAccount.getBalance();
            ownerAfterBalance = await ownerAccount.getBalance();
            sellerAfterBalance = await userAccount2.getBalance();
            buyerAfterBalance = await userAccount3.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("6"))); // 3% of 200 is 6
            expect(creatorAfterBalance).to.equal(creatorBeforeBalance.add(ethers.utils.parseEther("10"))); // 5% of 200 is 10
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("184"))); // 92% of 200 is 184
            expect(buyerAfterBalance).to.equal(buyerBeforeBalance.sub(ethers.utils.parseEther("200")).sub(receipt.effectiveGasPrice * receipt.gasUsed)); // and the gas fee needs to be factored in
            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount3.address);
        });

        // In this scenario, technically the secondary seller will be left with nothing; which is a bit unusual.
        // 97% royalty to the creator
        // 3% fee to us
        // We should perhaps set a max royalty value allowed and revert the tx if the amount is over that? 
        // We could do that here, as we can work out the percentage against the sale.
        // Individual contracts probably wouldn't provide that info
        it("Should check the boundaries for secondary sales", async function () {
            let tx = await hodlNFTAsOwner.setMaxRoyaltyFee(10000);

            // creator creates a token with a 97% royalty
            tx = await hodlNFTAsUser.createToken('ipfs://12345', 9700, { value: mintFee }); // 97% for creator, 3% for us would leave the seller with nothing
            let receipt = await tx.wait();

            // they list it for 100 MATIC
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("100"));
            receipt = await tx.wait();

            //
            // Primary sale
            //
            // Marketplace commision is 3%
            // Royalty is set to 5%
            // Sale price is 100 Matic
            
            // Get balances of marketplace owner, creator/seller, and buyer
            let ownerBeforeBalance = await ownerAccount.getBalance();
            let sellerBeforeBalance = await userAccount.getBalance();
            let buyerBeforeBalance = await userAccount2.getBalance();
            
            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, 1, { value: ethers.utils.parseEther("100") })
            receipt = await tx.wait();

            let ownerAfterBalance = await ownerAccount.getBalance();
            let sellerAfterBalance = await userAccount.getBalance();
            let buyerAfterBalance = await userAccount2.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("3")));
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("97")));
            expect(buyerAfterBalance).to.equal(buyerBeforeBalance.sub(ethers.utils.parseEther("100")).sub(receipt.effectiveGasPrice * receipt.gasUsed)); // and the gas fee needs to be factored in
            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount2.address);

            //
            // Secondary sale
            //
            // Marketplace commision is 3%
            // Royalty is set to 5%
            // Sale price is 200 Matic
            
            // We need to re-approve as a transfer event clears the approved operator
            await hodlNFTAsUser2.approve(hodlMarketAsOwner.address, 1);
            tx = await hodlMarketAsUser2.listToken(hodlNFTAsUser2.address, 1, ethers.utils.parseEther("200"));
            receipt = await tx.wait();

            // Get balances of the creator (who will receive the royalty), marketplace owner, seller, and buyer
            let creatorBeforeBalance = await userAccount.getBalance();
            ownerBeforeBalance = await ownerAccount.getBalance();
            sellerBeforeBalance = await userAccount2.getBalance();
            buyerBeforeBalance = await userAccount3.getBalance();

            tx = await hodlMarketAsUser3.buyToken(hodlNFTAsUser3.address, 1, { value: ethers.utils.parseEther("200") })
            receipt = await tx.wait();
            
            let creatorAfterBalance = await userAccount.getBalance();
            ownerAfterBalance = await ownerAccount.getBalance();
            sellerAfterBalance = await userAccount2.getBalance();
            buyerAfterBalance = await userAccount3.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("6"))); // 3% of 200 is 6
            expect(creatorAfterBalance).to.equal(creatorBeforeBalance.add(ethers.utils.parseEther("194"))); // 5% of 200 is 10
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("0"))); // 92% of 200 is 184
            expect(buyerAfterBalance).to.equal(buyerBeforeBalance.sub(ethers.utils.parseEther("200")).sub(receipt.effectiveGasPrice * receipt.gasUsed)); // and the gas fee needs to be factored in
            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount3.address);
        });

        it("Should NOT allow user to buy another users token if correct amount is NOT provided", async function () {
            // user 1 creates a token
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            let transferEvents = await hodlNFTAsUser.queryFilter("Transfer")

            const tokenId = transferEvents[0].args.tokenId;

            // market is empty
            let marketItems = await hodlMarketAsOwner.fetchMarketItems(0, 1);
            expect(marketItems[0].length).to.equal(0);

            // user 1 lists the token for 'price'
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, tokenId, ethers.utils.parseEther("5"));
            await tx.wait();

            try {
                // user 2 pays tries to pay LESS than 'price' to buy the token
                tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, tokenId, { value: ethers.utils.parseEther("4") })
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Item asking price not sent'");
            }

            try {
                // user 2 pays tries to pay MORE than 'price' to buy the token
                tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, tokenId, { value: ethers.utils.parseEther("6") })
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Item asking price not sent'");
            }

            // events were emmited
            const TokenBoughtEvents = await hodlMarketAsUser.queryFilter("TokenBought");
            expect(TokenBoughtEvents.length).to.equal(0);
        });

        it("Should NOT allow user to buy an unlisted token", async function () {
            // user 1 creates a token
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            // user 1 DOES NOT list the token
            // tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("5"));
            // await tx.wait();

            try {
                // user 2 pays tries to buy the token
                tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, 1, { value: ethers.utils.parseEther("5") })
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Token is not listed on Market'");
            }

            // events were emmited
            const TokenBoughtEvents = await hodlMarketAsUser.queryFilter("TokenBought");
            expect(TokenBoughtEvents.length).to.equal(0);
        });

        it("Should send seller and market owner their fees", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount.address);

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("100"));
            await tx.wait();

            // market takes ownership
            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(hodlMarketAsOwner.address);

            const ownerBeforeBalance = await ownerAccount.getBalance();
            const sellerBeforeBalance = await userAccount.getBalance();

            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, 1, { value: ethers.utils.parseEther("100") })
            await tx.wait();

            const ownerAfterBalance = await ownerAccount.getBalance();
            const sellerAfterBalance = await userAccount.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("3")))
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("97")))

            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount2.address);
        });

        // TODO: We may consider remembering the rate a token was listed at and charge that instead
        it("Should charge the current commision rate, even if token was listed when the rate was different", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            // commision rate is 3 percent here
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("100"));
            await tx.wait();

            // change it to 2 percent
            tx = await hodlMarketAsOwner.setMarketSaleFeeInPercent(2);
            await tx.wait();

            const ownerBeforeBalance = await ownerAccount.getBalance();
            const sellerBeforeBalance = await userAccount.getBalance();

            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, 1, { value: ethers.utils.parseEther("100") })
            await tx.wait();

            const ownerAfterBalance = await ownerAccount.getBalance();
            const sellerAfterBalance = await userAccount.getBalance();

            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(ethers.utils.parseEther("2")))
            expect(sellerAfterBalance).to.equal(sellerBeforeBalance.add(ethers.utils.parseEther("98")))

            expect(await hodlNFTAsUser2.ownerOf(1)).to.equal(userAccount2.address);
        });
    });

    describe('Get Listing', function () {
        it("should return a valid listing", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 1, ethers.utils.parseEther("100"));
            await tx.wait();

            const listing = await hodlMarketAsOwner.getListing(1)

            // struct Listing {
            //     uint256 tokenId;
            //     uint256 price;
            //     address payable seller;
            // }
            expect(listing.tokenId).to.equal(1);
            expect(listing.price).to.equal(ethers.utils.parseEther("100"));
            expect(listing.seller).to.equal(userAccount.address);
        });

        it("should return empty object for an invalid listing", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://12345', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 1, ethers.utils.parseEther("100"));
            await tx.wait();

            const listing = await hodlMarketAsOwner.getListing(2)

            // struct Listing {
            //     uint256 tokenId;
            //     uint256 price;
            //     address payable seller;
            // }
            expect(listing.tokenId).to.equal(0);
            expect(listing.price).to.equal(ethers.utils.parseEther("0"));
            expect(listing.seller).to.equal(ethers.constants.AddressZero);
        });

    })

    describe('Fetch Market Items', function () {
        it("Should be able to iterate through the market listings (in reverse), page by page", async function () {
            const tx1 = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
            await tx1.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            const tx2 = await hodlNFTAsUser.createToken("ipfs://456", 0, { value: mintFee });
            await tx2.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 2, ethers.utils.parseEther("20"));
            await tx.wait();

            const tx3 = await hodlNFTAsUser.createToken("ipfs://789", 0, { value: mintFee });
            await tx3.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 3, ethers.utils.parseEther("30"));
            await tx.wait();

            const tx4 = await hodlNFTAsUser.createToken("ipfs://1011", 0, { value: mintFee });
            await tx4.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 4, ethers.utils.parseEther("40"));
            await tx.wait();

            const tx5 = await hodlNFTAsUser.createToken("ipfs://1213", 0, { value: mintFee });
            await tx5.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 5, ethers.utils.parseEther("50"));
            await tx.wait();

            // struct Listing {
            //     uint256 tokenId;
            //     uint256 price;
            //     address payable seller;
            // }

            const [page, next, total] = await hodlMarketAsUser.fetchMarketItems(ethers.BigNumber.from(0), ethers.BigNumber.from(2));
            expect(pageToObjects(page)).to.eql([
                {
                    tokenId: ethers.BigNumber.from(5),
                    price: ethers.utils.parseEther("50"),
                    seller: userAccount.address
                },
                {
                    tokenId: ethers.BigNumber.from(4),
                    price: ethers.utils.parseEther("40"),
                    seller: userAccount.address
                }
            ]);
            expect(next).to.equal(BigNumber.from(2));
            expect(total).to.equal(BigNumber.from(5));

            const [page2, next2, total2] = await hodlMarketAsUser.fetchMarketItems(next, BigNumber.from(2));
            expect(pageToObjects(page2)).to.eql([
                {
                    tokenId: ethers.BigNumber.from(3),
                    price: ethers.utils.parseEther("30"),
                    seller: userAccount.address
                },
                {
                    tokenId: ethers.BigNumber.from(2),
                    price: ethers.utils.parseEther("20"),
                    seller: userAccount.address
                }
            ]);
            expect(next2).to.equal(BigNumber.from(4));
            expect(total2).to.equal(BigNumber.from(5));

            const [page3, next3, total3] = await hodlMarketAsUser.fetchMarketItems(next2, BigNumber.from(2));
            expect(pageToObjects(page3)).to.eql([
                {
                    tokenId: ethers.BigNumber.from(1),
                    price: ethers.utils.parseEther("10"),
                    seller: userAccount.address
                }
            ]);
            expect(next3).to.equal(BigNumber.from(5));
            expect(total3).to.equal(BigNumber.from(5));

            // This should just be blank from now on. Client should check if next == total and stop asking
            const [page4, next4, total4] = await hodlMarketAsUser.fetchMarketItems(next3, BigNumber.from(2));
            expect(pageToObjects(page4)).to.eql([]);
            expect(next4).to.equal(BigNumber.from(5));
            expect(total4).to.equal(BigNumber.from(5));

            const [page5, next5, total5] = await hodlMarketAsUser.fetchMarketItems(next4, BigNumber.from(2));
            expect(pageToObjects(page5)).to.eql([]);
            expect(next5).to.equal(BigNumber.from(5));
            expect(total5).to.equal(BigNumber.from(5));
        });

    })

    describe('Get listings for address', function () {
        it('should return the listings', async () => {
            let tx = await hodlNFTAsUser.createToken('ipfs://123', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://456', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://789', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 2, ethers.utils.parseEther("20"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 3, ethers.utils.parseEther("30"));
            await tx.wait();

            const [listings, next, total] = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT1_PUBLIC_KEY, 0, 2);

            expect(pageToObjects(listings)).to.eql([
                {
                    tokenId: ethers.BigNumber.from(3),
                    price: ethers.utils.parseEther("30"),
                    seller: userAccount.address
                },
                {
                    tokenId: ethers.BigNumber.from(2),
                    price: ethers.utils.parseEther("20"),
                    seller: userAccount.address
                }
            ]);

            const [listings2, next2, total2] = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT1_PUBLIC_KEY, next, 2);

            expect(pageToObjects(listings2)).to.eql([
                {
                    tokenId: ethers.BigNumber.from(1),
                    price: ethers.utils.parseEther("10"),
                    seller: userAccount.address
                }
            ]);
        })

        it('should reject bad input', async () => {
            let tx = await hodlNFTAsUser.createToken('ipfs://123', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://456', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlNFTAsUser.createToken('ipfs://789', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 2, ethers.utils.parseEther("20"));
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 3, ethers.utils.parseEther("30"));
            await tx.wait();

            try {
                const [listings, next, total] = await hodlMarketAsOwner.getListingsForAddress(process.env.ACCOUNT1_PUBLIC_KEY, 0, -1);
            } catch (e) {
                expect(e.message).to.equal('value out-of-bounds (argument="limit", value=-1, code=INVALID_ARGUMENT, version=abi/5.7.0)')
            }
        })
    })

    describe('Pausable', async () => {
        it("Should be pausable / unpausable by ONLY the owner,", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://123', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAddress, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            // user can't pause contract
            try {
                tx = await hodlMarketAsUser.pauseContract();
                await tx.wait();

                tx = await hodlMarketAsUser.unpauseContract();
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
            }

            expect(await hodlMarketAsOwner.paused()).to.equal(false);
            // owner can pause contract

            tx = await hodlMarketAsOwner.pauseContract();
            await tx.wait();

            expect(await hodlMarketAsOwner.paused()).to.equal(true);

            tx = await hodlMarketAsOwner.unpauseContract();
            await tx.wait();

            expect(await hodlMarketAsOwner.paused()).to.equal(false);
        });

        it("Token sales should be blocked when paused,", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://123', 0, { value: mintFee });
            await tx.wait();

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(process.env.ACCOUNT1_PUBLIC_KEY)

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(hodlMarketAsUser.address); // it is listed on market, owner is currently market contract
            // owner can pause contract

            tx = await hodlMarketAsOwner.pauseContract();
            await tx.wait();

            try {
                tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, BigNumber.from(1), { value: ethers.utils.parseEther("10") })
                await tx.wait()
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Pausable: paused'");
            }

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(hodlMarketAsUser.address) // it is listed on market, owner is currently market contract

            tx = await hodlMarketAsOwner.unpauseContract();
            await tx.wait();

            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, BigNumber.from(1), { value: ethers.utils.parseEther("10") })
            await tx.wait()

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(process.env.ACCOUNT2_PUBLIC_KEY)
        });

        it("Tokens can be delisted when paused,", async function () {
            let tx = await hodlNFTAsUser.createToken('ipfs://123', 0, { value: mintFee });
            await tx.wait();

            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(hodlMarketAsUser.address) // it is listed on market, owner is currently market contract

            tx = await hodlMarketAsOwner.pauseContract();
            await tx.wait();


            tx = await hodlMarketAsUser.delistToken(hodlNFTAsUser2.address, BigNumber.from(1))
            await tx.wait()

            expect(await hodlNFTAsUser.ownerOf(BigNumber.from(1))).to.equal(process.env.ACCOUNT1_PUBLIC_KEY)
        });

        it("The market needs to be approved AFTER a sale; so that relisting can occur", async function () {
            const tokenUri = "ipfs://123456"

            let tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee });
            await tx.wait();

            const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
            const tokenId = transferEvents[0].args.tokenId;

            let owner = await hodlNFTAsUser.ownerOf(tokenId);

            // The creator owns it
            expect(owner).to.equal(userAccount.address);

            // The market is approved by the creator to transfer it
            // let approved = await hodlNFTAsUser.isApprovedForAll(owner, hodlMarketAsOwner.address);
            // expect(approved).to.equal(true);

            // The creator lists it
            tx = await hodlMarketAsUser.listToken(hodlNFTAsUser.address, 1, ethers.utils.parseEther("10"));
            await tx.wait();

            // The market is still approved by the creator to transfer it
            // approved = await hodlNFTAsUser.isApprovedForAll(owner, hodlMarketAsOwner.address);
            // expect(approved).to.equal(true);

            // The market actually owns it at the moment
            owner = await hodlNFTAsUser.ownerOf(tokenId);
            expect(owner).to.equal(hodlMarketAsOwner.address);

            // A different user buys it
            tx = await hodlMarketAsUser2.buyToken(hodlNFTAsUser2.address, tokenId, { value: ethers.utils.parseEther("10") })
            await tx.wait();

            // The new user owns it
            owner = await hodlNFTAsUser2.ownerOf(tokenId);
            expect(owner).to.equal(userAccount2.address);

            // The market SHOULD BE approved by the new owner to transfer it. (so they can list it)
            // approved = await hodlNFTAsUser.isApprovedForAll(owner, hodlMarketAsOwner.address);
            // expect(approved).to.equal(true);

        });
    });
});
