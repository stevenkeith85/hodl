export enum NotificationTypes {
    Added = 'added', // token added to hodlmymoon
    Listed = 'listed', // token listed on the market
    Bought = 'bought', // token bought from market
    Liked = 'liked', // token or comment liked
    CommentedOn = 'commented on', // token or comment commented on
    Followed = 'followed', // address has been followed
}

// e.g.
//
// <id>
// steven <commented on> a <token|comment> with <objectId> at <timestamp>
//
// <id>
// steven <followed> an <address> with the address of <id>
export interface HodlNotification {    
    action: NotificationTypes;

    subject: string; // the wallet address that took the action. (i.e. the user)

    object: "token" | "comment" | "address"; // the type that was interacted with
    id?: number | string; // if object is (token | comment) then it will a numeric id (e.g. liked a token); otherwise it will be a wallet address (e.g. followed an address)
    
    timestamp?: number; // when the notification was created
}
