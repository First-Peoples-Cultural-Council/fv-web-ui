import useGetSections from 'common/useGetSections'
/**
 * @summary WordData
 * @component
 *
 * @param {object} props
 *
 */
function WordData() {
  const sections = useGetSections()
  return {
    hasSectionData: sections?.title !== undefined,
  }
}

export default WordData
