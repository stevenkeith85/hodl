import NotificationsNone from '../../../public/notifications_FILL0_wght400_GRAD0_opsz48.svg';

export const NotificationsNoneIcon = ({ size, fill }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <NotificationsNone
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
