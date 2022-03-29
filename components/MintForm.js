import { Button, Box, Grid, CircularProgress, Stack, Typography } from '@mui/material';
import { HodlTextField } from './HodlTextField';
import { HodlButton } from "./HodlButton";
import { HodlImage } from './HodlImage';
import { Build } from '@mui/icons-material';


export const MintForm = ({
  formInput,
  updateFormInput,
  onChange,
  fileUrl,
  createItem,
  loading,
  loaded,
  minting
}) => {

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={6}>
        <Stack spacing={4} 
          sx={{
            marginRight: {
              md: 4
            },
            marginBottom: {
              xs: 4,
              md: 0
            }
          }}>
          <HodlTextField
            type="file"
            onChange={onChange}
            disabled={loading}
            helperText="We support images, including animated GIFs. Maximum file size of 10MB."
          />
          <HodlTextField
            label="Token Name"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            helperText="A name for your token"
          />
          <HodlTextField
            label="Token Description"
            multiline
            minRows={8}
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            helperText="A multi-line description for your token. No HTML"
          />
          <Stack direction="row" spacing={2}>
            <HodlButton
              onClick={createItem}
              disabled={!formInput.name || !formInput.description || minting || loading }
              startIcon={<Build fontSize="large" />}
            >
              Mint Token
            </HodlButton>
          </Stack>
          </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        { Boolean(!loaded || loading) ?
          <Stack spacing={4} sx={{
            border: `1px solid rgba(0,0,0,0.2)`,
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '395px',
            width: '100%',
            maxWidth: '100%'
          }}>
            { Boolean(loading) && <CircularProgress color="secondary" /> }
            <Typography sx={{ color: `rgba(0,0,0,0.2)`}}>Image preview will appear here</Typography>
          </Stack> :
          <>
            { Boolean(fileUrl) && (<>
            <HodlImage image={ fileUrl.split('/')[1] } folder='uploads' />
            </>
            )
}
            </>
      }
      </Grid>
    </Grid>
  )
}
