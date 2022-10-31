import { UserViewModel } from "../../../models/User";
import { getTokens } from "./Tokens";

export const getUsers = async (addresses: string[]) => {
    const cmds = [];
    for (let address of addresses) {
        cmds.push(['HMGET', `user:${address}`, 'address', 'nickname', 'avatar']);
    }

    try {
        const r = await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            body: JSON.stringify(cmds)
        });

        const data = await r.json();
          
        const users = data.filter(item => item.result).map(item => 
            ({
                address:item.result[0],
                nickname:item.result[1],
                avatar:item.result[2]
            }))

        const avatarIds = users.filter(user => user.avatar).map(user => user.avatar); // avatars are optional

        const avatars = await getTokens(avatarIds);

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
    } catch (e) {
        console.log(e)
    }
}
