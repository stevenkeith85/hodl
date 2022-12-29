import * as yup from 'yup';

export const PinCommentValidationSchema = yup.object({
  commentId: yup
    .number()
    .required()
    .min(0)
    .integer()
});
