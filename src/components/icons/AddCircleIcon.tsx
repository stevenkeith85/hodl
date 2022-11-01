import AddCircle from '../../../public/add_circle_FILL1_wght400_GRAD0_opsz48.svg';

export const AddCircleIcon = ({ size, fill }) => (
    <div style={{ width: size, height: size }}>
        <AddCircle
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
