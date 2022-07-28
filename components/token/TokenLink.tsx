import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { assetType } from '../../lib/utils';
import { AssetTypes } from '../../models/AssetType';
import { Token } from '../../models/Token';
import { HodlImage } from '../HodlImage';
import { HodlVideo } from '../HodlVideo';


interface TokenLinkProps {
    token: Token;
    size?: string;
    fontSize?: string;
}

export const TokenLink: React.FC<TokenLinkProps> = ({ token, size = "40px", fontSize = "14px" }) => {
    return (
        <>
            <Link href={`/nft/${token.id}`}>
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
                                    cid={token.image}
                                    effect={token.filter}
                                    height={size}
                                    width={size}
                                    sx={{ img: { borderRadius: 0 } }}
                                />
                            </a>
                        }
                        {assetType(token) === AssetTypes.Video &&
                            <a>
                                <HodlVideo
                                    cid={token.image}
                                    controls={false}
                                    onlyPoster={true}
                                    preload="none"
                                    audio={false}
                                    height={size}
                                    width={size}
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
                                    cid={token.image}
                                    gif={true}
                                    height={size}
                                    width={size}
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
                                    cid={token.image}
                                    controls={false}
                                    onlyPoster={true}
                                    preload="none"
                                    audio={true}
                                    height={size}
                                    width={size}
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
                    <Typography sx={{ fontSize, textTransform: 'lowercase' }}>{token?.name}</Typography>
                </Box>
            </Link>
        </>
    )
}