import PropTypes from 'prop-types'
import useNavigationHelpers from 'common/useNavigationHelpers'
/**
 * @summary FlashcardButtonData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function FlashcardButtonData({ children }) {
  const { getSearchAsObject, convertObjToUrlQuery, navigate } = useNavigationHelpers()
  const { flashcard: queryFlashcard, ...restQueries } = getSearchAsObject()
  const onClickDisable = () => {
    navigate(`${window.location.pathname}?${convertObjToUrlQuery(Object.assign({}, restQueries))}`)
  }
  const onClickEnable = () => {
    navigate(`${window.location.pathname}?${convertObjToUrlQuery(Object.assign({}, restQueries, { flashcard: true }))}`)
  }
  return children({
    queryFlashcard,
    onClickDisable,
    onClickEnable,
  })
}
// PROPTYPES
const { func } = PropTypes
FlashcardButtonData.propTypes = {
  children: func,
}

export default FlashcardButtonData
