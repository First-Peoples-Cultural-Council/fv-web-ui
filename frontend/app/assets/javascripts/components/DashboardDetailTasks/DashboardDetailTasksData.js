import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import useDocument from 'DataSource/useDocument'
import ProviderHelpers from 'common/ProviderHelpers'
import { URL_QUERY_PLACEHOLDER } from 'common/Constants'

/**
 * @summary DashboardDetailTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardDetailTasksData({ children }) {
  const idSelectedItem = useRef()
  const [selectedItemData, setSelectedItemData] = useState({})
  const { getSearchObject, navigate, navigateReplace } = useNavigationHelpers()
  const { computeDocument, fetchDocument } = useDocument()
  const { active } = getSearchObject()

  const { fetchMessage, isFetching, tasks } = useUserGroupTasks()
  useEffect(() => {
    if (active === URL_QUERY_PLACEHOLDER && tasks.length > 0) {
      navigateReplace(`${window.location.pathname}?active=${tasks[0].id}`)
    }
  }, [tasks])
  useEffect(() => {
    if (active !== URL_QUERY_PLACEHOLDER && tasks.length > 0) {
      const selectedTask = tasks.filter(({ id }) => {
        return id === active
      })
      const firstTargetDocumentId = selectn([0, 'targetDocumentsIds', 0], selectedTask)
      idSelectedItem.current = firstTargetDocumentId
      fetchDocument(idSelectedItem.current)
    }
  }, [active, tasks])
  useEffect(() => {
    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, idSelectedItem.current)
    const _selectedItemData = selectn(['response'], extractComputeDocument)

    // General
    // const dialectClassName = getDialectClassname(computeDialect2)
    // Word (General?)
    const culturalNotes = selectn('properties.fv:cultural_note', _selectedItemData) || []
    const definitions = selectn('properties.fv:definitions', _selectedItemData)
    const title = selectn('title', _selectedItemData)
    // const metadata = selectn('response', _selectedItemData) ? (
    //   <MetadataPanel properties={this.props.properties} computeEntity={_selectedItemData} />
    // ) : null
    const literalTranslations = selectn('properties.fv:literal_translation', _selectedItemData)
    // Word Specific
    const acknowledgement = selectn('properties.fv-word:acknowledgement', _selectedItemData)
    const audio = selectn('contextParameters.word.related_audio', _selectedItemData) || []
    const categories = selectn('contextParameters.word.categories', _selectedItemData) || []
    const partOfSpeech = selectn('contextParameters.word.part_of_speech', _selectedItemData)
    const photos = selectn('contextParameters.word.related_pictures', _selectedItemData) || []
    const phrases = selectn('contextParameters.word.related_phrases', _selectedItemData) || []
    const pronunciation = selectn('properties.fv-word:pronunciation', _selectedItemData)
    const relatedAssets = selectn('contextParameters.word.related_assets', _selectedItemData) || []
    const relatedToAssets = selectn('contextParameters.word.related_by', _selectedItemData) || []
    const videos = selectn('contextParameters.word.related_videos', _selectedItemData) || []
    setSelectedItemData({
      culturalNotes,
      definitions,
      title,
      literalTranslations,
      acknowledgement,
      audio,
      categories,
      partOfSpeech,
      photos,
      phrases,
      pronunciation,
      relatedAssets,
      relatedToAssets,
      videos,
    })
  }, [computeDocument])

  const onClose = () => {
    navigate(`${window.location.pathname}`)
  }
  const onOpen = (id) => {
    navigate(`${window.location.pathname}?active=${id ? id : URL_QUERY_PLACEHOLDER}`)
  }
  const columns = [
    { title: '[Icon]', field: 'itemType' },
    { title: 'Title', field: 'title' },
    { title: 'Requested By', field: 'initiator' },
    { title: 'Task Due Date', field: 'date' },
  ]
  return children({
    columns,
    fetchMessage,
    idSelectedItem: idSelectedItem.current,
    idSelectedTask: active !== URL_QUERY_PLACEHOLDER ? active : undefined,
    isFetching,
    listItems: tasks,
    onClose,
    onOpen,
    selectedItemData,
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailTasksData.propTypes = {
  children: func,
}

export default DashboardDetailTasksData
