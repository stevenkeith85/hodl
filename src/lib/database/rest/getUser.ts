import { UserViewModel } from "../../../models/User";
import { runRedisPipeline } from "./pipeline";
import { getToken } from "./getToken";
import { hmGet } from "./hmGet";

// TODO: This could be enhanced accepting the user fields we are interested in. 
// At the moment we just toggle between asking for the nonce or not.
// This is mostly used by the UI, so I'm not sure that we even need to return the nonce; potentially can go at some point.
export const getUser = async (address: string, viewer: string = null, nonce = false) => {
    if (!address) {
        return null;
    }
    
    try {
        const user = nonce ?
            await hmGet<{ nickname, avatar, nonce }>(`user:${address}`, 'nickname', 'avatar', 'nonce') :
            await hmGet<{ nickname, avatar }>(`user:${address}`, 'nickname', 'avatar');

        const vm: UserViewModel = {
            address,
            ...user,
            followedByViewer: false,
            followsViewer: false
        }
        
        if (!vm.avatar && !viewer) {
            // no more database calls to make
            return vm;
        }
        
        if (vm.avatar && !viewer) {
            // one database call to make
            vm.avatar = await getToken(vm.avatar);
            return vm;
        }
        
        if (!vm.avatar && viewer) {            
            // two database calls to make
            const cmds = [
                ['ZSCORE', `user:${viewer}:following`, address],
                ['ZSCORE', `user:${address}:following`, viewer]
            ]

            const [followedByViewer, followsViewer] = await runRedisPipeline(cmds);

            vm.followedByViewer = Boolean(followedByViewer);
            vm.followsViewer = Boolean(followsViewer);
            return vm;
        }

        if (vm.avatar && viewer) {
            // three database calls to make
            const cmds = [
                ['GET', `token:${vm.avatar}`],
                ['ZSCORE', `user:${viewer}:following`, address],
                ['ZSCORE', `user:${address}:following`, viewer]
            ]

            const [avatarToken, followedByViewer, followsViewer] = await runRedisPipeline(cmds);

            vm.avatar = JSON.parse(avatarToken);
            vm.followedByViewer = Boolean(followedByViewer);
            vm.followsViewer = Boolean(followsViewer);
            return vm;
        }

        // we shouldn't actually reach this
        return vm;
    } catch (e) {
        console.log(e)
    }
}
