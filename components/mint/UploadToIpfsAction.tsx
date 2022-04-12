import { Upload } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { HodlButton } from "../HodlButton";
import { HodlTextField } from "../HodlTextField";

export const UploadToIpfsAction = ({ stepComplete, updateFormInput, formInput, loading, ipfsUpload }) => (
    <>
      <Typography variant="h2">Upload To IPFS</Typography>
      <HodlTextField
        disabled={loading || stepComplete === 1}
        label="Token Name"
        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
      />
      <HodlTextField
        disabled={loading || stepComplete === 1}
        label="Token Description"
        multiline
        minRows={8}
        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
      />
      <div>
        <HodlButton
          onClick={ipfsUpload}
          disabled={!formInput.name || !formInput.description || loading || stepComplete === 1}
          startIcon={<Upload fontSize="large" />}
        >
          Upload To IPFS
        </HodlButton>
      </div>
    </>
  )
  