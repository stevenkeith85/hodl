import * as yup from 'yup';
import { validFilter, validLicenseDeclaration } from '../lib/utils';



export const ipfsImageAndAssetValidationSchema = yup.object({
  fileName: yup
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
  mimeType: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
  aspectRatio: yup
    .string()
    .ensure()
    .required()
});

export const ipfsMetadataValidationSchema = yup.object({
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
  filter: yup
    .string()
    .nullable()
    .test(
      'isValidFilterValue',
      'Unsupported filter value',
      (value, context) => Boolean(value === null || validFilter(value))
    ),
  mimeType: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
  aspectRatio: yup
    .string()
    .ensure()
    .required(),
  assetCid: yup
    .string()
    .ensure()
    .required(),
  imageCid: yup
    .string()
    .ensure()
    .required()
});
