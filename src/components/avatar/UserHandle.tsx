import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { truncateText } from '../../lib/truncateText';
import { getShortAddress } from "../../lib/getShortAddress";
import { User } from '../../models/User';


interface UserHandle {
    user: User;
    fontSize: string;
}

export const UserHandle: FC<UserHandle> = ({ user, fontSize }) => {
    return (<>
        <Typography 
            sx={{ 
                fontSize,
                color: theme => theme.palette.text.secondary }}>
            {user?.nickname ? 
                truncateText(user.nickname, 10) : 
                getShortAddress(user?.address)}
        </Typography>
    </>
    )
}