// TODO: IMPORT ONLY WHAT IS USED
import * as yup from 'yup'

// V1 using t.comb:
// import Dublincore from 'common/schemas/Dublincore'
// FVContributor: Object.assign({}, Dublincore),
/*
  'dc:title': t.String,
  'dc:description': t.maybe(t.String),
*/
import copy from './copy'

const validator = yup.object().shape({
  'dc:title': yup
    .string()
    .label(copy.create.name)
    .required(copy.validation.name),
  'dc:description': yup.string(),
})
export default validator
