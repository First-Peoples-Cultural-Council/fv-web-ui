import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import wordDataAdaptor from 'components/Word/wordDataAdaptor'
import documentApi from 'services/api/document'
import { triggerError } from 'common/navigationHelpers'

/**
 * @summary WordData
 * @component
 *
 * @param {object} props
 *
 */
function WordData({ docId }) {
  const { wordId } = useParams()
  const history = useHistory()
  const { sitename } = useParams()

  const id = docId ? docId : wordId

  // Data fetch
  const response = useQuery(['word', id], () => documentApi.get({ id: id, contextParameters: 'word' }), {
    // The query will not execute until the wordId has been provided
    enabled: !!id,
  })
  const { data, error, isError, isLoading } = response

  const entry = wordDataAdaptor(data)

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    wordId: id,
    isLoading: isLoading || isError,
    entry: data?.title ? entry : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
  }
}

export default WordData
