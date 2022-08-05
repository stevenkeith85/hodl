import { HodlCommentViewModel } from "./HodlComment";
import { Token } from "./Token";
import { User } from "./User";

export enum ActionTypes {
    Added = 'added', // token added to hodlmymoon
    Listed = 'listed', // token listed on the market
    Bought = 'bought', // token bought from market
    Liked = 'liked', // token or comment liked
    CommentedOn = 'commented on', // token or comment commented on - maybe should just be 'commented'
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
        ActionTypes.CommentedOn,
        ActionTypes.Followed,
    ],
    [ActionSet.Feed]: [
        ActionTypes.Added, 
        ActionTypes.Listed
    ],
    [ActionSet.Notifications]: [
        ActionTypes.Bought,
        ActionTypes.Liked,
        ActionTypes.CommentedOn,
        ActionTypes.Followed,
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

    // This is basically a pointer to what the action was on
    object: "token" | "comment" | "address"; // the type that was interacted with. We should change "address" to "user" to be more consistent with our terminology / allow us to share types over the app (DDD)
    objectId?: number | string; // if object is (token | comment) then it will a numeric id (e.g. liked a token); otherwise it will be a wallet address (e.g. followed an address)
}

export interface HodlActionViewModal {
    id?: number; // the id that the action will be stored against
    timestamp?: number; // when the action was created

    action: ActionTypes;

    subject: string; // the wallet address that took the action. (i.e. the user)

    // This is basically a pointer to what the action was on
    object: "token" | "comment" | "address"; // the type that was interacted with. We should change "address" to "user" to be more consistent with our terminology / allow us to share types over the app (DDD)
    objectId?: number | string; // if object is (token | comment) then it will a numeric id (e.g. liked a token); otherwise it will be a wallet address (e.g. followed an address)

    // TODO: We want to return the actual data we need; so that the UI doesn't have to ask for it every time it gets ids. This should make things appear smoother to the user and reduce the number of server calls. NB: database calls will be the same
    // id?: number; 
    
    // user: User;

    // action: ActionTypes;

    // timestamp?: number;

    token?: Token;
    comment?: HodlCommentViewModel;
    // address?: string;
    
}