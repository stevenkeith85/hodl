import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const SocialTabLoading = ({ }) => (
    <div
        style={{
            background: 'white',
            padding: '16px',
            border: `1px solid #ddd`
        }}>
        <div
            style={{
                marginBottom: '16px',
                position: 'relative',
                paddingBottom: 2,
            }}
        >
            <Skeleton variant="rectangular" width="100%" height="100px" animation="wave" />   
        </div>
        <Skeleton variant="rectangular" width="100%" height="300px" animation="wave" />
    </div>
)

export default SocialTabLoading;