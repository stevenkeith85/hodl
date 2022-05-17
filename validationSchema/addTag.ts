import * as yup from 'yup';

export const AddTagValidationSchema = yup.object({
  tag: yup
    .string()
    .ensure()
    .trim()
    .required()
    .min(3)
    .max(30)
    .lowercase()
    .strict(),
  token: yup
    .number()
    .required()
});
