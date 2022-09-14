export interface ERC721Metadata {
    // Identifies the asset to which this NFT represents
    name: string;

    // Describes the asset to which this NFT represents
    description: string;

    // A URI pointing to a resource with mime type image/* 
    // representing the asset to which this NFT represents. 
    // Consider making any images at a width between 320 and 1080 pixels 
    // and aspect ratio between 1.91:1 and 4:5 inclusive.

    //  if the asset is an image then this will be the asset, cropped to 1080 pixels
    //  if the asset is a video, then this will be a poster, cropped to 1080 pixels
    //  if the asset is music, then this will be the cover art for the music, cropped to 1080 pixels
    image?: string;
};


// We actually use the ERC-721 contract standard, but the ERC-1155 Metadata standard as it is a bit more flexible
// We MAY switch over to the ERC-1155 contract at some point
export interface HodlMetadata extends ERC721Metadata {
    properties: {
        
        aspectRatio: "1:1" | "4:5" | "16:9";
        filter: "e_improve" | "e_art:athena" | "e_art:aurora" | "e_art:hairspray" | "e_grayscale";

        asset: {
            uri?: string; // the asset attached to this token.             
            mimeType: string; // the mimetype of the asset attached to this token
            license: "no license" | "non-commercial license" | "commercial license";
        }
    }
};
