import { AudiotrackOutlined, PhotoOutlined, VideocamOutlined } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useDropzone } from 'react-dropzone'

export const HodlDropzone = ({ onDrop }) => {
    const validator = file => {
        if (file.type.indexOf("image") !== -1 && file.size > 10 * 1024 * 1024) {
            return {
                code: "filesize-too-large",
                message: `Images can be up to 10MB`
            };
        } else if (file.type.indexOf("video") !== -1 && file.size > 100 * 1024 * 1024) {
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
                    gap={4}
                >
                    <Box display="flex" gap={2}>
                        <PhotoOutlined
                            color="secondary"
                            sx={{
                                fontSize: {
                                    xs: 40,
                                    sm: 50
                                }
                            }}
                        />
                        <VideocamOutlined
                            color="secondary"
                            sx={{
                                fontSize: {
                                    xs: 40,
                                    sm: 50
                                }
                            }}
                        />
                        <AudiotrackOutlined
                            color="secondary"
                            sx={{
                                fontSize: {
                                    xs: 40,
                                    sm: 50
                                }
                            }}
                        />
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