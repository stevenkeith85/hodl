import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar, Stack, Tooltip, Typography
} from "@mui/material";
import { getShortAddress, truncateText } from "../lib/utils";
import useSWR from "swr";
import { HodlImage } from "./HodlImage";
import { HodlVideo } from "./HodlVideo";
import { memo } from "react";
import theme from "../theme";
import axios from 'axios';

export const NftAvatarWithLink = ({ token, size, highlight = false }: any) => (
    <Link href={`/nft/${token.tokenId}`} passHref>
        <a>
            <NftAvatar token={token} size={size} highlight={highlight} />
        </a>
    </Link>
)

export const NftAvatar = ({ token, size, highlight = false }: any) => {
    const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;
    const isImage = mimeType => mimeType && mimeType.indexOf('image') !== -1;
    const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
    const isUnknown = mimeType => !mimeType;

    return (
        <Avatar
            className="avatar"
            sx={{
                border: highlight ? '2px solid' : 'none',
                borderColor: highlight ? theme => theme.palette.secondary.main : 'none',
                height: size,
                width: size,
                transition: theme.transitions.create(['background-color', 'transform'], {
                    duration: theme.transitions.duration.standard,
                }),
                '&:hover': {
                    transform: 'scale(1.2)',
                }
            }}>
            {((isImage(token.mimeType) && !isGif(token.mimeType)) || isUnknown(token.mimeType)) &&
                <HodlImage
                    cid={token?.image.split('//')[1] || token?.image}
                    effect={token?.filter ? `${token.filter},ar_1.0,c_fill,r_max,g_face` : `ar_1.0,c_fill,r_max,g_face`}
                    height={size}
                    srcSetSizes={[Math.ceil(size), Math.ceil(size * 1.5), Math.ceil(size * 2), Math.ceil(size * 2.5)]} // we want it big enough for the scale effect
                    sizes=""
                />
            }
            {isImage(token.mimeType) && isGif(token.mimeType) &&
                <HodlVideo
                    gif={true}
                    cid={token?.image.split('//')[1] || token?.image}
                    transformations={`w_${size * 2.5},h_${size * 2.5}${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}

                />
                }
            {isVideo(token.mimeType) &&
                <HodlVideo
                    controls={false}
                    cid={token?.image.split('//')[1] || token?.image}
                    transformations={`w_${size * 2.5},h_${size * 2.5}${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}
                    onlyPoster={true}
                />
                }

        </Avatar>
    )
}

export const NftAvatarWithLinkMemo = memo(NftAvatarWithLink, (prev: any, next: any) => prev.size === next.size && prev.token.tokenId === next.token.tokenId);
export const NftAvatarMemo = memo(NftAvatar, (prev: any, next: any) => prev.size === next.size && prev.token.tokenId === next.token.tokenId);

const AvatarText: React.FC<{ size: string, href?: string, children?: any, color: string }> = ({ size, href, children, color }) => {
    const mappings = {
        small: 14,
        medium: 14,
        large: 18
    }

    return (
        <Typography
            component="a"
            href={href}
            className="address"
            sx={{
                fontSize: mappings[size],
                textDecoration: 'none',
                color: color === 'greyscale' ? 'white' : '#000'
            }}>
            {children}
        </Typography>
    )
}

export const ProfileAvatar = ({ profileAddress, reverse = false, size = "medium", color = "secondary", showNickname = true, withLink = true }) => {
    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname))

    const { data: tokenId } = useSWR(profileAddress ? [`/api/profile/picture`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.token))

    const { data: token } = useSWR(tokenId ? [`/api/token`, tokenId] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token))


    const getSize = () => {
        const mappings = {
            small: 36,
            medium: 54,
            large: 90
        }

        return mappings[size];
    }

    const getColor = theme => {
        const mappings = {
            primary: theme.palette.primary.light,
            secondary: theme.palette.secondary.main,
            greyscale: 'rgba(0,0,0,0.3)'
        }

        return mappings[color]
    }

    return (
        <Stack sx={{
            alignItems: "center",
            cursor: 'pointer',
        }}
            spacing={size === 'small' ? 1 : 2}
            direction={reverse ? 'row-reverse' : 'row'}
        >
            {token ?
                withLink ? <NftAvatarWithLinkMemo token={token} size={getSize()} /> : <NftAvatarMemo token={token} size={getSize()} /> :
                <Link href={profileAddress ? `/profile/${profileNickname || profileAddress}` : ''}>
                    <Avatar
                        className="avatar"
                        sx={{
                            height: getSize(),
                            width: getSize(),
                            bgcolor: (theme) => getColor(theme),
                            border: size === 'small' ? `1.5px solid` : `2px solid`,
                            '&:hover': {
                                cursor: 'pointer',
                                bgcolor: 'white',
                                borderColor: theme => getColor(theme),
                                '.icon': {
                                    color: theme => getColor(theme),
                                    bgcolor: 'white'
                                }
                            }
                        }}>

                        <PersonIcon
                            className="icon"
                            sx={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: getSize() - 10,
                            }}

                        />
                    </Avatar>
                </Link >

            }
            {showNickname && <Link href={`/profile/${profileNickname || profileAddress}`} passHref>
                {
                    profileNickname ?
                        <Tooltip title={profileNickname}>
                            <div>
                                <AvatarText size={size} color={color}>{truncateText(profileNickname, 20)}</AvatarText>
                            </div>
                        </Tooltip> :
                        <Tooltip title={profileAddress}>
                            <div>
                                <AvatarText size={size} color={color}>{getShortAddress(profileAddress)?.toLowerCase()}</AvatarText>
                            </div>
                        </Tooltip>
                }
            </Link>
            }
        </Stack>
    )
}
