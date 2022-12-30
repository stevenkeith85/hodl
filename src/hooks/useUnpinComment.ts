import { HodlCommentViewModel } from '../models/HodlComment';

export const useUnpinComment = () => {
    const unpinComment = async (comment: HodlCommentViewModel) => {
        try {
            const { default: axios } = await import('axios');
            const r = await axios.delete(
                `/api/comments/pin`,
                {
                    headers: {
                        'Accept': 'application/json'
                    },
                    data: {
                        commentId: comment.id
                    },
                });
        } catch (error) {
        }
    };

    return unpinComment;
};
