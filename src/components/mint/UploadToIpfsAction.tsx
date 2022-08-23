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
import { HodlerPrivilegeTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { CommercialTooltip } from "../tooltips/CommercialTooltip";
import { NonCommercialTooltip } from "../tooltips/NonCommercialTooltip";
import { TokenOnlyTooltip } from "../tooltips/TokenOnlyTooltip";
import { HodlBorderedBox } from "../HodlBorderedBox";


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
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
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
            {/* <pre>{JSON.stringify(formData, null, 2)}</pre>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre> */}
            <Form>
              <Stack spacing={4}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    color: theme => theme.palette.text.secondary,
                    span: { fontWeight: 600 }
                  }}>Metadata</Typography>
                <FormControl>
                  <Field
                    disabled={stepComplete >= 3}
                    component={TextField}
                    name="name"
                    label="name"
                    type="text"
                    autoComplete='off'
                    sx={{
                      background: 'white'
                    }}
                  />
                </FormControl>
                <FormControl>
                  <Field
                    disabled={stepComplete >= 3}
                    multiline
                    minRows={4}
                    component={TextField}
                    helperText="You can add #tags here to help hodlers discover your token. Only the first six are indexed."
                    name="description"
                    label="description"
                    type="text"
                    autoComplete='off'
                    sx={{
                      background: 'white'
                    }}
                  />

                </FormControl>
                <HodlBorderedBox>
                  <FormControl disabled={stepComplete >= 3}>
                    <Tooltip
                      title={<HodlerPrivilegeTooltip />}
                      placement="right-start"
                      arrow>
                      <FormLabel sx={{ marginBottom: 1 }}>hodler privilege</FormLabel>
                    </Tooltip>
                    <RadioGroup
                      name="hodler-privilege"
                    >
                      <Tooltip
                        title={<TokenOnlyTooltip />}
                        placement="right-start"
                        arrow>
                        <FormControlLabel
                          onClick={() => setFieldValue('privilege', token)}
                          value={token}
                          control={<Radio size="small" sx={{ paddingY: 0.75 }} />}
                          label={<Typography color={grey[700]}>token only</Typography>}
                        />
                      </Tooltip>
                      <Tooltip
                        title={<NonCommercialTooltip />}
                        placement="right-start"
                        arrow>
                        <FormControlLabel
                          onClick={() => setFieldValue('privilege', nonCommercial)}
                          value={nonCommercial}
                          control={<Radio size="small" sx={{ paddingY: 0.75 }} />}
                          label={<Typography color={grey[700]}>non commercial</Typography>}
                        />
                      </Tooltip>
                      <Tooltip
                        title={<CommercialTooltip />}
                        placement="right-start"
                        arrow>
                        <FormControlLabel
                          onClick={() => setFieldValue('privilege', commercial)}
                          value={commercial}
                          control={<Radio size="small" sx={{ paddingY: 0.75 }} />}
                          label={<Typography color={grey[700]}>commercial</Typography>}
                        /></Tooltip>
                    </RadioGroup>
                  </FormControl>
                </HodlBorderedBox>
                <div>
                  <Tooltip
                    title={<UploadTooltip />}
                    placement="right-start"
                    arrow>
                    <Button
                      color="secondary"
                      sx={{
                        paddingX: 2
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