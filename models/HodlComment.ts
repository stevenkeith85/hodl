export interface HodlComment {
    id?: number; // the id that the comment will be stored against
    subject: string; // the address that made the comment
    comment?: string; // the comment string
    object: "token" | "comment"; // what was this comment about
    objectId?: number; // the object's Id
    timestamp?: number; // when was the comment was made
}