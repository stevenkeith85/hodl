const { expect } = require("chai");
const { upgrades } = require("hardhat");
const { BigNumber } = require("ethers");
const fs = require('fs');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' })

const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

describe("HodlNft Contract", function () {
    let ownerAccount; // the account that will deploy the NFT and Market contracts
    let userAccount; // the account that will interact with the contracts

    let HodlMarketFactory; // Contract Factory for the market, with signer set as owner
    let HodlNFTFactory; // Contract Factory for the token, with signer set as owner;
    
    let hodlMarketAsOwner; // Deployed Market Contract instance.
    let hodlNFTAsOwner; // Deployed NFT Contract Instance (via proxy) with the signer set as owner
    let hodlNFTAsUser; // Deployed NFT Contract Instance (via proxy) with the signer set as user


    beforeEach(async () => {
        ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
        userAccount = new ethers.Wallet(process.env.ACCOUNT1_PRIVATE_KEY, ethers.provider);

        HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);
        hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' });
        await hodlMarketAsOwner.deployed();

        HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);
        hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
        await hodlNFTAsOwner.deployed();

        hodlNFTAsUser = hodlNFTAsOwner.connect(userAccount);
    });

    it('Should maintain the same proxy address when a new implementation is deployed', async function () {
        const proxyAddress = hodlNFTAsOwner.address;
        const implAddress = await getImplementationAddress(ethers.provider, hodlNFTAsOwner.address);

        const HodlNFTFactoryNew = await ethers.getContractFactory("HodlNFT", ownerAccount);
        const hodlNFTAsOwnerNew = await upgrades.upgradeProxy(proxyAddress, HodlNFTFactoryNew);
        await hodlNFTAsOwnerNew.deployed();
        
        const proxyAddressAfter = hodlNFTAsOwnerNew.address;
        const implAddressAfter = await getImplementationAddress(ethers.provider, hodlNFTAsOwnerNew.address);

        expect(proxyAddress).to.equal(proxyAddressAfter);
        expect(implAddress).to.equal(implAddressAfter); // won't change as the source hasn't changed        
    })

    it("Should accept the market address during deployment", async function () {
        expect(await hodlNFTAsOwner.name()).to.equal("Hodl NFT");
        expect(await hodlNFTAsOwner.marketAddress()).to.equal(hodlMarketAsOwner.address);
    });


    it("Should create a token and update mappings", async function () {
        const tokenUri = "ipfs://123456"
        const tx = await hodlNFTAsUser.createToken(tokenUri);
        await tx.wait();

        // The NFT should be created and assigned to the user
        //
        // event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
        const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        expect(transferEvents.length).to.equal(1);
        expect(transferEvents[0].args.from).to.equal(ethers.constants.AddressZero);
        expect(transferEvents[0].args.to).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);;
        expect(transferEvents[0].args.tokenId).to.equal(1);

        // The market should be approved to manage all NFTs of the owner.
        //
        // event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
        const approvalEvents = await hodlNFTAsUser.queryFilter("ApprovalForAll")
        expect(approvalEvents.length).to.equal(1);
        expect(approvalEvents[0].args.owner).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
        expect(approvalEvents[0].args.operator).to.equal(hodlMarketAsOwner.address);
        expect(approvalEvents[0].args.approved).to.equal(true);

        // The user mappings should be updated.
        //
        // event TokenMappingUpdated(uint256[] _fromTokens, uint256[] _toTokens, uint256 indexed _tokenId);
        const tokenMappingUpdatedEvents = await hodlNFTAsUser.queryFilter("TokenMappingUpdated")
        expect(tokenMappingUpdatedEvents.length).to.equal(1);
        expect(tokenMappingUpdatedEvents[0].args.tokenId).to.equal(1);
        expect(tokenMappingUpdatedEvents[0].args.fromTokens).to.eql([]);
        expect(tokenMappingUpdatedEvents[0].args.toTokens).to.eql([BigNumber.from(1)]);

    });


    it("Should transfer a token between users and update mappings", async function () {
        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
            [], BigNumber.from(0), BigNumber.from(0)
        ])
        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
            [], BigNumber.from(0), BigNumber.from(0)
        ])

        const tokenUri = "ipfs://123456"
        const tx = await hodlNFTAsUser.createToken(tokenUri);
        await tx.wait();

        // i.e. we get back a one element array with tokenId === 1, offset is 1, total items in collection is 1
        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
            [BigNumber.from(1)], BigNumber.from(1), BigNumber.from(1)
        ])

        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT2_PUBLIC_KEY, 0, 1)).to.eql([
            [], BigNumber.from(0), BigNumber.from(0)
        ])

        const tx2 = await hodlNFTAsUser.transferFrom(process.env.ACCOUNT1_PUBLIC_KEY, process.env.ACCOUNT2_PUBLIC_KEY, 1)
        await tx2.wait();

        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
            [], BigNumber.from(0), BigNumber.from(0)
        ])
        expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT2_PUBLIC_KEY, 0, 1)).to.eql([
            [BigNumber.from(1)], BigNumber.from(1), BigNumber.from(1)
        ])

        // Get events
        const transferEvents = await hodlNFTAsUser.queryFilter("Transfer")
        expect(transferEvents.length).to.equal(2);

        const tokenMappingUpdatedEvents = await hodlNFTAsUser.queryFilter("TokenMappingUpdated")
        expect(tokenMappingUpdatedEvents.length).to.equal(2);

        // The NFT should be created and assigned to the account1
        expect(transferEvents[0].args.from).to.equal(ethers.constants.AddressZero);
        expect(transferEvents[0].args.to).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);;
        expect(transferEvents[0].args.tokenId).to.equal(1);

        // The user mappings should be updated.    
        expect(tokenMappingUpdatedEvents[0].args.tokenId).to.equal(1);
        expect(tokenMappingUpdatedEvents[0].args.fromTokens).to.eql([]);
        expect(tokenMappingUpdatedEvents[0].args.toTokens).to.eql([BigNumber.from(1)]);

        // The NFT should be transferred from account1 to account2 
        expect(transferEvents[1].args.from).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
        expect(transferEvents[1].args.to).to.equal(process.env.ACCOUNT2_PUBLIC_KEY);;
        expect(transferEvents[1].args.tokenId).to.equal(1);

        // The user mappings should be updated.
        expect(tokenMappingUpdatedEvents[1].args.tokenId).to.equal(1);
        expect(tokenMappingUpdatedEvents[1].args.fromTokens).to.eql([]);
        expect(tokenMappingUpdatedEvents[1].args.toTokens).to.eql([BigNumber.from(1)]);
    });


    it("Should be able to iterate through the users tokens (in reverse), page by page", async function () {
        const tx1 = await hodlNFTAsUser.createToken("ipfs://123");
        await tx1.wait();

        const tx2 = await hodlNFTAsUser.createToken("ipfs://456");
        await tx2.wait();

        const tx3 = await hodlNFTAsUser.createToken("ipfs://789");
        await tx3.wait();

        const tx4 = await hodlNFTAsUser.createToken("ipfs://1011");
        await tx4.wait();

        const tx5 = await hodlNFTAsUser.createToken("ipfs://1213");
        await tx5.wait();

        const [page, next, total] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(0), BigNumber.from(2));
        expect(page).to.eql([BigNumber.from(5), BigNumber.from(4)]);
        expect(next).to.equal(BigNumber.from(2));
        expect(total).to.equal(BigNumber.from(5));

        const [page2, next2, total2] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, next, BigNumber.from(2));
        expect(page2).to.eql([BigNumber.from(3), BigNumber.from(2)]);
        expect(next2).to.equal(BigNumber.from(4));
        expect(total2).to.equal(BigNumber.from(5));

        const [page3, next3, total3] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, next2, BigNumber.from(2));
        expect(page3).to.eql([BigNumber.from(1)]);
        expect(next3).to.equal(BigNumber.from(5));
        expect(total3).to.equal(BigNumber.from(5));

        // This should just be blank from now on. Client should check if next == total and stop asking
        const [page4, next4, total4] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, next3, BigNumber.from(2));
        expect(page4).to.eql([]);
        expect(next4).to.equal(BigNumber.from(5));
        expect(total4).to.equal(BigNumber.from(5));

        const [page5, next5, total5] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, next4, BigNumber.from(2));
        expect(page5).to.eql([]);
        expect(next5).to.equal(BigNumber.from(5));
        expect(total5).to.equal(BigNumber.from(5));
    });


    it("Should be reverted if asks for an offset outside array length", async function () {
        const tx1 = await hodlNFTAsUser.createToken("ipfs://123");
        await tx1.wait();

        const tx2 = await hodlNFTAsUser.createToken("ipfs://456");
        await tx2.wait();

        const tx3 = await hodlNFTAsUser.createToken("ipfs://789");
        await tx3.wait();

        const tx4 = await hodlNFTAsUser.createToken("ipfs://1011");
        await tx4.wait();

        const tx5 = await hodlNFTAsUser.createToken("ipfs://1213");
        await tx5.wait();

        const [page, next, total] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(4), BigNumber.from(1));
        expect(page).to.eql([BigNumber.from(1)]);
        expect(next).to.equal(BigNumber.from(5));
        expect(total).to.equal(BigNumber.from(5));

        const [page2, next2, total2] = await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(5), BigNumber.from(1));
        expect(page2).to.eql([]);
        expect(next2).to.equal(BigNumber.from(5));
        expect(total2).to.equal(BigNumber.from(5));

        try {
            await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(6), BigNumber.from(1))
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Offset is greater than number of tokens'");
        }

        try {
            await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(-1), BigNumber.from(1))
        } catch (e) {
            expect(e.message).to.equal('value out-of-bounds (argument="offset", value={"type":"BigNumber","hex":"-0x01"}, code=INVALID_ARGUMENT, version=abi/5.5.0)');
        }
    });


    it("Should be pausable / unpausable by ONLY the owner, and token transfers/creation should be blocked when paused", async function () {
        let tx = await hodlNFTAsUser.createToken("ipfs://123");
        await tx.wait();

        // user can't pause contract
        try {
            tx = await hodlNFTAsUser.pauseContract();
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        // owner can pause contract
        tx = await hodlNFTAsOwner.pauseContract()
        await tx.wait();

        // user can't create a token when contract is paused
        try {
            tx = await hodlNFTAsUser.createToken("ipfs://123");
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Pausable: paused'");
        }

        // user can't unpause contract
        try {
            tx = await hodlNFTAsUser.unpauseContract();
            tx4.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        // pausing a paused contract throws
        try {
            tx = await hodlNFTAsOwner.pauseContract()
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Pausable: paused'");
        }

        // the owner can unpause contract
        tx = await hodlNFTAsOwner.unpauseContract()
        await tx.wait();

        // unpausing an active contract throws
        try {
            tx = await hodlNFTAsOwner.unpauseContract()
            await tx.wait();
        } catch (e) {
            expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Pausable: not paused'");
        }

        // and token creation can resume once unpaused
        tx = await hodlNFTAsUser.createToken("ipfs://123");
        await tx.wait();

        const tokenMappingUpdatedEvents = await hodlNFTAsUser.queryFilter("TokenMappingUpdated")
        expect(tokenMappingUpdatedEvents.length).to.equal(2);
        expect(tokenMappingUpdatedEvents[1].args.toAddress).to.equal(process.env.ACCOUNT1_PUBLIC_KEY)
        expect(tokenMappingUpdatedEvents[1].args.toTokens).to.eql([BigNumber.from(1), BigNumber.from(2)])
    });
});
