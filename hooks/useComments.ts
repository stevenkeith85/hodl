import useSWRInfinite from 'swr/infinite'
import { fetchWithTokenOffsetLimit } from '../lib/swrFetchers';

export const useComments = (token, limit = 10, prefetchedResults = null) => {
    const getKey = (index, _previous) => {
        return [`/api/comments`, token, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey,
        fetchWithTokenOffsetLimit,
        { fallbackData: prefetchedResults }
    );


    return [swr];
}
