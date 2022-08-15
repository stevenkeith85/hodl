import { Box } from '@mui/material'
import { Nft } from '../models/Nft';
import { NftWindow } from './NftWindow';


const NftList = ({ nfts }) => {
    return (
      <>
            {
                nfts.map((nft: Nft) => (
                    <NftWindow nft={nft} />
                ))
            }
        </>
    );
}


export default NftList
