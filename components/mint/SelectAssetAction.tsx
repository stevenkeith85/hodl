import { Stack, Typography } from "@mui/material";
import { HodlTextField } from "../HodlTextField";
import { FilterButtons } from "./FilterButtons";

export const SelectAssetAction = ({ cloudinaryUpload, loading, filter, setFilter }) => (
    <>
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Typography variant="h2">Select Asset</Typography>
          <Typography>This will be attached to your token. We accept image, video, or audio</Typography>
          <HodlTextField
            type="file"
            onChange={cloudinaryUpload}
            disabled={loading}
          />
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h2">Pick a Filter</Typography>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </Stack>
      </Stack>
    </>
  )
  