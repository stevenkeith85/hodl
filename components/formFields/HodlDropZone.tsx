import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export const HodlDropzone = ({ onDrop, progress }) => {
    const validator = file => {
        if (file.type.indexOf("image") !== -1 && file.size > 10485760 ) {
            return  {
                code: "filesize-too-large",
                message: `Images can be up to 10MB`
              };
        } else if (file.type.indexOf("video") !== -1 && file.size > 104857600) {
            return  {
                code: "filesize-too-large",
                message: `Videos can be up to 100MB`
              };
        }

        return null;
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        maxFiles:1,
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
            margin: 0
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
                    {isDragActive ?
                        <Typography>Drop your file here</Typography> :
                        <Typography>Drag &apos;n&apos; drop your file here, or</Typography>
                    }
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