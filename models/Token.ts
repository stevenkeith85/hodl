// Our Token type matches what is stored in Redis
// At the moment we only store immutable data in Redis
//
// We will likely cache the MUTABLE data at some point thoughh
// to minimise our blockchain calls (cost), speed things up (UX)

export interface Token {
    id: number;

    creator: string;

    name: string;
    description: string;

    metadata: string; // <cid>

    privilege: string;

    image: string; // <cid>
    mimeType: string; // image might be a video. mimeType tells us what it actually is. TODO - Rename image to asset. (This technically would be off-spec though as ERC721 uses 'image')
    
    filter?: "e_improve" | "e_art:athena" | "e_art:aurora" | "e_art:hairspray" | "e_grayscale"; // we apply the filter dynamically. TODO - We should PROBABLY transform the actual asset as upload time. (unless its very slow to do so)
    aspectRatio?: "1:1" | "4:5" | "16:9"
  };
