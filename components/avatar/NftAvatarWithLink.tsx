import axios from "axios";
import Link from "next/link";
import { memo } from "react";
import useSWR from "swr";
import { NftAvatar } from "./NftAvatar";

export const NftAvatarWithLink = ({ 
    token, 
    size, 
    profileAddress, 
    highlight = false,
    color= "greyscale"
 }: any) => {
    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname)
    )

    return (<>
        {
            profileNickname ?
                <Link href={`/profile/${profileNickname}`} passHref>
                    <a>
                        <NftAvatar token={token} size={size} highlight={highlight} color={color}/>
                    </a>

                </Link >
                :
                <Link href={`/profile/${profileAddress}`} passHref>
                    <a>
                        <NftAvatar token={token} size={size} highlight={highlight} color={color}/>
                    </a>
                </Link>
        }
    </>)
}

export const NftAvatarWithLinkMemo = memo(NftAvatarWithLink, 
    (prev: any, next: any) => prev.size === next.size && prev.token.id === next.token.id);