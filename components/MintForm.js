import { Button, Box, Grid, CircularProgress, Stack, Typography } from '@mui/material';
import { HodlTextField } from './HodlTextField';
import { HodlButton } from "./HodlButton";


export const MintForm = ({
  formInput,
  updateFormInput,
  onChange,
  fileUrl,
  createItem,
  loading,
  loaded,
  minting,
  cloudinaryUrl
}) => {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          <HodlTextField
            type="file"
            label="Image"
            onChange={onChange}
            disabled={loading}
          />
          <HodlTextField
            label="Name"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <HodlTextField
            label="Description"
            multiline
            minRows={2}
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <HodlButton
              onClick={createItem}
              disabled={minting}
            >
              Mint Token
            </HodlButton>
          </Stack>
          </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{
          border: '1px solid rgb(229, 231, 235)',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '300px',
          height: 'auto',
          width: '100%',
          img: {
            maxWidth: '100%'
          }
        }}>

          {Boolean(loading) && <CircularProgress color="secondary" />}
          {Boolean(loaded) ?
            <img src={`/uploads/${fileUrl}`} /> :
            <Typography sx={{ padding: 2 }}>Image preview will appear here</Typography>
          }
        </Box>
      </Grid>

    </Grid>
  )
}
