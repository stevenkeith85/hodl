import * as yup from 'yup';

export const AddTagValidationSchema = yup.object({
  tag: yup
    .string()
    .ensure()
    .trim()
    .required()
    .min(3)
    .max(25)
    .lowercase()
    .strict()
    .matches(/^[\d\w_]+$/, 'Only letters, numbers, underscores accepted'),
  token: yup
    .number()
    .required()
    .positive()
    .integer()
});
