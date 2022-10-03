import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { assetType } from '../../lib/utils';
import { AssetTypes } from '../../models/AssetType';
import { Token } from '../../models/Token';
import { HodlAudioBoxMini } from '../HodlAudioBoxMini';
import { HodlImageResponsive } from '../HodlImageResponsive';
import { HodlVideo } from '../HodlVideo';


interface TokenLinkProps {
    token: Token;
    size?: number;
    fontSize?: number;
}

export const TokenLink: React.FC<TokenLinkProps> = ({ token, size = 44, fontSize = 14 }) => {

    return (<>
        <Link href={`/nft/${token.id}`} passHref>
            <Typography component="a" sx={{
                textDecoration: 'none',
                color: '#333'
            }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                        cursor: 'pointer',
                        width: `100%`,
                    }}
                >
                    {token?.properties?.asset?.uri &&
                        <Box>
                            {assetType(token) === AssetTypes.Image &&
                                <HodlImageResponsive
                                    cid={token?.properties?.asset?.uri}
                                    aspectRatio="1:1"
                                    widths={[44, 88]}
                                    sizes={`${size}px`}
                                />
                            }
                            {assetType(token) === AssetTypes.Video &&
                                <HodlImageResponsive
                                    cid={token?.image}
                                    aspectRatio="1:1"
                                    widths={[44, 88]}
                                    sizes={`${size}px`}
                                />
                            }
                            {assetType(token) === AssetTypes.Gif &&
                                <HodlVideo
                                    cid={token?.properties?.asset?.uri}
                                    gif={true}
                                    assetFolder="image"
                                    height={`${size}px`}
                                    width={`${size}px`}
                                />
                            }
                            {assetType(token) === AssetTypes.Audio &&
                                <HodlAudioBoxMini size={size} />
                            }
                        </Box>
                    }
                    <Typography sx={{
                        fontSize,
                        color: theme => theme.palette.text.secondary
                    }}>{token?.name}</Typography>
                </Box>
            </Typography>
        </Link>
    </>)
}