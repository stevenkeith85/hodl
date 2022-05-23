import * as yup from 'yup';

export const CommentValidationSchema = yup.object({
  comment: yup
    .string()
    .ensure()
    .trim()
    .required()
    .min(3)
    .max(150)
    .strict(),
  token: yup
    .number()
    .required()
});
