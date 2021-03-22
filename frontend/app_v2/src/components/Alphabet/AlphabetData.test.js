import AlphabetData, { findSelectedCharacterData } from 'components/Alphabet/AlphabetData'

// Data
describe('AlphabetData', () => {
  const testCharacter = 'u'
  test('findSelectedCharacterData', () => {
    const output = findSelectedCharacterData({
      character: testCharacter,
      data: {
        characters: [
          {
            title: "k'",
            uid: 'e1134fc0-e4c4-4684-89d8-fb7ee1bd9bff',
            src: 'nxfile/default/b762405b-f98a-4b04-bbd2-1f710eaca9a0/file:content/En-us-river.ogg.mp3',
            relatedEntries: [
              {
                uid: '1-2-3',
                title: 'RelatedWord',
                definitions: ['defn1', 'defn2'],
                src:
                  'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
              },
            ],
          },
          {
            title: 'v',
            uid: 'c6fa2b99-4076-43bb-adf9-9271ae7363d7',
            relatedEntries: [
              {
                uid: '1-2-3',
                title: 'RelatedWord',
                definitions: ['defn1', 'defn2'],
                src:
                  'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
              },
            ],
          },
          {
            title: 'u',
            uid: '549cd27f-c0db-424d-8409-bf3070fc03f2',
            relatedEntries: [
              {
                uid: '1-2-3',
                title: 'RelatedWord',
                definitions: ['defn1', 'defn2'],
                src:
                  'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
              },
            ],
          },
        ],
      },
      language: 'jestLanguage',
    })
    expect(output.title).toBe(testCharacter)
  })

  test('Ensure output is consistent', () => {
    const output = AlphabetData()
    expect(output).toMatchSnapshot()
  })
})
