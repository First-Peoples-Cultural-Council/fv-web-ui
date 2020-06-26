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

import useDocument from 'DataSource/useDocument'
import useIntl from 'DataSource/useIntl'
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useSearchDialect from 'DataSource/useSearchDialect'
import useWindowPath from 'DataSource/useWindowPath'

import NavigationHelpers, { hasPagination } from 'common/NavigationHelpers'
import {
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_PART_OF_SPEECH_ANY,
} from 'views/components/SearchDialect/constants'

function WordsData(props) {
  const { computeDocument } = useDocument()
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()
  const { searchDialectUpdate, searchDialectReset } = useSearchDialect()

  useEffect(() => {
    // Specify how to clean up after this effect:
    return searchDialectReset
  }, [])

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

  const onNavigateRequest = (path) => {
    if (hasPagination) {
      NavigationHelpers.navigateForward(splitWindowPath.slice(0, splitWindowPath.length - 2), [path], pushWindowPath)
    } else {
      NavigationHelpers.navigateForward(splitWindowPath, [path], pushWindowPath)
    }
  }

  return props.children({
    computeDocument,
    computeLogin,
    constSearchByAlphabet: SEARCH_BY_ALPHABET,
    constSearchPartOfSpeechAny: SEARCH_PART_OF_SPEECH_ANY,
    flashcardMode: false,
    handleCategoryClick,
    handleAlphabetClick,
    intl,
    onNavigateRequest,
    pushWindowPath,
    routeParams,
    splitWindowPath,
  })
}

export default WordsData
