import * as yup from 'yup';

export const UnpinCommentValidationSchema = yup.object({
  commentId: yup
    .number()
    .required()
    .min(0)
    .integer()
});
