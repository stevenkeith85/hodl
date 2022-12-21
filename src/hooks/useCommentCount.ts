import useSWR from 'swr';
import { fetchWithObjectAndId } from '../lib/swrFetchers';


export const useCommentCount = (
    id: number,
    object: "token" | "comment",
    fallbackData = null
) => {
    const swr = useSWR(
        id ? [`/api/comments/count`, object, id] : null,
        fetchWithObjectAndId,
        {
            revalidateOnMount: fallbackData === null,
            fallbackData
        }
    );

    return swr;
};
