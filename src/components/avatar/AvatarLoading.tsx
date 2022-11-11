import Skeleton from "@mui/material/Skeleton"
import { memo } from "react"

const AvatarLoading = ({ size }) => (
    <Skeleton variant="circular" animation="wave" width={size} height={size}></Skeleton>
)


export const AvatarLoadingMemo = memo(AvatarLoading)

