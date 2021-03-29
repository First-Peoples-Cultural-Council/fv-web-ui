import useGetSite from 'common/useGetSite'
import { useParams } from 'react-router-dom'
/**
 * @summary PhraseData
 * @component
 *
 * @param {object} props
 *
 */
function PhraseData() {
  const site = useGetSite()
  const { phraseId } = useParams()

  return {
    hasSiteData: site?.title !== undefined,
    phraseId,
  }
}

export default PhraseData
