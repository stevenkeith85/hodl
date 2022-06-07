import * as yup from 'yup';

export const GetCommentsValidationSchema = yup.object({
  offset: yup
    .number()
    .required(),
  limit: yup
    .number()
    .max(100)
    .required(),
  token: yup
    .number()
    .required()
    .positive()
    .integer()
});
