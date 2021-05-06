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
function WordData() {
  const { wordId } = useParams()
  const history = useHistory()
  const { sitename } = useParams()

  // Data fetch
  const response = useQuery(['word', wordId], () => documentApi.get({ id: wordId, contextParameters: 'word' }), {
    // The query will not execute until the wordId has been provided
    enabled: !!wordId,
  })
  const { data, error, isError, isLoading } = response

  const entry = wordDataAdaptor(data)

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    wordId,
    isLoading,
    entry: data?.title ? entry : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
  }
}

export default WordData
