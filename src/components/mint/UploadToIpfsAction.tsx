import { TextField, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Tooltip, Typography } from "@mui/material";

import { FC, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";

import { commercial, nonCommercial, token } from "../../lib/copyright";

import { grey } from "@mui/material/colors";
import { AssetLicenseTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { HodlBorderedBox } from "../HodlBorderedBox";
import { DescriptionTooltip } from "../tooltips/DescriptionTooltip";
import { NameTooltip } from "../tooltips/NameTooltip";


const UploadTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      Upload the metadata to IPFS.
    </Typography>
    <Typography mb={2}>
      This decentralizes the content.
    </Typography>
    <Typography>
      Once uploaded to IPFS; the asset and its metadata cannot change.
    </Typography>
  </Box>
)

export const UploadToIpfsAction: FC<MintProps> = ({
  formData,
  setFormData,
  stepComplete,
  setLoading,
  setStepComplete,
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadImageAndAsset, uploadMetadata] = useIpfsUpload();

  const imageAndAssetUploaded = useRef(false);
  useEffect(() => {

    if (formData?.fileName && !(imageAndAssetUploaded.current)) { // only do this if we haven't already. (react strict mode runs useEffect twice.)
      ipfsImageAndAssetUpload();
    }
  }, [formData?.fileName]);

  const valid = () => {
    return formData.imageCid && formData.assetCid && formData.name && formData.description && formData.license;
  }

  // TODO: Use the yup validator client side. (currently in place server side)
  async function ipfsImageAndAssetUpload() {
    imageAndAssetUploaded.current = true;

    let { success, imageCid, assetCid } = await uploadImageAndAsset(
      formData.fileName,
      formData.filter,
      formData.mimeType,
      formData.aspectRatio,
    );

    if (success) {
      setFormData(prev => ({
        ...prev,
        imageCid,
        assetCid
      }))
    } else {
      enqueueSnackbar(
        `Unable to upload Image and Asset To IPFS at the moment. Please Contact Support`,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
  }

  // TODO: Use the yup validator client side. (currently in place server side)
  async function ipfsMetadataUpload() {
    setLoading(true);

    let { success, metadataUrl } = await uploadMetadata(
      formData.name,
      formData.description,
      formData.license,
      formData.filter,
      formData.mimeType,
      formData.aspectRatio,
      formData.assetCid,
      formData.imageCid,
    );

    if (success) {
      setFormData(prev => ({
        ...prev,
        metadataUrl
      }))

      enqueueSnackbar(
        `IPFS Metadata uploaded`,
        {
          variant: "success",
          hideIconVariant: true
        });

      setStepComplete(3);
    }

    setLoading(false);
  }
  return (
    <Box width="100%">

      <Stack spacing={3}>
        <FormControl>
          <Tooltip title={<NameTooltip />}
            placement="right-start"
            arrow>
            <TextField
              disabled={stepComplete >= 3}
              label="Name"
              type="text"
              autoComplete='off'
              sx={{
                background: 'white'
              }}
              value={formData.name}
              onChange={e => setFormData(old => ({ ...old, name: e.target.value }))}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <Tooltip title={<DescriptionTooltip />}
            placement="right-start"
            arrow>
            <TextField
              disabled={stepComplete >= 3}
              multiline
              minRows={4}
              label="Description"
              type="text"
              autoComplete='off'
              sx={{
                background: 'white'
              }}
              value={formData.description}
              onChange={e => setFormData(old => ({ ...old, description: e.target.value }))}
            />
          </Tooltip>
        </FormControl>
        <HodlBorderedBox>
          <Tooltip
            title={<AssetLicenseTooltip />}
            placement="right-start"
            arrow>
            <FormControl disabled={stepComplete >= 3}>

              <FormLabel sx={{ marginBottom: 2 }}>Asset</FormLabel>
              <RadioGroup
                name="asset-license"
              >
                <FormControlLabel
                  onClick={() => setFormData(old => ({ ...old, license: token }))}
                  value={token}
                  control={<Radio size="small" sx={{ paddingY: 1 }} />}
                  label={<Typography color={grey[700]}>No License</Typography>}
                />
                <FormControlLabel
                  onClick={() => setFormData(old => ({ ...old, license: nonCommercial }))}
                  value={nonCommercial}
                  control={<Radio size="small" sx={{ paddingY: 1 }} />}
                  label={<Typography color={grey[700]}>Non Commercial License</Typography>}
                />
                <FormControlLabel
                  onClick={() => setFormData(old => ({ ...old, license: commercial }))}
                  value={commercial}
                  control={<Radio size="small" sx={{ paddingY: 1 }} />}
                  label={<Typography color={grey[700]}>Commercial License</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Tooltip>
        </HodlBorderedBox>
        <div>
          <Tooltip title={<UploadTooltip />} placement="right" arrow>
            <Button
              color="primary"
              variant="contained"
              sx={{
                paddingX: 3,
                paddingY: 1
              }}
              type="submit"
              disabled={stepComplete === 3 || !valid()}
              onClick={ipfsMetadataUpload}
            >
              Upload Metadata
            </Button>
          </Tooltip>
        </div>
      </Stack>
    </Box>
  )
}