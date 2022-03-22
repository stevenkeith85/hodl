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
    return `https://res.cloudinary.com/dyobirj7r/c_limit,w_${700},q_auto/${src}`
  }

  const descriptionPlaceholder = "A short description\n\nFollowed by a longer description works well.";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack spacing={4}>
          <HodlTextField
            type="file"
            label="Image"
            onChange={onChange}
            disabled={loading}
          />
          <HodlTextField
            label="Name"
            placeholder="My NFT"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <HodlTextField
            label="Description"
            placeholder={descriptionPlaceholder}
            multiline
            minRows={8}
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
            <Typography sx={{ color: `rgba(0,0,0,0.2)`}}>Image will appear here</Typography>
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
