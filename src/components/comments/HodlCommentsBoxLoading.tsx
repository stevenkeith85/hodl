import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { AddCommentLoading } from "../nft/AddCommentLoading";

export const HodlCommentsBoxLoading = ({
}) => {
    return (<>
        <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
            <HodlLoadingSpinner sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 1 }} />
        </div>
        <AddCommentLoading />
    </>
    )
}