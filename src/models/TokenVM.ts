import { Token } from "./Token";


export interface TokenVM extends Token {
  likeCount: number;
  commentCount: number;
}
