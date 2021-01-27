// Let us begin!
// ==================================================
import { adaptor } from 'components/About/AboutData'
const input = {
  path: '/FV/sections/Data/Test/Test/ÜgwÛ',
  uid: '5210e2d1-9074-4cef-8d3a-20a88bace75c',
  roles: [],
  groups: [
    'group:administrators',
    'group:ügwû_recorders_with_approval',
    'group:ügwû_language_administrators',
    'group:members',
  ],
  title: 'ÜgwÛ',
  parentLanguageTitle: null,
  logoId: null,
}
const expectedOutput = {
  path: '/FV/sections/Data/Test/Test/ÜgwÛ',
  title: 'ÜgwÛ',
  uid: '5210e2d1-9074-4cef-8d3a-20a88bace75c',
}

describe('AboutData', () => {
  test('Adaptor', () => {
    const output = adaptor(input)
    expect(output).toStrictEqual(expectedOutput)
  })
})
