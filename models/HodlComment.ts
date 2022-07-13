// <subject> commented <comment> on <objectId> of type <object> at <timestamp>
//
// it will be saved at comment.id in Redis, and is displayed at the url nft/tokenId

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