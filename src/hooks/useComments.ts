import useSWRInfinite from 'swr/infinite'
import axios from 'axios';

export const useComments = (
    objectId: number,
    limit: number,
    object: "token" | "comment",
    fallbackData = null,
    load = true,
    rev = false
) => {
    const getKey = (index, _previous) => {
        return objectId ? [`/api/comments`, object, objectId, index * limit, limit, rev] : null;
    }

    const fetcher = (url, object, objectId, offset, limit, rev) => axios.get(url, { params: { object, objectId, offset, limit, rev } }).then(r => r.data);
    const swr = useSWRInfinite(
        load ? getKey : null,
        fetcher,
        {
            fallbackData,
            shouldRetryOnError: false
        }
    );

    return swr;
}
