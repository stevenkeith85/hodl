// This data changes depending on the state of the blockchain. 
// We cache it in redis to speed up the website
export interface MutableToken {
  // if the token is for sale, this is the seller. if it is not for sale, it is the 'ownerOf'
  // optional; as we do not display the hodler on the market screens at the moment
  hodler?: string;

  // indicates if the token is listed on our market
  forSale: boolean;

  // price in ether. it will be null if the token is not for sale
  price?: string;
}
