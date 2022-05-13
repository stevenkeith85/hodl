export enum NftAction {
    Minted = 'minted',
    Listed = 'listed',
    Delisted = 'delisted',
    Bought = 'bought',
    Liked = 'liked',
}

export enum AddressAction {
    Followed = 'followed',
    Unfollowed = 'unfollowed',
}

export interface HodlNotification {
    subject: string; // address
    action: NftAction | AddressAction;
    object?: string; // address
    token?: number;
}