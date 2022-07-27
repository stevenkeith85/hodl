import { Box, imageListItemClasses, ImageListItem, Typography } from '@mui/material'
import { NftAvatar } from './avatar/NftAvatar';

interface SelectProfileNFTProps {
    nfts: any[];
    onClick: Function;
    selectedTokenId: number; // tokenId
}

const SelectProfileNFT = ({ nfts, onClick, selectedTokenId }: SelectProfileNFTProps) => {

    if (!nfts.length) {
        return <Typography>You need to hodl an NFT to set a custom avatar.</Typography>
    }

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
                        onClick(nft.id);
                    }}
                >
                    <NftAvatar token={nft} size={90} highlight={nft.id === selectedTokenId} navigate={false} color="secondary"/>
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default SelectProfileNFT
