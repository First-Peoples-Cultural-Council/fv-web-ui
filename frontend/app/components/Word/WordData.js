import { useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'

// FPCC
import useDialect from 'dataSources/useDialect'
import useLogin from 'dataSources/useLogin'
import useNavigation from 'dataSources/useNavigation'
import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'
import useWord from 'dataSources/useWord'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import { getDialectClassname } from 'common/Helpers'

/**
 * @summary WordData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WordData({ children }) {
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { computeLogin } = useLogin()
  const { changeTitleParams, overrideBreadcrumbs } = useNavigation()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()
  const { computeWord, deleteWord, fetchWord, publishWord } = useWord()

  const wordPath = StringHelpers.isUUID(routeParams.word)
    ? routeParams.word
    : routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(routeParams.word)

  // Dialect
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const dialectClassName = getDialectClassname(computeDialect2)
  // Word
  const _computeWord = ProviderHelpers.getEntry(computeWord, wordPath)
  const wordRawData = selectn('response', _computeWord)

  const acknowledgement = selectn('properties.fv-word:acknowledgement', wordRawData)
  const audio = selectn('contextParameters.word.related_audio', wordRawData) || []
  const categories = selectn('contextParameters.word.categories', wordRawData) || []
  const culturalNotes = selectn('properties.fv:cultural_note', wordRawData) || []
  const generalNote = selectn('properties.fv:general_note', wordRawData)
  const definitions = selectn('properties.fv:definitions', wordRawData)
  const docType = selectn('type', wordRawData)
  const literalTranslations = selectn('properties.fv:literal_translation', wordRawData)
  const partOfSpeech = selectn('contextParameters.word.part_of_speech', wordRawData)
  const photos = selectn('contextParameters.word.related_pictures', wordRawData) || []
  const phrases = selectn('contextParameters.word.related_phrases', wordRawData) || []
  const pronunciation = selectn('properties.fv-word:pronunciation', wordRawData)
  const relatedAssets = selectn('contextParameters.word.related_assets', wordRawData) || []
  const relatedToAssets = selectn('contextParameters.word.related_by', wordRawData) || []
  const title = selectn('properties.dc:title', wordRawData)
  const videos = selectn('contextParameters.word.related_videos', wordRawData) || []
  const uid = selectn('uid', wordRawData)

  useEffect(() => {
    fetchData()
    ProviderHelpers.fetchIfMissing({ key: routeParams.dialect_path, action: fetchDialect2, reducer: computeDialect2 })
  }, [])

  useEffect(() => {
    if (title && selectn('pageTitleParams.word', properties) !== title) {
      changeTitleParams({ word: title })
      overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.word' })
    }
  }, [properties, title])

  const fetchData = async () => {
    fetchWord(wordPath)
    fetchDialect2(routeParams.dialect_path)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: wordPath,
      entity: computeWord,
    },
    {
      id: routeParams.dialect_path,
      entity: computeDialect2,
    },
  ])

  return children({
    // Actions
    computeEntities,
    computeLogin,
    computeWord: _computeWord,
    deleteWord,
    dialect,
    docType,
    publishWord,
    routeParams,
    splitWindowPath,
    wordPath,
    // DetailView
    acknowledgement,
    audio,
    categories,
    culturalNotes,
    definitions,
    dialectClassName,
    generalNote,
    literalTranslations,
    partOfSpeech,
    photos,
    phrases,
    pronunciation,
    properties,
    pushWindowPath,
    relatedAssets,
    relatedToAssets,
    siteTheme: routeParams.siteTheme,
    title,
    videos,
  })
}
// PROPTYPES
const { func } = PropTypes
WordData.propTypes = {
  children: func,
}

export default WordData
