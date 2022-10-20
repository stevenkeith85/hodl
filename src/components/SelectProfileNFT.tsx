import { Box, imageListItemClasses, ImageListItem } from '@mui/material'
import { AssetThumbnail } from './AssetThumbnail';

interface SelectProfileNFTProps {
    nfts: any[];
    onClick: Function;
    selectedTokenId: number; // tokenId
}

const SelectProfileNFT = ({ nfts, onClick, selectedTokenId }: SelectProfileNFTProps) => {
    return (
        // <Box
        //     sx={{
        //         display: "grid",
        //         gridTemplateColumns: "repeat(3, 1fr)",
        //         gridGap: 16,
        //         [`& .${imageListItemClasses.root}`]: {
        //             display: "flex",
        //             flexDirection: "column"
        //         }
        //     }}
        // >
           
        // </Box>
    )
}

export default SelectProfileNFT
