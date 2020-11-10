/* Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { useEffect } from 'react'
import Immutable from 'immutable'

import useDialect from 'dataSources/useDialect'
import useDocument from 'dataSources/useDocument'
import useIntl from 'dataSources/useIntl'
import usePortal from 'dataSources/usePortal'
import useRoute from 'dataSources/useRoute'
import useSearchDialect from 'dataSources/useSearchDialect'
import useWindowPath from 'dataSources/useWindowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import { SEARCH_BY_ALPHABET, SEARCH_BY_CATEGORY, SEARCH_PART_OF_SPEECH_ANY } from 'common/Constants'

function WordsData(props) {
  const { computeDialect2, fetchDialect2 } = useDialect()
  const { computeDocument, fetchDocument } = useDocument()
  const { intl } = useIntl()
  const { computePortal, fetchPortal } = usePortal()
  const { routeParams } = useRoute()
  const { splitWindowPath } = useWindowPath()
  const { searchDialectUpdate, searchDialectReset } = useSearchDialect()

  const dictionaryKey = `${routeParams.dialect_path}/Dictionary`

  useEffect(() => {
    fetchData()
    // Specify how to clean up after this effect:
    return searchDialectReset
  }, [])

  const fetchData = async () => {
    // Dialect
    await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
    // Document
    await ProviderHelpers.fetchIfMissing(dictionaryKey, fetchDocument, computeDocument)
    // Portal
    await ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, fetchPortal, computePortal)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: routeParams.dialect_path,
      entity: computePortal,
    },
    {
      id: dictionaryKey,
      entity: computeDocument,
    },
  ])

  const handleCategoryClick = async ({ selected }) => {
    await searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CATEGORY,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchingDialectFilter: selected.checkedFacetUid,
      searchTerm: '',
    })
  }

  const handleAlphabetClick = async ({ letterClicked }) => {
    await searchDialectUpdate({
      searchByAlphabet: letterClicked,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })
  }

  return props.children({
    computeEntities,
    constSearchByAlphabet: SEARCH_BY_ALPHABET,
    constSearchPartOfSpeechAny: SEARCH_PART_OF_SPEECH_ANY,
    flashcardMode: false,
    handleCategoryClick,
    handleAlphabetClick,
    intl,
    routeParams,
    splitWindowPath,
  })
}

export default WordsData
