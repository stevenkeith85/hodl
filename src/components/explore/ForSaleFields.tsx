import Box from '@mui/material/Box';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { MaticSymbol } from '../MaticSymbol';


export const ForSaleFields = ({
    setSearchQ,
    minPriceUI,
    setMinPriceUI,
    maxPriceUI,
    setMaxPriceUI
  }) => {
  
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '70%'
        }}>
  
        <TextField
          sx={{
            maxWidth: `40%`
          }}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              setSearchQ(old => ({
                ...old,
                minPrice: minPriceUI,
              }))
            }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <MaticSymbol />
            </InputAdornment>,
          }}
          size="small"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={minPriceUI}
          onChange={e => setMinPriceUI(e.target.value)}
        />
        <Typography
          component="span"
        >
          to
        </Typography>
  
        <TextField
          sx={{
            maxWidth: `40%`
          }}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              setSearchQ(old => ({
                ...old,
                maxPrice: maxPriceUI,
              }))
            }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <MaticSymbol />
            </InputAdornment>,
          }}
          size="small"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={maxPriceUI}
          onChange={e => setMaxPriceUI(e.target.value)}
        />
      </Box>
    )
  }