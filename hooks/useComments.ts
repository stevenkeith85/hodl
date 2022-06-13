import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithId, fetchWithIdOffsetLimit } from '../lib/swrFetchers';
import axios from 'axios';
import { HodlComment } from '../models/HodlComment';

export const useAddComment = (): [(comment: HodlComment, mutateList: Function, mutateCount: Function) => Promise<void>] => {
    const addComment = async (comment: HodlComment, mutateList: Function, mutateCount: Function) => {
        try {
            const r = await axios.post(
                `/api/comments/${comment.object}/add`, // TODO: Possible just have one endpoint rather than separate token/comment endpoints
                {
                    comment: comment.comment,
                    id: comment.objectId // the comment's id or the nfts id
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    }
                });

            mutateList();
            mutateCount();
        } catch (error) {
            mutateList();
            mutateCount();
        }
    }

    return [addComment]
}

export const useDeleteComment = (): [(comment: HodlComment, mutateList: Function, mutateCount: Function) => Promise<void>] => {
    const deleteComment = async (comment: HodlComment, mutateList: Function, mutateCount: Function) => {
        try {
            const r = await axios.delete(
                `/api/comments/token/delete`, // We are just using the token delete endpoint for all
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    },
                    data: {
                        id: comment.id,
                        subject: comment.subject,
                        object: comment.object,
                        objectId: comment.objectId
                    },

                });
            mutateList();
            mutateCount();
        } catch (error) {
            mutateList();
            mutateCount();
        }
    }

    return [deleteComment]
}

export const useCommentCount = (
    id: number,
    object: "token" | "comment",
    prefetched = null,
) => {
    const { data, mutate } = useSWR(
        id ? [`/api/comments/${object}/count`, id] : null,
        fetchWithId,
        {
            fallbackData: prefetched,
            revalidateOnMount: true
        }
    );

    return [data, mutate]
}

export const useComments = (
    id: number,
    limit: number,
    object: "token" | "comment",
    prefetched = null,
    load = true
) => {
    const getKey = (index, _previous) => {
        return [`/api/comments/${object}`, id, index * limit, limit];
    }

    const swr = useSWRInfinite(
        load ? getKey : null,
        fetchWithIdOffsetLimit,
        {
            fallbackData: prefetched,
            revalidateOnMount: true,
            revalidateFirstPage: true,
            dedupingInterval: 10000,
            focusThrottleInterval: 10000,
        }
    );

    return swr;
}
