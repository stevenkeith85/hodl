import DataObject from '../../../public/data_object_FILL1_wght400_GRAD200_opsz48.svg';

export const DataObjectIcon = ({ size, fill='currentColor' }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <DataObject
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
