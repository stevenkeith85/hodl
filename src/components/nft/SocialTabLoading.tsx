import React from 'react';

import { HodlCommentsBoxLoading } from '../comments/HodlCommentsBoxLoading';
import { TokenNameAndDescriptionLoading } from './TokenNameAndDescriptionLoading';

const SocialTabLoading = ({ }) => (
    <div
        style={{
            background: 'white',
            padding: '16px',
            border: `1px solid #ddd`
        }}>
        <TokenNameAndDescriptionLoading />
        <HodlCommentsBoxLoading />
    </div>
)

export default SocialTabLoading;