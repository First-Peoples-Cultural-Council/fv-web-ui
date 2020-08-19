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
import usePhrase from 'DataSource/usePhrase'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

/**
 * @summary PhraseData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PhraseData({ children }) {
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { computeLogin } = useLogin()
  const { changeTitleParams, overrideBreadcrumbs } = useNavigation()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()
  const { computePhrase, deletePhrase, fetchPhrase, publishPhrase } = usePhrase()

  const phrasePath = StringHelpers.isUUID(routeParams.phrase)
    ? routeParams.phrase
    : routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(routeParams.phrase)

  // Dialect
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const dialectClassName = getDialectClassname(computeDialect2)

  // Phrase
  const _computePhrase = ProviderHelpers.getEntry(computePhrase, phrasePath)
  const phraseRawData = selectn('response', _computePhrase)

  const acknowledgement = selectn('properties.fv-phrase:acknowledgement', phraseRawData)
  const audio = selectn('contextParameters.phrase.related_audio', phraseRawData) || []
  const culturalNotes = selectn('properties.fv:cultural_note', phraseRawData) || []
  const definitions = selectn('properties.fv:definitions', phraseRawData)
  const docType = selectn('type', phraseRawData)
  const literalTranslations = selectn('properties.fv:literal_translation', phraseRawData)
  const photos = selectn('contextParameters.phrase.related_pictures', phraseRawData) || []
  const phrasebooks = selectn('contextParameters.phrase.phrase_books', phraseRawData) || []
  const relatedAssets = selectn('contextParameters.phrase.related_assets', phraseRawData) || []
  const relatedToAssets = selectn('contextParameters.phrase.related_by', phraseRawData) || []
  const title = selectn('properties.dc:title', phraseRawData)
  const videos = selectn('contextParameters.phrase.related_videos', phraseRawData) || []
  const uid = selectn('uid', phraseRawData)

  useEffect(() => {
    fetchData()
    ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
  }, [])

  useEffect(() => {
    if (title && selectn('pageTitleParams.phrase', properties) !== title) {
      changeTitleParams({ phrase: title })
      overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.phrase' })
    }
  }, [properties, title])

  const fetchData = async () => {
    fetchPhrase(phrasePath)
    fetchDialect2(routeParams.dialect_path)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: phrasePath,
      entity: computePhrase,
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
    computePhrase: _computePhrase,
    deletePhrase,
    dialect,
    docType,
    publishPhrase,
    routeParams,
    splitWindowPath,
    phrasePath,
    // DetailView
    acknowledgement,
    audio,
    phrasebooks,
    culturalNotes,
    definitions,
    dialectClassName,
    literalTranslations,
    photos,
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
PhraseData.propTypes = {
  children: func,
}

export default PhraseData
