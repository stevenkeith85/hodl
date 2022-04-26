import * as yup from 'yup';

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
  });
  