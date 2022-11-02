import Skeleton from '@mui/material/Skeleton';


export default function TokenActionBoxLoading({ }) {
  return (<div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <Skeleton variant="rectangular" width="20px" height="20px" animation="wave" />
      <Skeleton variant="rectangular" width="20px" height="20px" animation="wave" />
    </div>
    <Skeleton variant="rectangular" width="20px" height="20px" animation="wave" />
  </div>
  )
}