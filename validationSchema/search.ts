import * as yup from 'yup';

export const SearchValidationSchema = yup.object({
  q: yup
    .string()
    .ensure()
    .trim()
    .required()
    .min(3)
    .max(30)
    .lowercase()
    .strict(),
});
