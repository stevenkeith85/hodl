import { HodlCommentViewModel } from '../models/HodlComment';

export const useDeleteComment = () => {
    const deleteComment = async (comment: HodlCommentViewModel) => {
        try {
            const { default: axios } = await import('axios');
            const r = await axios.delete(
                `/api/comments/delete`,
                {
                    headers: {
                        'Accept': 'application/json'
                    },
                    data: {
                        id: comment.id,
                    },
                });
        } catch (error) {
        }
    };

    return deleteComment;
};
