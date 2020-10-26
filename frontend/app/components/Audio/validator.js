// TODO: IMPORT ONLY WHAT IS USED
import * as yup from 'yup'

// V1 using t.comb:
// import Dublincore from 'common/schemas/Dublincore'
// FVAudio: Object.assign({}, Dublincore, FVMedia),
// import FVMedia from 'common/schemas/FVMedia'
/*
  'dc:title': t.String,
  'dc:description': t.maybe(t.String),
  'file': t.form.File,
  'fvm:shared': t.Boolean,
  'fvm:child_focused': t.Boolean,
  'fvm:recorder': t.list(t.String),
  'fvm:source': t.list(t.String),
*/
import copy from './copy'

const validator = yup.object().shape({
  'dc:title': yup
    .string()
    .label(copy.name)
    .required(copy.validation.name),
  'dc:description': yup.string(),
  // file: yup.array().min(1, 'gotta provide a file!'),
  file: yup.array(),
  'fvm:shared': yup.boolean(),
  'fvm:child_focused': yup.boolean(),
  'fvm:source': yup.array().of(yup.string()),
  'fvm:recorder': yup.array().of(yup.string()),
})

export const toParse = [/^fvm:source/, /^fvm:recorder/]
export default validator
