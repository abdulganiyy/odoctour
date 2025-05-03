import * as yup from 'yup';

export const documentSchema = yup.object().shape({
  id: yup.string().optional(), 
  type:yup.string().required(),
  filecontents: yup.string().required(),
  filename: yup.string().optional(),
  mimetype: yup.string().required(),
});

export type DocumentSchema = yup.InferType<typeof documentSchema>;
