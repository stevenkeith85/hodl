import useSWRInfinite from 'swr/infinite'
import axios from 'axios'
    
export const useSearchTokens = (q, limit=10, forSale=false, fallbackData=null) => {
    const getKey = (index, _previous) => {
        return [`/api/search/tokens`, q, index * limit, limit, forSale];
    }

    const fetcher = (url, q, offset, limit, forSale) => axios.get(url, { params: { q, offset, limit, forSale } }).then(r => r.data);
    const swr = useSWRInfinite(
        getKey, 
        fetcher,
        { fallbackData });


    return { results: swr };
}
