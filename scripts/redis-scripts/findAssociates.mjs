import ethers from 'ethers';
import axios from 'axios';
import { Redis } from "@upstash/redis/with-fetch";

const client = Redis.fromEnv();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function onWhiteList(address) {
    const list = {
        "0x446912B03a7813bb57324FF1D6FA4834F870e3fD": 1
    }

    return list[address]
}


// Ryuzu - 0x18FEFc61F4974481013bB5a4397a6fc52e108298 (linked to 90 accounts with a distance of 4, money flowing out)
// ["0xb8a265f01e2DB57cE3f599868538e909a13C7fBB","abigaild","adamus","agathe","agathi","aileen","alfaiz","aliana","alwanfakhru","amandalyn","amorim_ross","andyrt","anilarry","astridewi","catsofworld","charlie_dh","cily","clara","cristy","delioveira","dino","dobsky","doggg","dragon","eunice_adelia","faisa","fikaty","gaiazando","george","giselly","gluck","jaduu","jenkim","jennstel","jenny","juan_alers","justinemarie","kelubia","krzysiek","kucing","kumshaj","lawe","lenney","lucy","lyna_rya","majlodog","mama_milka","mamanela","marcoba","markyklau","maryleexo","meiry","metatera","mezafamily","misslidabutik","moulin","myadog","myboys","nabila","nagami","powermom","priskaanastasia","rahmatanah","raniseptya","raxezy","ricky","rojas","ryuzu","sarah","shanne","snowman","sobrevilla","soyeoni","spencerpenny","sunset","szksae","teja","tuccina","tuiaekpon","tynatun","vahadie","veroniky","watchanon","white_cherry","willyyy","wyra","xyniy","yuto","zuzanka","zyyi"]

// Wadwed - 0xc74f9118565b1e6Cb3D67A9Bf593Ca5133e7E8C6 (linked to 15 accounts with a distance of 4, money flowing out)
// ["0x03A9fcDB1Ca9f1756afb73259a0917F5e8B31381","0x65a3bB44d45d8A6e90e3E16813DC8f0700963557","0x6ae8Fad07718D77E4B01968F5c23A7dA2909365e","adelia","alone","denkawyaa","holdmymoon","itsfunny","kingdom","rahayu","sangkurir5kg","sibejo","trakia","wadidaw","wadwed"]

// Verani - 0x47878d4e984FDaf3069D14F8B6F27d9454e917ef (linked to 24 accounts with a distance of 4, money flowing out)
// ["daud","den","dndy","freebird","happier","herra","hope","jisoo","kitagawakenji","latata","leany","lenaaa","mawee","merly","mikami","onysusdee","rtz","skitzz","sulis","teddy","verani","wayne","xierhi","yesaya"]

// Samudra - 0xa19775bB9aE7910BcfCc25E9257F6d8A28D9Bb3D (linked to 35 accounts with a distance of 4, money flowing out)
// ["0x4a732a0Ba8feb92b9B56A5CbADfcDd6dD42aE5B6","0x55d277Fdc520507C562fA3db5F9a77D1E6e809d1","0x61CecA1355421dB396faFa85578584997c228b7C","0x65a3bB44d45d8A6e90e3E16813DC8f0700963557","0x6fFF497f96688D3286Bbf476Df3F6d3e185A0C75","0x81a522eFC9E8A3C7D83635522748E5ff42CD03Fd","0x9C550e68c39d9420489fdc1146e078e179651B33","0xB354737b8c119B6F7318cAaa631723C2F4B1EF33","0xC019C90B6fd3DD88A5387a3e098544cF0127373a","0xEbD139Df500469b412692Aaf885Fa6d642fb19fC","0xF266C06DbD7081162715CA22f508B4CB3c2c9761","adisamsul99","aiprasidi","angriken","cbchain","dylan","faisal","holdmymoon","iky","joanna","lawlaw","lazarus","linda","moonlover","mounthainx","nadia","nathalia","samudra","sarasvati","shantiefo","sudra","suzzana","uwaisdhuha","vikipratama29","xander"]

let user = ["0x18FEFc61F4974481013bB5a4397a6fc52e108298"]
let associatedAddresses = await findAssociateAddresses(user, 'out', 4, 170);
const uniqueAddressesAssociatedWithUser = Array.from(new Set([...user, ...associatedAddresses]));

// This is a check to see who is in our database. We potentially should only store addresses that we already know about to limit the amount of data.
const scores = await client.zmscore('users', uniqueAddressesAssociatedWithUser);

// get the addresses that we have in our database
const badAddresses = uniqueAddressesAssociatedWithUser.map((address, index) => scores[index] ? address : null).filter(x => x);

const nicknames = [];
for (let address of badAddresses) {
    const nickname = await client.hget(`user:${address}`, 'nickname');
    nicknames.push(nickname || address);
}

console.log(JSON.stringify(nicknames.sort()));
console.log(badAddresses.length)


// Are we following the flow of money towards the scammer, away from the scammer, or both.
// Generally we'd only want to go one way (as the problem size will grow quickly, potentially 100 * 100 * 100 * 100 requests to polygon scan)
//
// Generally we start with a suspected scam address and follow where they've sent MATIC so that we can find their burner accounts or associates
async function findAssociateAddresses(toVisit, direction, maxDistance = 1, maxTransactionsPerAddress = 100) {
    let associateAccounts = [];

    // We'll record who we've visited to prevent loops
    let visited = {};

    let currentDistance = 0;

    while (currentDistance < maxDistance) {

        const newScammersFound = [];

        for (let scammer of toVisit) {
            if (scammer && !visited[scammer]) { // if we've not already visited this scammer

                let scammerLC = scammer.toLowerCase(); // polygonscan seems to care about this being lowercase

                const data = await axios.get(`https://api.polygonscan.com/api?module=account&action=txlist&address=${scammerLC}&startblock=35609494&sort=asc&apikey=8HRNBVW9WMFXFRKPGV9FA9ZESJVHXGM1PC&page=1&offset=${maxTransactionsPerAddress}`).then(r => r.data);

                // mark them as visited to prevent loops
                visited[scammer] = 1;

                if (data.result.length) {
                    let newAddresses = [];

                    if (direction === 'in') {
                        newAddresses = data.result
                            .filter(tx => tx.to === scammerLC)
                            .map(tx => {
                                try {
                                    return ethers.utils.getAddress(tx.from);
                                } catch (e) {
                                    return null;
                                }
                            })
                            .filter(x => x)
                            .filter(address => !onWhiteList(address));
                    } else {
                        newAddresses = data.result
                            .filter(tx => tx.from === scammerLC)
                            .map(tx => {
                                try {
                                    return ethers.utils.getAddress(tx.to);
                                } catch (e) {
                                    return null;
                                }
                            })
                            .filter(address => !onWhiteList(address));
                    }

                    newScammersFound.push(...newAddresses);
                }

                // api is rate limited
                await sleep(200);
            }
        }

        // visit all the scammers we found
        associateAccounts.push(...newScammersFound);

        // look at the txs of the users that fed the scammer
        toVisit = [...newScammersFound];
        console.log(`end of pass ${currentDistance}. will visit ${toVisit.length} addresses in next pass`);
        currentDistance++;
    }

    return associateAccounts;
}
