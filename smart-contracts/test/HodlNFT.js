const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const fs = require('fs');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test.local') })
const { signMetaTxRequest } = require("./signer");

describe("HodlNft Contract", function () {
    let ownerAccount; // the account that will deploy the NFT and Market contracts
    let userAccount; // the account that will interact with the contracts

    let HodlMarketFactory; // Contract Factory for the market, with signer set as owner
    let HodlNFTFactory; // Contract Factory for the token, with signer set as owner;

    let hodlMarketAsOwner; // Deployed Market Contract instance.
    let hodlNFTAsOwner; // Deployed NFT Contract Instance (via proxy) with the signer set as owner
    let hodlNFTAsUser; // Deployed NFT Contract Instance (via proxy) with the signer set as user

    let mintFee;

    let forwarderFactory;
    let forwarder;
    let forwarder2;


    beforeEach(async () => {
        ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);

        userAccount = new ethers.Wallet(process.env.ACCOUNT1_PRIVATE_KEY, ethers.provider);


        // Market
        HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);
        hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' });
        await hodlMarketAsOwner.deployed();

        // NFT
        forwarderFactory = await ethers.getContractFactory("MyForwarder", ownerAccount);
        forwarder = await forwarderFactory.deploy().then(f => f.deployed());
        forwarder2 = await forwarderFactory.deploy().then(f => f.deployed());


        // deploy
        HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);
        hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
        await hodlNFTAsOwner.deployed();

        // upgrade
        let hodlNFTAsOwnerNew = await upgrades.upgradeProxy(hodlNFTAsOwner, HodlNFTFactory, { call: 'initializeV2' });
        await hodlNFTAsOwnerNew.deployed();

        // call other initializers (we'd just do this via upgradeProxy for a real deployment)
        hodlNFTAsOwnerNew = await upgrades.upgradeProxy(hodlNFTAsOwner, HodlNFTFactory, {
            call: { fn: "initializeV3", args: [forwarder.address] },
        }
        );
        await hodlNFTAsOwnerNew.deployed();

        hodlNFTAsUser = hodlNFTAsOwner.connect(userAccount);
        mintFee = await hodlNFTAsUser.mintFee();
    });

    describe("Deployment", function () {
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

        it("Should be pausable / unpausable by ONLY the owner, and token transfers/creation should be blocked when paused", async function () {
            let tx = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
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
                tx = await hodlNFTAsUser.createToken("ipfs://123", 0);
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
            tx = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
            await tx.wait();
    
            const tokenMappingUpdatedEvents = await hodlNFTAsUser.queryFilter("TokenMappingUpdated")
            expect(tokenMappingUpdatedEvents.length).to.equal(2);
            expect(tokenMappingUpdatedEvents[1].args.toAddress).to.equal(process.env.ACCOUNT1_PUBLIC_KEY)
            expect(tokenMappingUpdatedEvents[1].args.toTokens).to.eql([BigNumber.from(1), BigNumber.from(2)])
        });
    });

    describe("Creating a token", function () {
        it("Should update mappings", async function () {
            const tokenUri = "ipfs://123456"
            const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee });
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
    });
    
    describe("Transferring a token", function () {
        it("Should update mappings", async function () {
            expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
                [], BigNumber.from(0), BigNumber.from(0)
            ])
            expect(await hodlNFTAsOwner.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, 0, 1)).to.eql([
                [], BigNumber.from(0), BigNumber.from(0)
            ])
    
            const tokenUri = "ipfs://123456"
            const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee });
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
    
    });
    
    describe("Mint Fee", function () {
        it("Should NOT create a token if NO mint fee is sent", async function () {
            try {
                const tokenUri = "ipfs://123456"
                const tx = await hodlNFTAsUser.createToken(tokenUri, 0);
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Mint Fee not sent'")
            }
        });


        it("Should NOT create a token if value < mint fee is sent", async function () {
            try {
                const tokenUri = "ipfs://123456"
                const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee.sub(1) });
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Mint Fee not sent'")
            }
        });


        it("Should NOT create a token if value > mint fee is sent", async function () {
            try {
                const tokenUri = "ipfs://123456"
                const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee.add(1) });
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Mint Fee not sent'")
            }
        });

        it("Should send the mint fee to the contract owner", async function () {
            const tokenUri = "ipfs://123456"

            const ownerBeforeBalance = await ownerAccount.getBalance();
            const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: mintFee });
            await tx.wait();

            const ownerAfterBalance = await ownerAccount.getBalance();
            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(mintFee))
        });


        it("Should allow the contract owner to change the mint fee", async function () {
            const tokenUri = "ipfs://123456"

            const newMintFee = ethers.utils.parseEther("0.5");
            await hodlNFTAsOwner.setMintFee(newMintFee)

            const ownerBeforeBalance = await ownerAccount.getBalance();
            const tx = await hodlNFTAsUser.createToken(tokenUri, 0, { value: newMintFee });
            await tx.wait();

            const ownerAfterBalance = await ownerAccount.getBalance();
            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(newMintFee))
        });

        it("Should allow the contract owner to set the mint fee to 0", async function () {
            const tokenUri = "ipfs://123456"

            const newMintFee = ethers.utils.parseEther("0");
            await hodlNFTAsOwner.setMintFee(newMintFee)

            const ownerBeforeBalance = await ownerAccount.getBalance();
            const tx = await hodlNFTAsUser.createToken(tokenUri, 0);
            await tx.wait();

            const ownerAfterBalance = await ownerAccount.getBalance();
            expect(ownerAfterBalance).to.equal(ownerBeforeBalance.add(newMintFee))
        });

        it("Should NOT allow anyone except the contract owner to change the mint fee", async function () {
            try {
                const newMintFee = ethers.utils.parseEther("0.5");
                await hodlNFTAsUser.setMintFee(newMintFee)
            } catch (e) {
                expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'")
            }
        });
    });

    describe("Iterable", function () {
        it("Should be able to iterate through the users tokens (in reverse), page by page", async function () {
            const tx1 = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
            await tx1.wait();

            const tx2 = await hodlNFTAsUser.createToken("ipfs://456", 0, { value: mintFee });
            await tx2.wait();

            const tx3 = await hodlNFTAsUser.createToken("ipfs://789", 0, { value: mintFee });
            await tx3.wait();

            const tx4 = await hodlNFTAsUser.createToken("ipfs://1011", 0, { value: mintFee });
            await tx4.wait();

            const tx5 = await hodlNFTAsUser.createToken("ipfs://1213", 0, { value: mintFee });
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
            const tx1 = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
            await tx1.wait();

            const tx2 = await hodlNFTAsUser.createToken("ipfs://456", 0, { value: mintFee });
            await tx2.wait();

            const tx3 = await hodlNFTAsUser.createToken("ipfs://789", 0, { value: mintFee });
            await tx3.wait();

            const tx4 = await hodlNFTAsUser.createToken("ipfs://1011", 0, { value: mintFee });
            await tx4.wait();

            const tx5 = await hodlNFTAsUser.createToken("ipfs://1213", 0, { value: mintFee });
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
                expect(e.message).to.contain("Offset is greater than number of tokens");
            }

            try {
                await hodlNFTAsUser.addressToTokenIds(process.env.ACCOUNT1_PUBLIC_KEY, BigNumber.from(-1), BigNumber.from(1))
            } catch (e) {
                expect(e.message).to.equal('value out-of-bounds (argument="offset", value={"type":"BigNumber","hex":"-0x01"}, code=INVALID_ARGUMENT, version=abi/5.7.0)');
            }
        });
    });

    describe("Meta Transactions", function () {
        it("Should support the royalty (erc2981) interface", async function () {
            const _INTERFACE_ID_ERC2981 = 0x2a55205a;
            const _INTERFACE_ID_ERC721 = 0x80ac58cd;

            const suportsRoyaltyInterface = await hodlNFTAsUser.supportsInterface(_INTERFACE_ID_ERC2981);
            const suportsNFTInterface = await hodlNFTAsUser.supportsInterface(_INTERFACE_ID_ERC721);

            expect(suportsNFTInterface).to.equal(true);
            expect(suportsRoyaltyInterface).to.equal(true);
        });

        // Tokens minted prior to the royalty update will have 0 royalty fee
        it("Should have a royalty value set by user", async function () {
            let tx = await hodlNFTAsUser.createToken("ipfs://123", 600, { value: mintFee });
            await tx.wait();

            const [receiverAddress, royaltyAmount] = await hodlNFTAsUser.royaltyInfo(1, 100);
            expect(receiverAddress).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount).to.equal(BigNumber.from(6));

            const [receiverAddress2, royaltyAmount2] = await hodlNFTAsUser.royaltyInfo(1, 200);
            expect(receiverAddress2).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount2).to.equal(BigNumber.from(12));
        });

        it("Should let the royalty be set to zero", async function () {
            let tx = await hodlNFTAsUser.createToken("ipfs://123", 0, { value: mintFee });
            await tx.wait();

            const [receiverAddress, royaltyAmount] = await hodlNFTAsUser.royaltyInfo(1, 100);
            expect(receiverAddress).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount).to.equal(BigNumber.from(0));

            const [receiverAddress2, royaltyAmount2] = await hodlNFTAsUser.royaltyInfo(1, 200);
            expect(receiverAddress2).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount2).to.equal(BigNumber.from(0));
        });

        it("Should NOT let the royalty be set to a negative number", async function () {
            try {
                let tx = await hodlNFTAsUser.createToken("ipfs://123", -1, { value: mintFee });
                await tx.wait();
            } catch (e) {
                expect(e.message).to.equal('value out-of-bounds (argument="_royaltyFeeInBasisPoints", value=-1, code=INVALID_ARGUMENT, version=abi/5.7.0)')
            }
        });

        it("Should allow a royalty value set at maxRoyaltyFee", async function () {
            const maxRoyaltyFee = hodlNFTAsUser.maxRoyaltyFee();
            let tx = await hodlNFTAsUser.createToken("ipfs://123", maxRoyaltyFee, { value: mintFee });
            await tx.wait();

            const [receiverAddress, royaltyAmount] = await hodlNFTAsUser.royaltyInfo(1, 100);
            expect(receiverAddress).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount).to.equal(BigNumber.from(15));

            const [receiverAddress2, royaltyAmount2] = await hodlNFTAsUser.royaltyInfo(1, 200);
            expect(receiverAddress2).to.equal(process.env.ACCOUNT1_PUBLIC_KEY);
            expect(royaltyAmount2).to.equal(BigNumber.from(30));
        });

        it("Should NOT allow a royalty value set above maxRoyaltyFee", async function () {
            try {
                let tx = await hodlNFTAsUser.createToken("ipfs://123", 1501, { value: mintFee });
                await tx.wait();
            } catch (e) {
                expect(e.message).to.contain("Cannot set a royalty fee above the max");
            }
        });

        it("Should prevent ordinary users changing the maxRoyaltyFee", async function () {
            try {
                let tx = await hodlNFTAsUser.setMaxRoyaltyFee(1600);
                await tx.wait();
                let tx2 = await hodlNFTAsUser.createToken("ipfs://123", 1501, { value: mintFee });
                await tx2.wait();
            } catch (e) {
                expect(e.message).to.contain("caller is not the owner");
            }
        });

        it("Should let the owner change the maxRoyaltyFee", async function () {
            let tx = await hodlNFTAsOwner.setMaxRoyaltyFee(1600);
            await tx.wait();

            let tx2 = await hodlNFTAsUser.createToken("ipfs://123", 1501, { value: mintFee });
            await tx2.wait();

            const newMaxRoyaltyFee = await hodlNFTAsUser.maxRoyaltyFee();
            expect(newMaxRoyaltyFee).to.equal(1600);
        });
    });

    describe("Meta Transactions", function () {
        it("should set the owner to the user who signed the tx if called via a trusted forwarder", async function () {
            await hodlNFTAsOwner.setMintFee(0);

            const { request, signature } = await signMetaTxRequest(userAccount.provider, forwarder, {
                from: userAccount.address,
                to: hodlNFTAsUser.address,
                data: hodlNFTAsUser.interface.encodeFunctionData('createToken', ["ipfs://123", 500]),
            });
            expect(await forwarder.verify(request, signature)).to.equal(true);

            await forwarder.execute(request, signature).then(tx => tx.wait());
            expect(await hodlNFTAsUser.ownerOf(1)).to.equal(userAccount.address);
        });

        it("should let the owner change the trusted forwarder", async function () {
            await hodlNFTAsOwner.setMintFee(0);
            await hodlNFTAsOwner.setTrustedForwarder(forwarder2.address);

            const { request, signature } = await signMetaTxRequest(userAccount.provider, forwarder2, {
                from: userAccount.address,
                to: hodlNFTAsUser.address,
                data: hodlNFTAsUser.interface.encodeFunctionData('createToken', ["ipfs://123", 500]),
            });

            await forwarder2.execute(request, signature).then(tx => tx.wait());
            expect(await hodlNFTAsUser.ownerOf(1)).to.equal(userAccount.address);
        });

        it("should not let the user change the trusted forwarder", async function () {
            await expect(hodlNFTAsUser.setTrustedForwarder(forwarder2.address)).to.be.reverted;
        });

        it("should set the owner to the caller if called directly", async function () {
            await hodlNFTAsOwner.setMintFee(0);

            await hodlNFTAsUser.createToken("ipfs://123", 500);
            expect(await hodlNFTAsUser.ownerOf(1)).to.equal(userAccount.address);
        });
    })
});
