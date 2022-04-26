import * as yup from 'yup';
import { isValidAddress } from '../lib/profile';

export const nicknameValidationSchema = yup.object({
    nickname: yup
        .string()
        .ensure()
        .trim()
        .required()
        .min(3)
        .max(30)
        .lowercase()
        .strict()
        .matches(/^[\d\w._]+$/, 'Only letters, numbers, underscores and period accepted')
        .test('isNotAnAddress', 'You cannot set your nickname to an address', async value => !(await isValidAddress(value)))
  });
