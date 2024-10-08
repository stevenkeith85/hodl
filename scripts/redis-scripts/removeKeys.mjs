import { Redis } from "@upstash/redis/with-fetch";
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = Redis.fromEnv();

// DO NOT USE IN PROD. (KEYS PERFORMANCE) THIS IS JUST FOR CLEANING UP DEV
const remove = async () => {
    const keys = await client.keys('market*');
    for (const key of keys) {
        client.del(key);
    }
}

remove();