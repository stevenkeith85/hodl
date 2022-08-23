import { HodlCommentViewModel } from "./HodlComment";
import { Token } from "./Token";
import { User, UserViewModel } from "./User";

export enum ActionTypes {
    Added = 'added', // token added to hodlmymoon
    Listed = 'listed', // token listed on the market
    Delisted = 'delisted', // token delisted from the market
    Bought = 'bought', // token bought from market

    Liked = 'liked', // token or comment liked
    Commented = 'commented', // token or comment commented on - maybe should just be 'commented'
    Followed = 'followed', // address has been followed
}

// These map to the Redis collection names
export enum ActionSet {
    Actions = 'actions', // user's actions
    Feed = 'feed', // user's feed
    Notifications = 'notifications', // user's notifications
}

export const ActionSetMembers = {
    [ActionSet.Actions]: [
        ActionTypes.Added,
        ActionTypes.Listed,
        ActionTypes.Bought,
        ActionTypes.Liked,
        ActionTypes.Commented,
        ActionTypes.Followed,
    ],
    [ActionSet.Feed]: [
        ActionTypes.Added, 
        ActionTypes.Listed // users followers may wish to buy the nft
    ],
    [ActionSet.Notifications]: [
        ActionTypes.Bought,
        ActionTypes.Liked,
        ActionTypes.Commented,
        ActionTypes.Followed,
        ActionTypes.Listed, // user needs alerted when the blockchain transaction has completed
        ActionTypes.Delisted // user needs alerted when the blockchain transaction has completed
    ]
}

// e.g.
//
// <id>
// steven <commented on> a <token|comment> with <objectId> at <timestamp>
//
// <id>
// steven <followed> an <address> with the address of <id>
export interface HodlAction {    
    id?: number; // the id that the action will be stored against
    timestamp?: number; // when the action was created

    action: ActionTypes;

    subject: string; // the wallet address that took the action. (i.e. the user)

    // This is a pointer to what the action was on (the metadata)
    object: "token" | "comment" | "address"; // the type that was interacted with. We should change "address" to "user" to be more consistent with our terminology / allow us to share types over the app (DDD)
    objectId?: number | string; // if object is (token | comment) then it will a numeric id (e.g. liked a token); otherwise it will be a wallet address (e.g. followed an address)

    metadata?: any; // an object that is ideally only used for ephemeral data that we can't easily look up. e.g. price a token was listed at
}

export interface HodlActionViewModel {
    id?: number; // the id that the action will be stored against
    timestamp?: number; // when the action was created

    action: ActionTypes;

    subject: string; // the wallet address that took the action. (i.e. the user)

    // This is basically a pointer to what the action was on
    object: "token" | "comment" | "address"; // the type that was interacted with. We should change "address" to "user" to be more consistent with our terminology / allow us to share types over the app (DDD)
    objectId?: number | string; // if object is (token | comment) then it will a numeric id (e.g. liked a token); otherwise it will be a wallet address (e.g. followed an address)

    // The user who took the action
    user?: UserViewModel;
    token?: Token;
    comment?: HodlCommentViewModel;    

    // Metadata on the action (if any)
    metadata?: any;
}