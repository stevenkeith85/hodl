import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { ethers } from 'ethers';

dotenv.config({ path: '.env.local' })

const client = Redis.fromEnv();

// THIS IS JUST USED FOR A BIT BASIC LOAD TESTING. 
// WE'LL ASSIGN 1000 RANDOM ADDRESSES TO THE USERS FOLLOWERS
const main = async () => {
  const promises = [...Array(10)].map((_, i) => ethers.Wallet.createRandom().getAddress())

  const addresses = await Promise.all(promises);
  const data = addresses.map(address => ({ member: address, score: Date.now() }))
  console.log(data);

  await client.zadd('user:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC:followers', ...data)

  // followers count
  await client.zincrby('rankings:user:followers:count', data.length, targetAddress);

  // add them to the user collection, so that we can test 'new users' etc
  await client.zadd(
    `users`,
    { nx: true },
    ...data
  );

  await client.zadd(
    `users:new`,
    { nx: true },
    ...data
  );
}

main();