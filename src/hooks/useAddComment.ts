import { HodlComment } from '../models/HodlComment';

export const useAddComment = (): [(comment: HodlComment) => Promise<void>] => {
    const addComment = async (comment: HodlComment) => {
        const { default: axios } = await import('axios');
        try {
            const r = await axios.post(
                `/api/comments/add`,
                {
                    comment: comment.comment.trim(),
                    objectId: comment.objectId,
                    object: comment.object,
                    tokenId: comment.tokenId // the token this comment was made under
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
        } catch (error) {
        }
    };

    return [addComment];
};
