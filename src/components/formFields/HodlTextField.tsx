export const HodlTextField = ({type, value, onChange}) => (
    <input
        style={{
            background: 'white',
            width: '300px',
            padding: '16px',
            borderRadius: '8px',
            margin: '16px 0',
            border: '1px solid #ccc',
            fontSize: '16px',
            color: `rgba(0,0,0,0.87)`
        }}
        type={type}
        value={value}
        onChange={onChange}
    />
)