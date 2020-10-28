// TODO: IMPORT ONLY WHAT IS USED
import * as yup from 'yup'

import copy from './copy'

const validator = yup.object().shape({
  'dc:title': yup.string().required(copy.validation.title),
  'fv-word:part_of_speech': yup.string(),
  'fv-word:pronunciation': yup.string(),
  'fv-word:available_in_games': yup.string(),
  'fv:available_in_childrens_archive': yup.string(),
  'fv:cultural_note': yup.array().of(yup.string()),
  'fv:definitions': yup.array().of(yup.object().shape({ language: yup.string(), translation: yup.string() })),
  'fv:literal_translation': yup.array().of(yup.object().shape({ language: yup.string(), translation: yup.string() })),
  'fv:reference': yup.string(),
  'fv-word:acknowledgement': yup.string(),
  'fv:related_audio': yup.array().of(yup.string()),
  'fv:related_pictures': yup.array().of(yup.string()),
  'fv:source': yup.array().of(yup.string()),
})

export const toParse = [
  /^fv:literal_translation/,
  /^fv:definitions/,
  /^fv:related_audio/,
  /^fv:related_pictures/,
  /^fv:cultural_note/,
  /^fvm:source/,
  /^fv-word:related_phrases/,
]
export default validator
