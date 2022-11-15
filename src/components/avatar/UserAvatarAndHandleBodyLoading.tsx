import theme from '../../theme';
import { AvatarLoadingMemo } from './AvatarLoading';
import { UserHandleLoadingMemo } from './UserHandleLoading';


export const UserAvatarAndHandleBodyLoading = ({
    size, 
    handle, 
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
                    <AvatarLoadingMemo size={size} />
                }
                {
                    handle ?
                        <UserHandleLoadingMemo /> : null
                }
            </div>
        </div>
    )
}