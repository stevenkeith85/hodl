// <subject> commented <comment> on <objectId> of type <object> at <timestamp>
//
// it will be saved at comment.id in Redis, and is displayed at the url nft/tokenId

import { Nft } from "./Nft";
import { Token } from "./Token";
import { User } from "./User";

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

    user: User; // the user that made the comment

    comment: string; // the comment string

    timestamp: number; // when was the comment was made

    object: "token" | "comment"; // what was this comment about
    
    tokenId: number;
    // TODO
    // reply?: boolean; // if "object" in HodlComment is a "comment" then this will be true; otherwise false
    // objectId?: number; // comment -> token's id; reply -> comment's id
}