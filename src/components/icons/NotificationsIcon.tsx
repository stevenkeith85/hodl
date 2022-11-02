import Notifications from '../../../public/notifications_FILL1_wght400_GRAD0_opsz48.svg';

export const NotificationsIcon = ({ size, fill }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <Notifications
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
