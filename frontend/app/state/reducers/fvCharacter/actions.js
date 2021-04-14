import { fetch, query, execute } from 'reducers/rest'

export const fetchCharacter = fetch('FV_CHARACTER', 'FVCharacter', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})

export const fetchCharacters = query('FV_CHARACTERS', 'FVCharacter', {
  headers: { 'enrichers.document': 'character' },
})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishCharacter = execute('FV_CHARACTER_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,character,permissions' },
})
