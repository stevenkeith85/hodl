
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import { Likes } from './Likes';
import { Comments } from './comments/Comments';
import { FullToken } from '../models/Nft';


interface NftWindowOverlayProps {
    nft: FullToken;
}

export const NftWindowOverlay: React.FC<NftWindowOverlayProps> = ({
    nft
}) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Box className='nftItemOverlay'
            sx={{
                background: "rgba(0,0,0,0.5)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: `100%`,
                opacity: 0,
                top: 0,
                left: 0,
                position: 'absolute',
                zIndex: 1,
                color: 'white'
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    gap: {
                        xs: 0,
                        sm: 1
                    }
                }}
            >
                <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    alignItems={"center"}
                    sx={{
                        height: '44px'
                    }}
                >
                    <Box
                        display="flex"

                        sx={{
                            color: 'white',
                            gap: {
                                xs: 2,
                                sm: 3
                            },
                        }}
                    >
                        <Likes
                            id={nft?.id}
                            object="token"
                            color='inherit'
                            fontSize={xs ? 14 : 18}
                            size={xs ? 20 : 22}
                            sx={{
                                cursor: 'pointer',
                                color: 'white',

                            }}
                        />
                        <Comments
                            nft={nft}
                            color='inherit'
                            fontSize={xs ? 14 : 18}
                            size={xs ? 20 : 22}
                            sx={{
                                paddingRight: 0,
                            }}

                        />
                    </Box>
                </Box>
            </Box>
        </Box >)
}
