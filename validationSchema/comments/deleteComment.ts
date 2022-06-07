import * as yup from 'yup';
import { isValidAddress } from '../../lib/profile';

export const DeleteCommentValidationSchema = yup.object({
  subject: yup
    .string()
    .required()
    .test('isAnAddress', 'Subject should be an address', async value => (await isValidAddress(value))),
  timestamp: yup
    .string()
    .required(),
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
    .positive()
    .integer()
});
