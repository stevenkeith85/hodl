import { Upload } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { HodlButton } from "../HodlButton";
import { HodlTextField } from "../HodlTextField";
import { FC } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";


export const UploadToIpfsAction: FC<MintProps> = ({ 
  formData,
  setFormData,
  stepComplete,
  loading, 
  setLoading, 
  setStepComplete,
  
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToIpfs] = useIpfsUpload();

  async function ipfsUpload() {
    setLoading(true);
    enqueueSnackbar('Transferring asset to IPFS', { variant: "info" });

    const { name, description, fileName, mimeType, filter } = formData;
    let { success, imageCid, metadataUrl } = await uploadToIpfs(name, description, fileName, mimeType, filter)

    if (success) {
      setFormData(prev => ({
        ...prev,
        metadataUrl
      }))
      enqueueSnackbar('IPFS Upload Success', { variant: "success" });
      setStepComplete(1);
    } else {
      enqueueSnackbar('Please try again', { variant: "warning" });
    }

    setLoading(false);
  }
  return (
    <Stack spacing={2}>
      <HodlTextField
        disabled={loading || stepComplete === 1}
        label="Token Name"
        onChange={e => setFormData(prev => ({
           ...prev, 
           name: e.target.value 
        }))}
      />
      <HodlTextField
        disabled={loading || stepComplete === 1}
        label="Token Description"
        multiline
        minRows={8}
        onChange={e => setFormData(prev => ({
          ...prev, 
          description: e.target.value 
       }))}
      />
      <div>
        <HodlButton
          onClick={ipfsUpload}
          disabled={!formData.name || !formData.description || loading || stepComplete === 1}
          startIcon={<Upload fontSize="large" />}
        >
          Upload To IPFS
        </HodlButton>
      </div>
    </Stack>
  )
}