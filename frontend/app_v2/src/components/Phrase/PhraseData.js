import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import phraseDataAdaptor from 'components/Phrase/phraseDataAdaptor'
import documentApi from 'services/api/document'
import { triggerError } from 'common/navigationHelpers'

/**
 * @summary PhraseData
 * @component
 *
 * @param {object} props
 *
 */
function PhraseData() {
  const { phraseId, sitename } = useParams()
  const history = useHistory()

  // Data fetch
  const response = useQuery(
    ['phrase', phraseId],
    () => documentApi.get({ id: phraseId, contextParameters: 'phrase' }),
    {
      // The query will not execute until the phraseId has been provided
      enabled: !!phraseId,
    }
  )
  const { data, error, isError, isLoading } = response
  const entry = phraseDataAdaptor(data)

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    phraseId,
    isLoading,
    entry: data?.title ? entry : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
  }
}

export default PhraseData
