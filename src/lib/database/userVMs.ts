import { Redis } from '@upstash/redis';
import { Token } from '../../models/Token';
import { User, UserViewModel } from '../../models/User';

const client = Redis.fromEnv();

export const getUserVMs = async (addresses: string[]) => {
    const usersPipeline = client.pipeline();
    for (let address of addresses) {
        usersPipeline.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');
    }

    const users: User[] = addresses.length ? await usersPipeline.exec() : [];

    const avatarIds: number[] = users.filter(user => user.avatar).map(user => user.avatar); // avatars are optional
    const avatarPipeline = client.pipeline();
    for (let id of avatarIds) {
        avatarPipeline.get<Token>(`token:${id}`);
    }
    const avatars: Token[] = avatarIds.length ? await avatarPipeline.exec() : [];

    const avatarMap = avatars.reduce((map, token) => {
        map[token.id] = token;
        return map;
    }, {});

    const userVMs: UserViewModel[] = users.map(user => ({
        address: user.address,
        nickname: user.nickname,
        avatar: avatarMap[user.avatar] || null
    }))

    return userVMs;
}