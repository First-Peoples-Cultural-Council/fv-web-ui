import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import AlphabetPresentation from 'components/Alphabet/AlphabetPresentation'
jest.mock('components/AudioMinimal/AudioMinimalContainer')

// Data
const characters = [
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
]
const links = [
  {
    url: '/url/1',
    title: 'Download Alphabet Pronunciation Guide',
  },
  { url: '/url/2', title: 'Another potential related link' },
]
const character = "k'"
const selectedData = {
  title: "k'",
  uid: 'e1134fc0-e4c4-4684-89d8-fb7ee1bd9bff',
  src: '/nuxeo/nxfile/default/b762405b-f98a-4b04-bbd2-1f710eaca9a0/file:content/En-us-river.ogg.mp3',
  relatedEntries: [
    {
      uid: '1-2-3',
      title: 'RelatedWord',
      definitions: ['defn1', 'defn2'],
      src:
        'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
      url: '/jestLanguage/word/1-2-3',
    },
  ],
}

// Presentation
describe('AlphabetPresentation', () => {
  test('Message is displayed when no character is selected', () => {
    render(<AlphabetPresentation />)
    expect(screen.getByTestId('AlphabetPresentation__noCharacter')).toBeInTheDocument()
  })
  test('Selected character has testid and is the correct text content', () => {
    render(
      <Router>
        <AlphabetPresentation
          isLoading={false}
          characters={characters}
          language="jestLanguage"
          selectedData={selectedData}
          links={links}
        />
      </Router>
    )
    const element = screen.getByTestId('AlphabetPresentation__selectedCharacter')
    expect(element).toHaveTextContent(character)
  })
  test('Selected sidebar heading has correct text', () => {
    render(
      <Router>
        <AlphabetPresentation
          isLoading={false}
          characters={characters}
          language="jestLanguage"
          selectedData={selectedData}
          links={links}
        />
      </Router>
    )
    const heading = screen.getByTestId('AlphabetPresentationSelected__header')
    expect(heading).toHaveTextContent(character)
  })
})
