import { Token } from "./Token";

// Sometimes we want to add the like count as it lets us do some performance optimisations


export interface TokenVM extends Token {
  likeCount: number;
  commentCount: number;
}
