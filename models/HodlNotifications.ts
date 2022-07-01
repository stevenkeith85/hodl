export enum NotificationTypes {
    Minted = 'minted',
    Listed = 'listed',
    Delisted = 'delisted',
    Bought = 'bought',
    Liked = 'liked',
    CommentedOn = 'commented on',
    Followed = 'followed',
    Unfollowed = 'unfollowed',
}

// e.g.
//
// <id>
// steven <commented on> a <token|comment> with <objectId> at <timestamp>
export interface HodlNotification {    
    action: NotificationTypes;
    subject: string; // the address that took the action

    // object and id here refer to what the notification is about
    // with comments, the object and objectid refer to what we are commenting on
    object: "token" | "comment" | "address"; // the type that was interacted with
    objectId?: number; // the id of the comment or token - TODO RENAME
    
    timestamp?: number; // when the notification was created
}
