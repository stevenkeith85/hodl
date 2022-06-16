import * as yup from 'yup';

export const GetCommentsValidationSchema = yup.object({
  offset: yup
    .number()
    .required(),
  limit: yup
    .number()
    .max(100)
    .required(),
    object: yup
    .string()
    .required()
    .test('isValidObjectType', 'Unexpected object type', async value => value === "token" || value === "comment"),
  objectId: yup
    .number()
    .required()
    .positive()
    .integer()
});
