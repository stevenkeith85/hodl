import Search from '../../../public/search_FILL1_wght400_GRAD0_opsz48.svg';

export const SearchIcon = ({ size, fill }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <Search
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
