import { useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'

// FPCC
import useDialect from 'DataSource/useDialect'
import useLogin from 'DataSource/useLogin'
import useNavigation from 'DataSource/useNavigation'
import useProperties from 'DataSource/useProperties'
import useRoute from 'DataSource/useRoute'
import useWindowPath from 'DataSource/useWindowPath'
import useWord from 'DataSource/useWord'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

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

  // Compute dialect
  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const fetchDocumentAction = selectn('action', extractComputeDialect)

  const wordPath = StringHelpers.isUUID(routeParams.word)
    ? routeParams.word
    : routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(routeParams.word)

  const _computeWord = ProviderHelpers.getEntry(computeWord, wordPath)
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const wordRawData = selectn('response', _computeWord)

  const acknowledgement = selectn('properties.fv-word:acknowledgement', wordRawData)
  const audio = selectn('contextParameters.word.related_audio', wordRawData) || []
  const categories = selectn('contextParameters.word.categories', wordRawData) || []
  const culturalNotes = selectn('properties.fv:cultural_note', wordRawData) || []
  const definitions = selectn('properties.fv:definitions', wordRawData)
  const dialectClassName = getDialectClassname(computeDialect2)
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

  //   const tabData = getTabs({ phrases, photos, videos, audio })
  const tabData = [] // TODO

  useEffect(() => {
    fetchData()
    ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
  }, [])

  // Set dialect state if/when fetch finishes
  useEffect(() => {
    if (title && selectn('pageTitleParams.wordName', properties) !== title) {
      changeTitleParams({ word: title })
      overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.wordName' })
    }
  }, [fetchDocumentAction, title])

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
    publishWord,
    routeParams,
    splitWindowPath,
    tabData,
    wordPath,
    // DetailView
    acknowledgement,
    audio,
    categories,
    culturalNotes,
    definitions,
    dialectClassName,
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
