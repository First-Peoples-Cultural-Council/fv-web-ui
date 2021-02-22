// import React from 'react'
// import { render, screen } from '@testing-library/react'
import { findSelectedCharacterData } from 'components/Alphabet/AlphabetData'

// Data
const data = [
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
  {
    title: 'Ǭ',
    uid: '054c4507-7cbc-4029-8a91-95924536d3a5',
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
    title: 't',
    uid: '7bc00011-9033-4aa7-8576-92c24915e6a5',
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
    title: 'Ǒ',
    uid: '7774cc25-798a-43f5-9456-15e641f89b83',
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
    title: 'ᐢ',
    uid: '149bd537-8266-49cc-bf44-df43cac45abe',
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
    title: 'Ǔ',
    uid: 'a31726cc-e082-4e65-9ba9-a237c063a33c',
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
    title: 'y',
    uid: 'cc36139d-975b-4e16-aa30-b6ec3c446df9',
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
    title: 'ᔦ',
    uid: '12f30f26-4695-4118-bf5e-4826d3fa3164',
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
    title: 'ᓱ',
    uid: '7843ea62-c3c8-4a00-ac35-ecfa85f79ae5',
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
    title: "ḵ'",
    uid: '37e070e8-4ffa-4bc7-b9c4-9a177071ada3',
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
    title: 'w',
    uid: '8d90793c-b19b-46bd-9933-1d38748599db',
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
    title: 's',
    uid: 'a14fa5a4-c628-42ae-8a29-f3d1911b5351',
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
    title: 'b',
    uid: '9ec00e36-c836-4ef4-a98c-3e549c2925ce',
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
    title: 'Ǐ',
    uid: '374dae5e-3806-4020-b7b9-a34a05b8df8c',
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
    title: 'x',
    uid: '10f2af20-b065-4d31-8ccd-842dc2555d2e',
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
    title: 'a',
    uid: '96adb6aa-56cc-45cf-b3ed-a525d7b40f93',
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
    title: 'ǳ',
    uid: '92649908-f378-4644-acc7-59efd055fc94',
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
    title: 'ǂ',
    uid: '16934d1b-49d7-4e55-a0d9-d1f82328c5fe',
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
    title: 'ǫ',
    uid: '049720c3-c464-4be4-a27c-22e1f260b0d5',
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
    title: 'ǰ',
    uid: 'b58ac281-234e-4986-9d95-62e120da56bf',
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
    title: 'ᔭ',
    uid: '8e50f789-e454-423b-a472-7b20e182001c',
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
    title: 'ǧ',
    uid: '14738ecf-c609-42da-a477-82096a691e0e',
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
    title: 'ǎ',
    uid: '78d5f6fb-c66e-403e-9aae-4d8ad1afd4fa',
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
    title: 'z',
    uid: 'cfcfded5-ea1f-4254-aa5f-c755cec18d2a',
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
    title: 'hl',
    uid: 'a608079e-b8f0-4942-931d-af1f1930009f',
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
    title: 'gw',
    uid: '48ead292-8827-433b-a4a2-37bda6035d47',
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
    title: 'yy',
    uid: 'baae73af-00a6-46e8-817c-57584b96e06a',
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
    title: 'ᓯ',
    uid: '1dcac9c5-2fbd-4cf3-bae0-37e65ce00465',
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
]
const character = 'ᓯ'
describe('AlphabetData', () => {
  test('findSelectedCharacterData', () => {
    const output = findSelectedCharacterData({ character, data })
    expect(output.title).toBe(character)
  })
})

// Presentation
// describe('HeroPresentation', () => {
//   test('All content present', () => {
//     render(<HeroPresentation background={HeroBackground} foreground={str} foregroundIcon={strIcon} />)
//     expect(
//       screen.getByText(strIcon, {
//         exact: false,
//       })
//     ).toBeInTheDocument()
//   })
// })
