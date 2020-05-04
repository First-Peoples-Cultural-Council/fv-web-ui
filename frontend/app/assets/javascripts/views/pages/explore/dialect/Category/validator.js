// TODO: IMPORT ONLY WHAT IS USED
import * as yup from 'yup'

import copy from './internationalization'

const validForm = yup.object().shape({
  'dc:title': yup
    .string()
    .label(copy.create.name)
    .required(copy.validation.name),
  'dc:description': yup.string(),
})
export default validForm
