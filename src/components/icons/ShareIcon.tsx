import Share from '../../../public/share_FILL1_wght400_GRAD0_opsz48.svg';

export const ShareIcon = ({size, fill}) => (
    <div style={{ 
        width: size,
        height: size,
    }}>
        <Share 
            width={'100%'}
            height={'100%'}
            fill={fill} 
            viewBox={'0 0 48 48'}
             />
    </div>
)
