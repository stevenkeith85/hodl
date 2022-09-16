import { AudiotrackOutlined, Photo, PhotoOutlined, Videocam, VideocamOffOutlined, VideocamOutlined } from '@mui/icons-material'
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
            // border: `1px solid #d0d0d0`,
            borderRadius: 1,
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center',
            // justifyContent: 'center',
            overflow: 'hidden',
            padding: 10,
            margin: 0,
            cursor: 'pointer',
            // height:'550px',
        }}
        >
            <Box
                {...getRootProps()}
                
                >
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
                        <PhotoOutlined color="secondary" sx={{ fontSize: '50px' }} />
                        <VideocamOutlined color="secondary" sx={{ fontSize: '50px' }} />
                        <AudiotrackOutlined color="secondary" sx={{ fontSize: '50px' }} />
                    </Box>
                    <Typography sx={{ fontSize: '20px'}}>Drag a photo, video, or audio clip here</Typography>
                    <div><Button color="primary" variant="contained" sx={{ paddingX: 3, paddingY: 1}}>Select</Button></div>
                </Box>
            </Box>
            
        </Box>
    )
}