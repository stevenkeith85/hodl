import KeyboardBackspace from '../../../public/keyboard_backspace_FILL1_wght400_GRAD200_opsz48.svg';

export const KeyboardBackspaceIcon = ({ size, fill='currentColor' }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <KeyboardBackspace
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
