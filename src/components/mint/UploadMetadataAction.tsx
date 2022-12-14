import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { useEffect, useRef, useState } from "react";
import { useSnackbar } from 'notistack';
import { useUploadMetadata } from "../../hooks/useUploadMetadata";

import { commercial, nonCommercial, token } from "../../lib/copyright";

import { HodlBorderedBox } from "../HodlBorderedBox";
import { ipfsMetadataValidationSchema } from "../../validation/uploadToIPFS";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

export const UploadMetadataAction = ({
  formData,
  setFormData,
  stepComplete,
  setLoading,
  loading,
  setStepComplete,
  setMetadata
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const uploadMetadata = useUploadMetadata();

  const descriptionExample = `I'm going to write a nice description here

So that other users can read about this token.

I'll add a few tags to help with search.

#tag #tag2 #tag3
  `
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    ipfsMetadataValidationSchema.isValid({
      name: formData.name,
      description: formData.description,
      license: formData.license,
      filter: formData.filter,
      mimeType: formData.mimeType,
      aspectRatio: formData.aspectRatio,
      assetCid: formData.assetCid,
      imageCid: formData.imageCid
    }).then(value => setIsValid(value))
  }, [formData.name, formData.description, formData.license, formData.filter, formData.mimeType, formData.aspectRatio, formData.assetCid, formData.imageCid])

  const lastUpload = useRef(null);

  const isUploadTheSameAsLastTime = () => {
    return JSON.stringify({
      name: formData.name,
      description: formData.description,
      license: formData.license,
      filter: formData.filter,
      mimeType: formData.mimeType,
      aspectRatio: formData.aspectRatio,
      assetCid: formData.assetCid,
      imageCid: formData.imageCid
    }) == JSON.stringify(lastUpload.current)
  }
  
  async function ipfsMetadataUpload() {
    setLoading(true);

    try {
      if (isUploadTheSameAsLastTime()) {
        throw new Error("This data has already been uploaded")
      }

      const metadataUrl = await uploadMetadata(
        formData.name,
        formData.description,
        formData.license,
        formData.filter,
        formData.mimeType,
        formData.aspectRatio,
        formData.assetCid,
        formData.imageCid,
      );

      setFormData(prev => ({
        ...prev,
        metadataUrl
      }))

      setMetadata({
        name: formData.name,
        description: formData.description,
        license: formData.license,
      });

      lastUpload.current = {
        name: formData.name,
        description: formData.description,
        license: formData.license,
        filter: formData.filter,
        mimeType: formData.mimeType,
        aspectRatio: formData.aspectRatio,
        assetCid: formData.assetCid,
        imageCid: formData.imageCid,
      }
      
      enqueueSnackbar(
        `IPFS Metadata uploaded`,
        {
          variant: "success",
          hideIconVariant: true
        });

      setStepComplete(3);
    } catch (e) {
      enqueueSnackbar(
        e.message,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
    setLoading(false);
  }
  return (<>
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }}>
        <TextField
          label="Name"
          placeholder="A name for my token"
          type="text"
          autoComplete='off'
          sx={{
            background: 'white',
            width: '100%',
            maxWidth: '500px',
          }}
          value={formData.name}
          onChange={e => setFormData(old => ({ ...old, name: e.target.value }))}
        />
        <TextField
          multiline
          minRows={10}
          label="Description"
          placeholder={descriptionExample}
          type="text"
          autoComplete='off'
          fullWidth
          sx={{
            background: 'white',
            width: '100%',
            maxWidth: '500px',
          }}
          value={formData.description}
          onChange={e => setFormData(old => ({ ...old, description: e.target.value }))}
        />
        <HodlBorderedBox sx={{
          marginBottom: 0,
          background: 'white',
            width: '100%',
            maxWidth: '500px',
        }}>
          <FormLabel>Asset License</FormLabel>
          <Box marginTop={1}>
            <RadioGroup
              name="asset-license"
            >
              <FormControlLabel
                onClick={() => setFormData(old => ({ ...old, license: token }))}
                value={token}
                control={<Radio size="small" sx={{ paddingY: 1 }} />}
                label={<Typography color={grey[700]}>None</Typography>}
              />
              <FormControlLabel
                onClick={() => setFormData(old => ({ ...old, license: nonCommercial }))}
                value={nonCommercial}
                control={<Radio size="small" sx={{ paddingY: 1 }} />}
                label={<Typography color={grey[700]}>Non Commercial</Typography>}
              />
              <FormControlLabel
                onClick={() => setFormData(old => ({ ...old, license: commercial }))}
                value={commercial}
                control={<Radio size="small" sx={{ paddingY: 1 }} />}
                label={<Typography color={grey[700]}>Commercial</Typography>}
              />
            </RadioGroup>
          </Box>

        </HodlBorderedBox>
        {formData?.assetCid ?
          <Box sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', gap: 2 }}>Asset ready <CheckBoxIcon color="success" sx={{ fontSize: 14 }}/></Box> :
          <Box sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', gap: 2 }}>Preparing asset <HodlLoadingSpinner size={14} /></Box>
        }
        <div style={{ textAlign: 'center' }}>
          <Button
            color="primary"
            variant="contained"
            sx={{
              paddingX: 3,
              paddingY: 1
            }}
            type="submit"
            disabled={!isValid}
            onClick={ipfsMetadataUpload}
          >
            Upload Metadata
          </Button>
        </div>
      <Box sx={{ textAlign: 'center' }}>Metadata is frozen at mint</Box>
    </Box>
  </>)
}
