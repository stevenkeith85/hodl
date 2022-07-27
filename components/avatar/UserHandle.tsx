import { Typography } from '@mui/material';
import { FC } from 'react';
import { getShortAddress, truncateText } from '../../lib/utils';
import { User } from '../../models/User';

interface UserHandle {
    user: User;
    fontSize: string;
}

export const UserHandle: FC<UserHandle> = ({ user, fontSize }) => {
    return (<>
        <Typography sx={{
            fontSize
        }}>{user.nickname ? truncateText(user.nickname, 20) : getShortAddress(user.address)}</Typography>
    </>
    )
}