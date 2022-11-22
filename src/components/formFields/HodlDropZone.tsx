import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import grey from '@mui/material/colors/grey';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import React from 'react'
import { useDropzone } from 'react-dropzone'

export const HodlDropzone = ({ onDrop, loading }) => {
    const validator = file => {
        if (file.type.indexOf("video") !== -1 && file.size > 100 * 1024 * 1024) {
            return {
                code: "filesize-too-large",
                message: `Videos can be up to 100MB`
            };
        }

        return null;
    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: ['image/*', 'video/*', 'audio/*'],
        validator
    })

    return (
        <Box
            sx={{
                // borderRadius: 1,
                overflow: 'hidden',
                margin: 0,
                cursor: 'pointer',
            }}
        >
            <Box {...getRootProps()}>
                <input {...getInputProps()} />
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    gap={4}
                >
                    <Box
                        display="flex"
                        gap={{ xs: 1, sm: 2 }}
                    >
                        <PhotoOutlinedIcon
                            color="secondary"
                            sx={{
                                fontSize: {
                                    xs: 36,
                                    sm: 40
                                }
                            }}
                        />
                        <Tooltip
                            title="Coming soon"
                        // title="We recommend trimming your video to 15s before upload"
                        >
                            <VideocamOutlinedIcon
                                sx={{
                                    color: grey[300],
                                    fontSize: {
                                        xs: 36,
                                        sm: 40
                                    }
                                }}
                            /></Tooltip>
                        <Tooltip
                            title="Coming soon"
                        // title="We recommend trimming your audio to 60s before upload"
                        >
                            <AudiotrackOutlinedIcon
                                sx={{
                                    color: grey[300],
                                    fontSize: {
                                        xs: 36,
                                        sm: 40
                                    }
                                }}
                            /></Tooltip>
                    </Box>
                    <Typography
                        sx={{
                            color: theme => theme.palette.text.secondary,
                            fontSize: {
                                xs: 14,
                                sm: 16
                            }
                        }}>
                        {/* Image, video (&#8804; 15s) or audio (&#8804; 60s) */}
                        Create an Image NFT
                    </Typography>
                    <div>
                        <Button
                            disabled={loading}
                            color="primary"
                            variant="contained"
                            sx={{
                                paddingX: 3,
                                paddingY: 1
                            }}>
                            Select asset
                        </Button>
                    </div>
                </Box>
            </Box>

        </Box>
    )
}
