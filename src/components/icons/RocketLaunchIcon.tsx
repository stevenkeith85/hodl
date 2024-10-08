import RocketLaunch from '../../../public/rocket_launch_FILL1_wght400_GRAD200_opsz48.svg';

export const RocketLaunchIcon = ({size, fill}) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <RocketLaunch 
            width={'100%'}
            height={'100%'}
            fill={fill} 
            viewBox={'0 0 48 48'}
             />
    </div>
)
