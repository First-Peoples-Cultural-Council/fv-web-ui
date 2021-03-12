import useGetSite from 'common/useGetSite'
import { useParams } from 'react-router-dom'
/**
 * @summary WordData
 * @component
 *
 * @param {object} props
 *
 */
function WordData() {
  const site = useGetSite()
  const { wordId } = useParams()

  return {
    hasSiteData: site?.title !== undefined,
    wordId,
  }
}

export default WordData
