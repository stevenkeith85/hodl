import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";
import { Field, Form, Formik } from "formik";
import { uploadToIPFSValidationSchema } from "../../validation/uploadToIPFS";
import { commercial, nonCommercial, token } from "../../lib/copyright";
import { TextField } from 'formik-mui';
import { grey } from "@mui/material/colors";
import { AssetLicenseTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { CommercialTooltip } from "../tooltips/CommercialTooltip";
import { NonCommercialTooltip } from "../tooltips/NonCommercialTooltip";
import { NoLicenseTooltip } from "../tooltips/TokenOnlyTooltip";
import { HodlBorderedBox } from "../HodlBorderedBox";
import { DescriptionTooltip } from "../tooltips/DescriptionTooltip";
import { NameTooltip } from "../tooltips/NameTooltip";


const UploadTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      Upload the asset and its metadata to IPFS.
    </Typography>
    <Typography mb={2}>
      This decentralizes the content.
    </Typography>
    <Typography>
      Once uploaded the asset and its metadata cannot change.
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
  const [uploadToIpfs] = useIpfsUpload();


  async function ipfsUpload(values, { setSubmitting }) {
    setLoading(true);
    setSubmitting(true);

    enqueueSnackbar(
      `Transferring asset to IPFS`,
      {
        // @ts-ignore
        variant: "hodlsnackbar",
        type: "info"
      });

    if (values.mimeType.indexOf('video') !== -1) {
      enqueueSnackbar(
        `Large files may take some time`,
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "info"
        });
    }

    let { success, imageCid, metadataUrl } = await uploadToIpfs(
      values.name,
      values.description,
      values.privilege,
      values.fileName,
      values.mimeType,
      values.filter,
      values.aspectRatio,
    );

    if (success) {
      setFormData(prev => ({
        ...prev,
        name: values.name,
        description: values.description,
        privilege: values.privilege,
        metadataUrl
      }))

      enqueueSnackbar(
        `IPFS upload success`,
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "success"
        });

      setStepComplete(3);
    }

    setSubmitting(false);
    setLoading(false);
  }
  return (
    <Box
      width="90%"
    >
      <Formik
        initialValues={{
          name: formData.name,
          description: formData.description,
          privilege: formData.privilege,
          fileName: formData.fileName,
          mimeType: formData.mimeType,
          filter: formData.filter,
          aspectRatio: formData.aspectRatio
        }}
        validationSchema={uploadToIPFSValidationSchema}
        onSubmit={ipfsUpload}
      >
        {({ isSubmitting, values, setFieldValue, errors, dirty, isValid }) => (
          <>
            <Form>
              <Stack spacing={2}>
                <FormControl>
                  <Tooltip title={<NameTooltip />}
                    placement="right-start"
                    arrow>
                    <Field
                      disabled={stepComplete >= 3}
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      autoComplete='off'
                      sx={{
                        background: 'white'
                      }}
                    />
                  </Tooltip>
                </FormControl>
                <FormControl>
                  <Tooltip title={<DescriptionTooltip />}
                    placement="right-start"
                    arrow>
                    <Field
                      disabled={stepComplete >= 3}
                      multiline
                      minRows={4}
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                      autoComplete='off'
                      sx={{
                        background: 'white'
                      }}
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
                            onClick={() => setFieldValue('privilege', token)}
                            value={token}
                            control={<Radio size="small" sx={{ paddingY: 1 }} />}
                            label={<Typography color={grey[700]}>No License</Typography>}
                          />
                          <FormControlLabel
                            onClick={() => setFieldValue('privilege', nonCommercial)}
                            value={nonCommercial}
                            control={<Radio size="small" sx={{ paddingY: 1 }} />}
                            label={<Typography color={grey[700]}>Non Commercial License</Typography>}
                          />
                          <FormControlLabel
                            onClick={() => setFieldValue('privilege', commercial)}
                            value={commercial}
                            control={<Radio size="small" sx={{ paddingY: 1 }} />}
                            label={<Typography color={grey[700]}>Commercial License</Typography>}
                          />
                      </RadioGroup>
                    </FormControl>
                    </Tooltip>
                  </HodlBorderedBox>
                
                <div>
                  <Tooltip
                    title={<UploadTooltip />}
                    placement="right-start"
                    arrow>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        paddingX: 3,
                        paddingY: 1
                      }}
                      type="submit"
                      disabled={isSubmitting || stepComplete === 3 || !isValid || !dirty}
                    >
                      Upload
                    </Button>
                  </Tooltip>
                </div>
              </Stack>
            </Form>
          </>)}
      </Formik>
    </Box>
  )
}