import ExpandMore from '../../../public/expand_more_FILL1_wght400_GRAD200_opsz48.svg';

export const ExpandMoreIcon = ({ size, fill='currentColor' }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <ExpandMore
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
