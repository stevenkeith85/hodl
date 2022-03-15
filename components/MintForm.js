import { Button, Box, Grid, CircularProgress, Stack, Typography } from '@mui/material';
import { HodlTextField } from './HodlTextField';
import { HodlButton } from "./HodlButton";
import Image from 'next/image'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


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

  function myLoader({src, width, quality}) {
    return `https://res.cloudinary.com/dyobirj7r/c_limit,w_${700},q_${quality}/${src}`
  }

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
              disabled={!formInput.name || !formInput.description || minting || loading }
            >
              Mint Token
            </HodlButton>
          </Stack>
          </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        { Boolean(!loaded || loading) ?
          <Stack spacing={4} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '400px',
            width: '100%',
            maxWidth: '100%'
          }}>
            { Boolean(loading) && <CircularProgress color="secondary" /> }
            <Typography>Image will appear here</Typography>
          </Stack> :
          <>
            { Boolean(fileUrl) && 
            <Image 
              loader={ myLoader }
              src={`${fileUrl}`} 
              quality={75}
              width={700}
              height={600}
              layout="responsive"
              sizes="33vw"
              objectFit='contain'
            />}
            </>
      }
      </Grid>

    </Grid>
  )
}
