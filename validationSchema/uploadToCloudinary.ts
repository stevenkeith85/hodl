import * as yup from 'yup';

export const uploadToCloudinaryValidationSchema = yup.object({
    filename: yup
      .mixed()
      .required(),
  });
  