import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithIdOffsetLimit, fetchWithObjectAndId } from '../lib/swrFetchers';
import axios from 'axios';
import { HodlComment } from '../models/HodlComment';

export const useAddComment = (): [(comment: HodlComment) => Promise<void>] => {
    const addComment = async (comment: HodlComment) => {
        try {
            const r = await axios.post(
                `/api/comments/token/add`,
                {
                    comment: comment.comment, // the text string
                    id: comment.objectId, // the id of what we are commenting on. TODO: Rename to objectId
                    object: comment.object // the type of object we are commenting on
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    }
                });
        } catch (error) {
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
        id ? [`/api/comments/token/count`, object, id] : null,
        fetchWithObjectAndId,
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
