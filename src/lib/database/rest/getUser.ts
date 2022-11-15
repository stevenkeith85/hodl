import { UserViewModel } from "../../../models/User";
import { runRedisPipeline } from "./databaseUtils";
import { getToken } from "./getToken";


export const getUser = async (address: string, viewerAddress: string = null) => {
    try {
        const r = await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/HMGET/user:${address}/nickname/avatar/nonce`, {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            keepalive: true
        });

        const data = await r.json();

        const [nickname, avatar, nonce] = data.result;

        const vm: UserViewModel = {
            address,
            nickname,
            avatar,
            nonce,
            followedByViewer: false,
            followsViewer: false
        }

        const avatarTokenPromise = avatar ? getToken(avatar) : '';

        let viewerAddressPromise = null;
        if (viewerAddress) {
            const cmds = [
                ['ZSCORE', `user:${viewerAddress}:following`, address],
                ['ZSCORE', `user:${address}:following`, viewerAddress]
            ]

            viewerAddressPromise = runRedisPipeline(cmds)
        }

        const [avatarToken, viewerAddressResult] = await Promise.all([avatarTokenPromise, viewerAddressPromise]);

        vm.avatar = avatarToken;

        if (viewerAddressResult) {
          vm.followedByViewer = Boolean(viewerAddressResult[0]);
          vm.followsViewer = Boolean(viewerAddressResult[1]);
        }

        return vm;
    } catch (e) {
        console.log(e)
    }
}
