import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import phraseDataAdaptor from 'components/Phrase/phraseDataAdaptor'
import api from 'services/api'
import { triggerError } from 'common/navigationHelpers'

/**
 * @summary PhraseData
 * @component
 *
 * @param {object} props
 *
 */
function PhraseData({ docId }) {
  const { phraseId, sitename } = useParams()
  const history = useHistory()

  const id = docId ? docId : phraseId

  // Data fetch
  const response = useQuery(['phrase', id], () => api.document.get({ id: id, contextParameters: 'phrase' }), {
    // The query will not execute until the phraseId has been provided
    enabled: !!id,
  })
  const { data, error, isError, isLoading } = response
  const entry = phraseDataAdaptor(data)

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    phraseId,
    isLoading: isLoading || isError,
    entry: data?.title ? entry : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
  }
}

export default PhraseData
