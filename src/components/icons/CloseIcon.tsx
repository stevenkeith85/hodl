import Close from '../../../public/close_FILL1_wght400_GRAD0_opsz48.svg';

export const CloseIcon = ({ size, fill }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <Close
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
