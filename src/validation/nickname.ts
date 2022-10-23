import * as yup from 'yup';

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
        .test(
            'isNotAnAddress', 
            'You cannot set your nickname to something that looks similar to an address', 
            async nickname => !/^0x[0-9A-F]{3,}$/i.test(nickname)
        ) 
  });
