import { HodlCommentViewModel } from "../../models/HodlComment";

export const canDeleteComment = (
    comment: HodlCommentViewModel,
    address,
    mutableToken
    ) => comment.user.address === address || mutableToken?.hodler === address;