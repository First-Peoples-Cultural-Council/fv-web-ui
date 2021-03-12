import getSectionsAdaptor from 'services/api/adaptors/getSections'
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
  idLogo: null,
  logoUrl: '/nuxeo/nxpicsfile/default/null/Small:content/',
}

describe('getSectionsAdaptor', () => {
  test('works', () => {
    const output = getSectionsAdaptor(input)
    expect(output).toStrictEqual(expectedOutput)
  })
})
