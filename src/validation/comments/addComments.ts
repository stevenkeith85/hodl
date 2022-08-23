import * as yup from 'yup';

export const AddCommentValidationSchema = yup.object({
  comment: yup
    .string()
    .ensure()
    // .trim()
    .required()
    .min(3)
    .max(400)
    .strict(),
  objectId: yup
    .number()
    .required()
    .positive()
    .integer(),
  object: yup
    .string()
    .required()
    .test('isValidObjectType', 'Unexpected object type', async value => value === "token" || value === "comment"),
  tokenId: yup
    .number()
    .required()
    .positive()
    .integer(),
});
