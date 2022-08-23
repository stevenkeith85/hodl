import { Token } from "./Token";

// Redis
export type User = {
    address: string; // wallet address
    nickname: string; // a mutable field that acts as an alias
    avatar: number; // the token id
    
    sessionId?: string; // can be cleared to invalidate the refresh token
    nonce?: string; // a random number to make the message to sign unique
}

// For the UI
export interface UserViewModel {
    address: string; // wallet address
    nickname: string; // a mutable field that acts as an alias
    avatar: Token;
    followedByViewer: boolean;
    followsViewer: boolean;
}