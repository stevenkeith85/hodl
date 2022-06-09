import useSWR from 'swr';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite'
import { fetchWithId, fetchWithIdOffsetLimit } from '../lib/swrFetchers';
import axios from 'axios';

export const useComments = (id, limit, setLoading, token = true, prefetchedResults = null, prefetchedCommentCount=null) : 
    [
        SWRInfiniteResponse<any, any>, 
        (comment: any) => Promise<void>, 
        (comment: any) => Promise<void>,
        number
    ] => 
{
    const baseUrl = token ? `/api/comments/token` : `/api/comments/comment`;

    const getKey = (index, _previous) => {
        return [baseUrl, id, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey,
        fetchWithIdOffsetLimit,
        { fallbackData: prefetchedResults }
    );

    const { data: count, mutate: mutateCommentCount } = useSWR(id ? [`${baseUrl}/count`, id] : null,
        fetchWithId,
        { fallbackData: prefetchedCommentCount }
    );

    const addComment = async comment => {
        setLoading(true);        
        try {
            mutateCommentCount(old => old + 1, { revalidate: false });

            alert("commenting on " + id);
            const r = await axios.post(
                `${baseUrl}/add`,
                {
                    comment,
                    id
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    }
                });
            swr.mutate();


        } catch (error) {
            swr.mutate();
            mutateCommentCount();
        }
        setLoading(false);
    }

    const deleteComment = async (comment) => {
        setLoading(true);
        try {
            mutateCommentCount(old => old + 1, { revalidate: false });
            const r = await axios.delete(
                `${baseUrl}/delete`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    },
                    data: { subject: comment.subject, token: comment.token, id: comment.id },

                });
            swr.mutate();
        } catch (error) {
            swr.mutate();
            mutateCommentCount();
        }
        setLoading(false);
    }

    return [swr, addComment, deleteComment, count];
}
