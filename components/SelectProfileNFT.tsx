import { Box, imageListItemClasses, ImageListItem, Typography } from '@mui/material'
import { NftAvatar } from './avatar/NftAvatar';
import { ProfileAvatar } from './avatar/ProfileAvatar';
import { UserAvatarAndHandle } from './avatar/UserAvatarAndHandle';
import { HodlImage } from './HodlImage';

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
                    {/* TODO: We need to handle all media types. We often have to do that; so perhaps we should extract a component
                        and update the other places that do that sort of thing
                    */}
                    <HodlImage
                        cid={nft?.image}
                        effect={nft?.filter}
                        width="90px"
                        height="90px"
                    />
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default SelectProfileNFT
