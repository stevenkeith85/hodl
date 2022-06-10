import * as yup from 'yup';
import { isValidAddress } from '../../lib/profile';

export const DeleteCommentValidationSchema = yup.object({
  subject: yup
    .string()
    .required()
    .test('isAnAddress', 'Subject should be an address', async value => (await isValidAddress(value))),
  token: yup
    .number()
    .required()
    .positive()
    .integer(),
  object: yup // TODO: Ensure it is only "comment" or "token"
    .string()
    .required(),
  objectId: yup // TODO: Ensure it is only "comment" or "token"
    .number()
    .required(),
  id: yup
    .number()
    .required()
    .min(0)
    .integer()
});
