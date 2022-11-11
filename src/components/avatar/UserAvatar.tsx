import Avatar from "@mui/material/Avatar";

import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { UserViewModel } from "../../models/User";
import { HodlAudioBoxMini } from "../HodlAudioBoxMini";
import { HodlImageResponsive } from "../HodlImageResponsive";

interface UserAvatarProps {
    user: UserViewModel;
    size: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size }) => {
    return (<>
        <Avatar
            sx={{
                width: size,
                height: size
            }}
        >
            {user?.avatar &&
                <div style={{ width: '100%'}}>
                    {assetType(user?.avatar) === AssetTypes.Image &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={user.avatar.image}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(user?.avatar) === AssetTypes.Video &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={user?.avatar?.image}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(user?.avatar) === AssetTypes.Gif &&
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            cid={user?.avatar?.properties?.asset?.uri}
                            widths={[size, size * 2]}
                            sizes={size}
                            aspectRatio="1:1"
                            round="max"
                        />
                    }
                    {assetType(user?.avatar) === AssetTypes.Audio &&
                        <HodlAudioBoxMini size={size} />
                    }
                </div>
            }
        </Avatar>
    </>)
}

