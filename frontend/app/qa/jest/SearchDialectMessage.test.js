const ReactDOMServer = require('react-dom/server')
const jsdom = require('jsdom')
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
} from 'common/Constants'
// Let us begin!
// ==================================================
import React from 'react'

import SearchDialectMessage from 'components/SearchDialect/SearchDialectMessage'

const getSearchMessageTests = [
  {
    name: 'Word, partOfSpeed=Any, by letter',
    params: {
      dialectClassName: '',
      letter: 'a',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
    },
    output: "Showing words that start with the letter 'a'",
  },
  {
    name: 'Word, partOfSpeed=Any, by category',
    params: {
      dialectClassName: '',
      category: 'uid',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: 'Showing all words in the selected category',
  },
  {
    name: 'Word, partOfSpeed=Any, searchTerm, 1 checkbox',
    params: {
      dialectClassName: '',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchCulturalNotes: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing words that approximately match the search term 'IS VISIBLE' in the 'Cultural notes' column",
  },
  {
    name: 'Word, partOfSpeed=Any, searchTerm, 1 checkbox (v2)',
    params: {
      dialectClassName: '',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchDefinitions: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing words that approximately match the search term 'IS VISIBLE' in the 'Definitions' column",
  },
  {
    name: 'Word, partOfSpeed=Any, searchTerm, 1 checkbox (v3)',
    params: {
      dialectClassName: '',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchLiteralTranslations: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing words that approximately match the search term 'IS VISIBLE' in the 'Literal translations' column",
  },
  {
    name: 'Word, partOfSpeed=Any, searchTerm, 1 checkbox (v4)',
    params: {
      dialectClassName: '',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing words that approximately match the search term 'IS VISIBLE' in the 'Word' column",
  },
  {
    name: 'Word, partOfSpeed=Any, searchTerm, 2 checkboxes',
    params: {
      dialectClassName: '',
      partOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Word', 'Definitions', and 'Literal translations' columns",
  },
  //Words Adverb
  {
    name: 'Word, partOfSpeed=adverb, by letter',
    params: {
      dialectClassName: '',
      letter: 'a',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing words that start with the letter 'a', filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, by category',
    params: {
      dialectClassName: '',
      category: 'uid',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: "Showing all words in the selected category, filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, searchTerm, 1 checkbox (v1)',
    params: {
      dialectClassName: '',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchCulturalNotes: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Cultural notes' column, filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, searchTerm, 1 checkbox (v2)',
    params: {
      dialectClassName: '',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchDefinitions: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Definitions' column, filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, searchTerm, 1 checkbox (v3)',
    params: {
      dialectClassName: '',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchLiteralTranslations: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Literal translations' column, filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, searchTerm, 1 checkbox (v4)',
    params: {
      dialectClassName: '',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Word' column, filtered by the selected 'Parts of speech'",
  },
  {
    name: 'Word, partOfSpeed=adverb, searchTerm, 3 checkboxes',
    params: {
      dialectClassName: '',
      partOfSpeech: 'adverb',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output:
      "Showing words that approximately match the search term 'IS VISIBLE' in the 'Word', 'Definitions', and 'Literal translations' columns, filtered by the selected 'Parts of speech'",
  },
  // Phrases
  {
    name: 'Phrase, by letter',
    params: {
      dialectClassName: '',
      letter: 'a',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: "Showing phrases that start with the letter 'a'",
  },
  {
    name: 'Phrase, by category',
    params: {
      dialectClassName: '',
      category: 'uid',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: 'Showing all phrases in the selected category',
  },
  {
    name: 'Phrase, by phrase book',
    params: {
      dialectClassName: '',
      phraseBook: 'uid',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'NOT VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: 'Showing all phrases from the selected Phrase Book',
  },
  {
    name: 'Phrase, searchTerm, 1 checkbox (v1)',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchCulturalNotes: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: "Showing phrases that approximately match the search term 'IS VISIBLE' in the 'Cultural notes' column",
  },
  {
    name: 'Phrase, searchTerm, 1 checkbox (v2)',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchDefinitions: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: "Showing phrases that approximately match the search term 'IS VISIBLE' in the 'Definitions' column",
  },
  {
    name: 'Phrase, searchTerm, 1 checkbox (v3)',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: "Showing phrases that approximately match the search term 'IS VISIBLE' in the 'Phrase' column",
  },
  {
    name: 'Phrase, searchTerm, 3 checkboxes',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchTerm: 'IS VISIBLE',
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output:
      "Showing phrases that approximately match the search term 'IS VISIBLE' in the 'Phrase', 'Definitions', and 'Cultural notes' columns",
  },
  // nothing:
  {
    name: 'Phrase, no searchTerm, 3 checkboxes',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      shouldSearchCulturalNotes: true,
      shouldSearchDefinitions: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: 'Showing all phrases listed alphabetically',
  },
  {
    name: 'Phrase, no searchTerm, 0 checkboxes',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchDialectDataType: SEARCH_DATA_TYPE_PHRASE,
    },
    output: 'Showing all phrases listed alphabetically',
  },
  {
    name: 'Word, no searchTerm, 0 checkboxes',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: 'Showing all words in the dictionary listed alphabetically',
  },
  {
    name: 'Word, no searchTerm, 3 checkboxes',
    params: {
      dialectClassName: '',
      searchStyle: SEARCH_TYPE_APPROXIMATE_SEARCH,
      shouldSearchDefinitions: true,
      shouldSearchLiteralTranslations: true,
      shouldSearchTitle: true,
      searchDialectDataType: SEARCH_DATA_TYPE_WORD,
    },
    output: 'Showing all words in the dictionary listed alphabetically',
  },
]

describe('SearchDialectMessage', () => {
  getSearchMessageTests.forEach(({ name, params, output }, index) => {
    test(`Test ${index}: ${name}`, () => {
      const out = ReactDOMServer.renderToStaticMarkup(<SearchDialectMessage {...params} />)
      const dom = new jsdom.JSDOM(`<!DOCTYPE html><div>${out}</div>`)
      const text = dom.window.document.querySelector('div').textContent.replace(/\s+/g, ' ')
      expect(text).toMatch(output)
    })
  })
})
