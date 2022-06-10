import useSWR, { mutate } from 'swr';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite'
import { fetchWithId, fetchWithIdOffsetLimit } from '../lib/swrFetchers';
import axios from 'axios';

export const useComments = (
    tokenId, // we need this as the token owner can delete anything on their token
    id, // the id of the thing the comment is about (ie. a token or another comment)
    limit, 
    setLoading, 
    object,
    prefetchedResults = null, 
    prefetchedCommentCount=null, 
    load=true // delaying loading comments until the user expands the 'show replies' thread
) : 
    [
        SWRInfiniteResponse<any, any>, 
        (comment: any, object: string) => Promise<void>, 
        (comment: any) => Promise<void>,
        number
    ] => 
{
    const baseUrl = object === "token" ? `/api/comments/token` : `/api/comments/comment`;

    const getKey = (index, _previous) => {
        console.log('getKey', JSON.stringify([baseUrl, id, index * limit, limit]))
        return [baseUrl, id, index * limit, limit];
    }

    const swr = useSWRInfinite(
        load ? getKey: null,
        fetchWithIdOffsetLimit,
        { 
            fallbackData: prefetchedResults,
            revalidateOnMount: true,
            dedupingInterval: 2000, // default is 2000
            focusThrottleInterval: 5000, // default is 5000
        }
    );

    const { data: count, mutate: mutateCommentCount } = useSWR(
        id ? [`${baseUrl}/count`, id] : null,
        fetchWithId,
        { 
            fallbackData: prefetchedCommentCount,
            revalidateOnMount: true
        }
    );

    const addComment = async (comment, object) => {
        setLoading(true);        

        let url = `/api/comments/token`
        if (object === "comment") {
            url = `/api/comments/comment`
        }

        try {
            mutateCommentCount(old => old + 1, { revalidate: false });

            const r = await axios.post(
                `${url}/add`,
                {
                    comment,
                    id // the comment's id or the nfts id
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    }
                });
            // TODO: Figure out how to mutate the parent list of this comment - not currently working
            console.log('mutate', JSON.stringify([url, id, 0, 2]))
            mutate([url, id, 0, 2]);
            
        } catch (error) {
            // TODO: Figure out how to mutate the parent list of this comment
            mutate([url, id, 0, 2]);
        }
        setLoading(false);
    }

    const deleteComment = async (comment) => {
        setLoading(true);

        let url = `/api/comments/token`
        if (comment.object === "comment") {
            url = `/api/comments/comment`
        } 

        try {
            mutate([`${url}/count`, comment.objectId], old => old - 1, { revalidate: false });
            const r = await axios.delete(
                `${url}/delete`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    },
                    data: { 
                        id: comment.id,
                        subject: comment.subject, 
                        token: tokenId,
                        object: comment.object,
                        objectId: comment.objectId
                    },

                });
            // swr.mutate();
            mutate([baseUrl, comment.objectId, swr.size * limit, limit])
        } catch (error) {
            swr.mutate();
            mutate([`${url}/count`, comment.objectId]);
        }
        setLoading(false);
    }

    return [swr, addComment, deleteComment, count];
}
