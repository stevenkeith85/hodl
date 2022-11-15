import Skeleton from "@mui/material/Skeleton"
import { memo } from "react"

const UserHandleLoading = () => (
    <Skeleton variant="text" animation="wave" width={50}></Skeleton>
)


export const UserHandleLoadingMemo = memo(UserHandleLoading)

