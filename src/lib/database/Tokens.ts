import { Redis } from '@upstash/redis';
import { Token } from '../../models/Token';

const client = Redis.fromEnv();

export const getTokens = async (tokenIds: string[]) => {
    const tokensPipeline = client.pipeline();
    for (let tokenId of tokenIds) {
        tokensPipeline.get<Token>('token:' + tokenId)
    }

    const tokens: Token[] = tokenIds.length ? await tokensPipeline.exec() : [];

    return tokens;
}