import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar, Stack, Typography
} from "@mui/material";
import { getShortAddress } from "../lib/utils";
import useSWR from "swr";
import { HodlImage2 } from "./HodlImage2";
import { HodlVideo } from "./HodlVideo";
import { useNickname } from "../hooks/useNickname";


const AvatarText: React.FC<{size: string, href?: string, children?: any, color: string}> = ({ size, href, children, color }) => {
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
                color: color === 'greyscale' ? 'white' : 'black'
            }}>
                {children}
            </Typography>
    )
}

export const ProfileAvatar = ({ profileAddress, reverse=false, size="medium", color="secondary" }) => {
    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => fetch(`${url}?address=${query}`)
            .then(r => r.json())
            .then(json => json.nickname))

    const { data: tokenId } = useSWR(profileAddress ? [`/api/profile/picture`, profileAddress] : null,
        (url, query) => fetch(`${url}?address=${query}`)
            .then(r => r.json())
            .then(json => json.token))

    const { data: token } = useSWR(tokenId ? [`/api/token`, tokenId] : null,
        (url, query) => fetch(`${url}/${query}`)
            .then(r => r.json())
            .then(json => json.token))

    const isGif = (mimeType) => mimeType && mimeType.indexOf('gif') !== -1;
    const isImage = (mimeType) => mimeType && mimeType.indexOf('image') !== -1;
    const isVideo = (mimeType) => mimeType && mimeType.indexOf('video') !== -1;

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
            spacing={ size === 'small' ? 1 : 2}
            direction={reverse ? 'row-reverse' : 'row'}
        >
            {token ?
                <Link href={`/nft/${token.tokenId}`}>
                    <Avatar
                        className="avatar"
                        sx={{
                            height: getSize(),
                            width: getSize(),
                        }}>
                        {isImage(token.mimeType) && !isGif(token.mimeType) &&
                            <HodlImage2
                                image={token?.image.split('//')[1]}
                                effect={`w_200,h_200${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}
                                imgSizes={`${getSize() + 10}px`}
                            />}
                        {isImage(token.mimeType) && isGif(token.mimeType) &&
                            <HodlVideo
                                gif={true}
                                cid={token?.image.split('//')[1]}
                                transformations={`w_200,h_200${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}
                            />}
                        {isVideo(token.mimeType) &&
                            <HodlVideo
                                controls={false}
                                cid={token?.image.split('//')[1]}
                                transformations={`w_200,h_200${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}
                                onlyPoster={true}
                            />}
                    </Avatar>
                </Link> :
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
            <Link href={`/profile/${profileNickname || profileAddress}`} passHref>
                {
                    profileNickname ? 
                        <AvatarText size={size} color={color}>{profileNickname}</AvatarText> :
                        <AvatarText size={size} color={color}>{getShortAddress(profileAddress)?.toLowerCase()}</AvatarText>
                }
            </Link>
        </Stack>
    )
}
