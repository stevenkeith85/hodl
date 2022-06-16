import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithObjectAndId, fetchWithObjectObjectIdOffsetLimit } from '../lib/swrFetchers';
import axios from 'axios';
import { HodlComment } from '../models/HodlComment';

export const useAddComment = (): [(comment: HodlComment) => Promise<void>] => {
    const addComment = async (comment: HodlComment) => {
        try {
            const r = await axios.post(
                `/api/comments/add`,
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
                `/api/comments/delete`, // We are just using the token delete endpoint for all
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
    const swr = useSWR(
         [`/api/comments/count`, object, id],
        fetchWithObjectAndId,
        {
            fallbackData: prefetched,
            revalidateOnMount: true,
            revalidateOnFocus: true
        }
    );

    return swr
}

export const useComments = (
    objectId: number,
    limit: number,
    object: "token" | "comment",
    prefetched = null,
    load = true
) => {
    const getKey = (index, _previous) => {
        return objectId ? [`/api/comments`, object, objectId, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        load ? getKey : null,
        fetchWithObjectObjectIdOffsetLimit,
        {
            fallbackData: prefetched,
            revalidateOnMount: true,
            revalidateOnFocus: true,
            revalidateFirstPage: true,
        }
    );

    return swr;
}
