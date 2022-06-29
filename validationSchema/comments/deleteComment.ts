import * as yup from 'yup';

export const DeleteCommentValidationSchema = yup.object({
  id: yup
    .number()
    .required()
    .min(0)
    .integer()
});
