import React from 'react';

import { HodlCommentsBoxLoading } from '../comments/HodlCommentsBoxLoading';
import { TokenNameAndDescriptionLoading } from './TokenNameAndDescriptionLoading';

const SocialTabLoading = ({ nft }) => (
    <div
        style={{
            background: 'white',
            padding: '16px',
            border: `1px solid #ddd`
        }}>
        <TokenNameAndDescriptionLoading nft={nft}/>
        <HodlCommentsBoxLoading />
    </div>
)

export default SocialTabLoading;