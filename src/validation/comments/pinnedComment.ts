import * as yup from 'yup';

export const PinnedCommentValidationSchema = yup.object({
  id: yup // the comment id
    .number()
    .required()
    .min(0)
    .integer()
});
