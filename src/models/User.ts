import { Token } from "./Token";

// Redis
export type User = {
    address: string; // wallet address
    nickname: string; // a mutable field that acts as an alias
    avatar: number; // the token id
    
    sessionId?: string; // can be cleared to invalidate the refresh token

    uuid?: string; // a random number to make the message to sign unique. 

    nonce?: number; // the last nonce (a transaction counter) we processed for this wallet
    blockNumber?: number; // the block number of the last transaction we processed for this wallet

    txQueueId: number;
    actionQueueId: number;
}

// For the UI
export interface UserViewModel {
    address: string; // wallet address
    nickname: string; // a mutable field that acts as an alias
    avatar: Token;
    followedByViewer?: boolean;
    followsViewer?: boolean;

    nonce?: number;
    blockNumber?: number;
}