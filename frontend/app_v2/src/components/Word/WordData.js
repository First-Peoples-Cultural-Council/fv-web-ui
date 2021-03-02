import useGetSections from 'common/useGetSections'
import { useParams } from 'react-router-dom'
/**
 * @summary WordData
 * @component
 *
 * @param {object} props
 *
 */
function WordData() {
  const sections = useGetSections()
  const { wordId } = useParams()

  return {
    hasSectionData: sections?.title !== undefined,
    wordId,
  }
}

export default WordData
