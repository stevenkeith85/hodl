import useSWRInfinite from 'swr/infinite'
import axios from 'axios'
    
interface SearchQuery {
    q: string;
    limit: number;
    forSale: boolean;
    minPrice: number;
    maxPrice: number;
}

export const useSearchTokens = (
    {
        q, 
        limit, 
        forSale, 
        minPrice, 
        maxPrice
    }: SearchQuery,
    fallbackData=null) => {

    const getKey = (index, _previous) => {
        return [`/api/search/tokens`, q, index * limit, limit, forSale, minPrice, maxPrice];
    }

    const fetcher = (url, q, offset, limit, forSale, minPrice, maxPrice) => axios.get(url, { params: { q, offset, limit, forSale, minPrice, maxPrice } }).then(r => r.data);

    const swr = useSWRInfinite(
        getKey, 
        fetcher,
        { 
            fallbackData,
            shouldRetryOnError: false 
        });


    return { results: swr };
}
