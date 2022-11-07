import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
                borderRadius: 1,
                overflow: 'hidden',
                padding: 2,
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
                    gap={3}
                >
                    <Box display="flex" gap={2}>
                        <PhotoOutlinedIcon
                            color="secondary"
                            sx={{
                                fontSize: {
                                    xs: 40,
                                    sm: 50
                                }
                            }}
                        />
                        <Tooltip title="Videos will be truncated to 15 seconds. We recommend trimming it yourself before upload">
                            <VideocamOutlinedIcon
                                color="secondary"
                                sx={{
                                    fontSize: {
                                        xs: 40,
                                        sm: 50
                                    }
                                }}
                            /></Tooltip>
                        <Tooltip title="Audio will be truncated to 60 seconds. We recommend trimming it yourself before upload">
                            <AudiotrackOutlinedIcon
                                color="secondary"
                                sx={{
                                    fontSize: {
                                        xs: 40,
                                        sm: 50
                                    }
                                }}
                            /></Tooltip>
                    </Box>
                    <Typography
                        sx={{
                            marginY: 1,
                            color: theme => theme.palette.text.secondary,
                            fontSize: {
                                xs: 16,
                                sm: 18
                            }
                        }}>
                        Drag a photo, video, or audio clip here
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
                            Select
                        </Button>
                    </div>
                </Box>
            </Box>

        </Box>
    )
}
