import Avatar from "@mui/material/Avatar";
import axios from "axios";
import useSWR from "swr";

import { assetType } from "../../lib/assetType";
import { AssetTypes } from "../../models/AssetType";
import { UserViewModel } from "../../models/User";
import { HodlAudioBoxMini } from "../HodlAudioBoxMini";
import { HodlImageResponsive } from "../HodlImageResponsive";

interface UserAvatarProps {
    user: UserViewModel;
    size: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size }) => {
    let { data: userData } = useSWR(
        [`/api/user`, user?.address],
        (url, address) => axios.get(`${url}/${address}`).then(r => r.data.user),
        { fallbackData: user }
    )

    return (<>
        <Avatar
            sx={{
                width: size,
                height: size
            }}
        >
            {userData?.avatar &&
                <div style={{ width: '100%' }}>
                    {assetType(userData?.avatar) === AssetTypes.Image &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={userData.avatar.image}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(userData?.avatar) === AssetTypes.Video &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={userData?.avatar?.image}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(userData?.avatar) === AssetTypes.Gif &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={userData?.avatar?.properties?.asset?.uri}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(userData?.avatar) === AssetTypes.Audio &&
                        <HodlAudioBoxMini size={size} />
                    }
                </div>
            }
        </Avatar>
    </>)
}

