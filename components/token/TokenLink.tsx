import { Box } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import useSWR from 'swr';
import { assetType } from '../../lib/utils';
import { AssetTypes } from '../../models/AssetType';
import { HodlImage } from '../HodlImage';
import { HodlVideo } from '../HodlVideo';
import { Likes } from '../Likes';


export const TokenLink = ({ id }) => {
    const { data: token } = useSWR(id ? [`/api/token`, id] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token));

    return (
        <>
            {
                token &&
                <Link href={`/nft/${id}`}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{ cursor: 'pointer', width: `100%` }}
                    >
                        {token?.image && <Box>
                            {assetType(token) === AssetTypes.Image &&
                                <a>
                                    <HodlImage
                                        cid={token.image.split('//')[1]}
                                        effect={token.filter}
                                        height={'44px'}
                                        width={'44px'}
                                        sx={{ img: { borderRadius: 0 } }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Video &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        controls={false}
                                        onlyPoster={true}
                                        preload="none"
                                        audio={false}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Gif &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        gif={true}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Audio &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        controls={false}
                                        onlyPoster={true}
                                        preload="none"
                                        audio={true}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                        </Box>
                        }
             
                            {token?.name}
             
                    </Box>
                </Link>
            }
        </>
    )
}