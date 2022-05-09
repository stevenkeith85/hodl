import * as yup from 'yup';
import { validFilter, validPrivilegeValue } from '../lib/utils';

export const uploadToIPFSValidationSchema = yup.object({
  name: yup
    .string()
    .ensure()
    .min(1)
    .max(100)
    .required(),
  description: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
  privilege: yup
    .string()
    .ensure()
    .required()
    .test(
      'isValidPrivilegeValue',
      'Unsupported privilege declaration',
      (value, context) => Boolean(value === null || validPrivilegeValue(value)),
    ),
  fileName: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
  mimeType: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
  filter: yup
    .string()
    .nullable()
    .test(
      'isValidFilterValue',
      'Unsupported filter value',
      (value, context) => Boolean(value === null || validFilter(value))
    )
});
