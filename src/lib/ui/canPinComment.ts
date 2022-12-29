// The token hodler can pin any comment
export const canPinComment = (address, mutableToken) => mutableToken?.hodler === address;