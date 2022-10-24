import * as yup from 'yup';
import { validFilter, validLicenseDeclaration } from '../lib/utils';

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
  license: yup
    .string()
    .ensure()
    .required()
    .test(
      'isValidLicenseValue',
      'Unsupported license declaration',
      (value, context) => Boolean(value === null || validLicenseDeclaration(value)),
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
    ),
  // aspectRatio: yup
  //   .string()
  //   .nullable()
  //   .test(
  //     'isValidAspectRatioValue',
  //     'Unsupported aspect ratio value',
  //     (value, context) => Boolean(value === null || validAspectRatio(value))
  //   )
});
