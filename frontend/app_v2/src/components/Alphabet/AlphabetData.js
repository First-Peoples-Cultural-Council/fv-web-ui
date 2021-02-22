import api from 'services/api'
import { alphabetDataAdaptor } from 'components/Alphabet/alphabetDataAdaptor'
import useGetSections from 'common/useGetSections'
/**
 * @summary AlphabetData
 * @component
 *
 * @param {object} props
 *
 */
function AlphabetData() {
  const { title } = useGetSections()
  const { isLoading, error, data } = api.postAlphabet(title, alphabetDataAdaptor)
  return {
    isLoading,
    error,
    data,
  }
}

export default AlphabetData
