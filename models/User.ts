import { Token } from "./Token";

// TODO:
export type User = {
    address: string; // wallet address

    nickname: string; // a mutable field that acts as an alias
    avatar: Token;
    
    sessionId: string; // can be cleared to invalidate the refresh token
    nonce: string; // a random number to make the message to sign unique
}