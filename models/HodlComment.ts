export interface HodlComment {
    id?: number; // id to tie things up
    subject: string; // address
    comment?: string; // the actual comment
    object?: number; // the nft or comment the comment was made about
    timestamp?: number; // when the comment was made
}