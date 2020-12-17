/*
Copyright 2016 First People's Cultural Council

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
import { useEffect, useState } from 'react'
import Immutable, { Map } from 'immutable'
import selectn from 'selectn'

import useCharacter from 'dataSources/useCharacter'
import useDialect from 'dataSources/useDialect'
import useIntl from 'dataSources/useIntl'
import useLogin from 'dataSources/useLogin'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

import { WORKSPACES } from 'common/Constants'
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'

/**
 * @summary AlphabetDetailData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function AlphabetDetailData({ children }) {
  const [tabValue, setTabValue] = useState(0)
  const { routeParams } = useRoute()
  const { intl } = useIntl()
  const { fetchCharacter, publishCharacter, computeCharacter } = useCharacter()
  const { pushWindowPath } = useWindowPath()
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { computeLogin } = useLogin()

  const characterPath = `${routeParams.dialect_path}/Alphabet/${routeParams.character}`
  const fetchData = () => {
    fetchCharacter(characterPath)
    fetchDialect2(routeParams.dialect_path)
  }
  const computedCharacter = ProviderHelpers.getEntry(computeCharacter, characterPath)
  const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)

  const onNavigateRequest = (path) => {
    pushWindowPath(path)
  }

  /**
   * Publish changes
   */
  const publishChangesAction = () => {
    publishCharacter(
      characterPath,
      { value: 'Republish' },
      null,
      intl.trans(
        'views.pages.explore.dialect.learn.alphabet.character_published_success',
        'Character published successfully!',
        'first'
      )
    )
  }

  useEffect(() => {
    fetchData()
  }, [routeParams.dialect_path, routeParams.word])

  const computeEntities = Immutable.fromJS([
    {
      id: characterPath,
      entity: computeCharacter,
    },
    {
      id: routeParams.dialect_path,
      entity: computeDialect2,
    },
  ])

  const character = selectn('response.title', computedCharacter)

  // Set filter
  // Clean character to make it NXQL friendly
  const currentAppliedFilter = new Map({
    currentAppliedFilter: new Map({
      startsWith: ` AND ( dc:title ILIKE '${StringHelpers.clean(character, CLEAN_NXQL) || ''}%' )`,
    }),
  })

  let relatedWords = []
  if (selectn('response.contextParameters.character.related_words.length', computedCharacter) > 0) {
    const relatedWordsContentMap =
      selectn('response.contextParameters.character.related_words', computedCharacter) || []

    relatedWords = relatedWordsContentMap.map((word) => {
      const title = selectn('dc:title', word)
      const uid = selectn('uid', word)
      const hrefPath = `/explore${selectn('path', word)}`.replace(`/Dictionary/${title}`, `/learn/words/${uid}`)
      return {
        uid,
        onClick: (e) => {
          e.preventDefault()
          NavigationHelpers.navigate(hrefPath, pushWindowPath, false)
        },
        hrefPath,
        title,
      }
    })
  }

  return children({
    character,
    computedCharacter,
    computedDialect2,
    computeEntities,
    computeLogin,
    currentAppliedFilter,
    intl,
    onNavigateRequest,
    publishChangesAction,
    relatedAudio: selectn('response.contextParameters.character.related_audio', computedCharacter) || [],
    relatedVideos: selectn('response.contextParameters.character.related_videos', computedCharacter) || [],
    relatedWords,
    routeParams,
    shouldRenderPageToolbar: routeParams.area === WORKSPACES && selectn('response', computedCharacter) ? true : false,
    tabsOnChange: (e, _tabValue) => setTabValue(_tabValue),
    tabValue,
  })
}

export default AlphabetDetailData
