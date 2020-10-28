import { fetch } from 'reducers/rest'

export const fetchLanguageFamily = fetch('FV_LANGUAGE_FAMILY', 'FVLanguageFamily', {
  headers: { 'enrichers.document': 'ancestry' },
})
