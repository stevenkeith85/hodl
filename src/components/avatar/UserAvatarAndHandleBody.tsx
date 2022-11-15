import dynamic from 'next/dynamic';
import theme from '../../theme';
import { AvatarLoadingMemo } from './AvatarLoading';
import { UserHandleLoadingMemo } from './UserHandleLoading';


export const UserAvatarAndHandleBody = ({ 
    user, 
    size, 
    fontSize, 
    handle, 
    color
}) => {

    const UserAvatar = dynamic(
        () => import('./UserAvatar').then(mod => mod.UserAvatar),
        {
            ssr: false,
            loading: () => <AvatarLoadingMemo size={size} />
        }
    );

    const UserDefaultAvatar = dynamic(
        () => import('./UserDefaultAvatar').then(mod => mod.UserDefaultAvatar),
        {
            ssr: false,
            loading: () => <AvatarLoadingMemo size={size} />
        }
    );

    const UserHandle = dynamic(
        () => import('./UserHandle').then(mod => mod.UserHandle),
        {
            ssr: false,
            loading: () => <UserHandleLoadingMemo />
        }
    );
    
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
                        <UserAvatar user={user} size={size} /> :
                        <UserDefaultAvatar size={size} fontSize={size - 10} color={color} />
                }
                {
                    handle ?
                        <UserHandle user={user} fontSize={fontSize} /> : null
                }
            </div>
        </div>
    )
}