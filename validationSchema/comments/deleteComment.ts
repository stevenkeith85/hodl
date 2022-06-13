import * as yup from 'yup';
import { isValidAddress } from '../../lib/profile';

export const DeleteCommentValidationSchema = yup.object({
  subject: yup
    .string()
    .required()
    .test('isAnAddress', 'Subject should be an address', async value => (await isValidAddress(value))),
  object: yup // TODO: Ensure it is only "comment" or "token"
    .string()
    .required()
    .test('isValidObjectType', 'Unexpected object type', async value => value === "token" || value === "comment"),
  objectId: yup 
    .number()
    .required(),
  id: yup // the comment id
    .number()
    .required()
    .min(0)
    .integer()
});
