import { Box, imageListItemClasses, ImageListItem } from '@mui/material'
import { NftAvatar } from './ProfileAvatar';


const SelectProfileNFT = ({ nfts, onClick }) => {
    
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: 16,
                [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {(nfts || []).filter(nft => nft).map((nft, i) => (
                <ImageListItem
                    key={i}
                    onClick={(e) => {
                        onClick(nft.tokenId);
                    }}
                >
                    <NftAvatar token={nft} size={90} />
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default SelectProfileNFT
