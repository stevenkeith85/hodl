import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithObjectAndId, fetchWithObjectObjectIdOffsetLimit } from '../lib/swrFetchers';
import axios from 'axios';
import { HodlComment, HodlCommentViewModel } from '../models/HodlComment';

export const useAddComment = (): [(comment: HodlComment) => Promise<void>] => {
    const addComment = async (comment: HodlComment) => {
        try {
            const r = await axios.post(
                `/api/comments/add`,
                {
                    comment: comment.comment.trim(), // the text string
                    objectId: comment.objectId, // the id of what we are commenting on.
                    object: comment.object, // the type of object we are commenting on (a token (top level) or a comment (reply))
                    tokenId: comment.tokenId // the token this comment was made under
                },
                {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
        } catch (error) {
        }
    }

    return [addComment]
}

export const useDeleteComment = (): [(comment: HodlCommentViewModel) => Promise<void>] => {
    const deleteComment = async (comment: HodlCommentViewModel) => {
        try {
            const r = await axios.delete(
                `/api/comments/delete`,
                {
                    headers: {
                        'Accept': 'application/json',
                    },
                    data: {
                        id: comment.id
                    },
                });
        } catch (error) {
        }
    }

    return [deleteComment]
}

export const useCommentCount = (
    id: number,
    object: "token" | "comment",
    fallbackData = null,
) => {
    const swr = useSWR(
         [`/api/comments/count`, object, id],
        fetchWithObjectAndId,
        { fallbackData }
    );

    return swr
}

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
        { fallbackData }
    );

    return swr;
}
