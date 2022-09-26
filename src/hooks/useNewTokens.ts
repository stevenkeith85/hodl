import useSWRInfinite from 'swr/infinite'
import axios from 'axios';
    
export const useNewTokens = (limit=10, fallbackData=null) => {
    const getKey = (index, _previous) => {
        return [`/api/rankings/token/new`, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        (url:string, offset: number, limit: number) => axios.get(url, { params: { offset, limit } }).then(r => r.data),
        { fallbackData });

    return { results: swr };
}
