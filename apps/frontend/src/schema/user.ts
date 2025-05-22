import * as yup from 'yup';
import { REQUIRED,INVALID_EMAIL } from './common-validation';



export const createNewUserFormSchema = yup.object().shape({
  email: yup.string().email().required(INVALID_EMAIL),
  phone:yup.string().required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  link: yup.string().optional(),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
    role:yup.string().required(REQUIRED),
    picture:yup.object().shape({
      id:yup.string(),
      url:yup.string(),
      filename:yup.string(),
    }),
}
);

export const EditMeetingFormSchema = yup.object().shape({
  name: yup.string().required(),
  duration: yup.string().required(),
  type: yup.string().required(),
  url: yup.string().required(),
  availability:yup.array().of(yup.object().shape({  
    dayOfWeek: yup.string().required(),
    canBook: yup.boolean().optional(),
    allDay: yup.boolean().optional(),
    startTime: yup.string().required(),
    endTime: yup.string().required(),}).required('Invalid time format'))
}
);


export const createNewMeetingFormSchema = yup.object().shape({
    name: yup.string().required(),
    duration: yup.string().required(),
    type: yup.string().required(),
    url: yup.string().required(),
  });