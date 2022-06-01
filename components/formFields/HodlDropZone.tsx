import { Box, Button, LinearProgress, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { useDropzone } from 'react-dropzone'

export const HodlDropzone = ({ onDrop, progress }) => {
    const validator = file => {
        if (file.type.indexOf("image") !== -1 && file.size > 10 * 1024 * 1024 ) {
            return  {
                code: "filesize-too-large",
                message: `Images can be up to 10MB`
              };
        } else if (file.type.indexOf("video") !== -1 && file.size > 100 * 1024 * 1024) {
            return  {
                code: "filesize-too-large",
                message: `Videos can be up to 100MB`
              };
        }

        return null;
    }
    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        maxFiles:1,
        accept: ['image/*', 'video/*', 'audio/*'],
        validator
    })

    return (
        <Box
        sx={{
            border: `1px solid #d0d0d0`,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'space-between',
            overflow: 'hidden',
            padding: 0,
            margin: 0,
            cursor: 'pointer'
        }}
        >
            <Box
                {...getRootProps()}
                sx={{
                    padding: 8,
                    flexGrow: 1
                }}>
                <input {...getInputProps()} />
                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                    <Typography>Image, Video, or Audio</Typography>
                    <div><Button>Browse Files</Button></div>
                </Stack>
            </Box>
            <Box
                sx={{
                    flexGrow: 0,
                    zIndex: 0,
                }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
        </Box>
    )
}