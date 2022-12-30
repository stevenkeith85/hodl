import { HodlCommentViewModel } from '../models/HodlComment';

export const usePinComment = () => {
    const pinComment = async (comment: HodlCommentViewModel) => {
        try {
            const { default: axios } = await import('axios');
            const r = await axios.post(
                `/api/comments/pin`,
                { commentId: comment.id },
                {
                    headers: {
                        'Accept': 'application/json'
                    },
                });
        } catch (error) {
        }
    };

    return pinComment;
};
