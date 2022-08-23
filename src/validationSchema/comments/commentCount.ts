import * as yup from 'yup';

export const CommentCountValidationSchema = yup.object({
  object: yup
    .string()
    .required()
    .test('isValidObjectType', 'Unexpected object type', async value => value === "token" || value === "comment"),
  id: yup // the comment id
    .number()
    .required()
    .min(0)
    .integer()
});
