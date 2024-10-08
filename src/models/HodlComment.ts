// <subject> commented <comment> on <objectId> of type <object> at <timestamp>
//
// it will be saved at comment.id in Redis, and is displayed at the url nft/tokenId

import { UserViewModel } from "./User";

// We store this in redis
export interface HodlComment {
    id?: number; // the id that the comment will be stored against

    subject: string; // the address that made the comment

    comment?: string; // the comment string

    // This is basically a pointer to the parent
    object: "token" | "comment"; // what was this comment about
    objectId?: number; // the object's Id

    timestamp?: number; // when was the comment was made

    tokenId?: number; // the id of the nft this comment was made at. For 'top level' comments, it will be the same as objectId.
}

// We use this on the UI
export interface HodlCommentViewModel {
    id: number; // the id that the comment was stored against

    user?: UserViewModel; // the user that made the comment. optional so that we can skip it, if we already know the user. i.e. with actions

    comment: string; // the comment string

    timestamp: number; // when was the comment was made

    object: "token" | "comment"; // what was this comment about
    objectId: number;
    
    tokenId: number;

    replyCount: number;
    likeCount: number;
}