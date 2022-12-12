import theme from '../../theme';
import { UserAvatar } from './UserAvatar';
import { UserDefaultAvatar } from './UserDefaultAvatar';
import { UserHandle } from './UserHandle';


export const UserAvatarAndHandleBody = ({
    user,
    size,
    fontSize,
    handle,
    color
}) => {

    return (
        <div
            style={{
                display: 'flex',
                cursor: 'pointer'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                }}
            >
                {
                    user?.avatar ?
                        <UserAvatar user={user} size={size} />
                        :
                        <UserDefaultAvatar size={size} fontSize={size - 10} color={color} />
                }
                {
                    handle ?
                        <UserHandle user={user} fontSize={fontSize} /> 
                        : 
                        null
                }
            </div>
        </div>
    )
}