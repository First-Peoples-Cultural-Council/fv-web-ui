import { useRef } from 'react'
import PropTypes from 'prop-types'
import { getFormData } from 'common/FormHelpers'
import { SEARCH_TYPE_DEFAULT_SEARCH } from 'common/Constants'

import useIntl from 'dataSources/useIntl'
import useNavigationHelpers from 'common/useNavigationHelpers'

import { getDialectClassname } from 'common/Helpers'

/**
 * @summary SearchDialectData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchDialectData({ children, incrementResetCount }) {
  const { intl } = useIntl()
  const formRefSearch = useRef(null)
  const { navigate, convertObjToUrlQuery, getSearchAsObject } = useNavigationHelpers()
  const { searchStyle, searchTerm } = getSearchAsObject({
    page: 1,
    pageSize: 10,
    searchStyle: SEARCH_TYPE_DEFAULT_SEARCH,
  })
  const dialectClassName = getDialectClassname()

  // Search handler
  // ------------------------------------------------------------
  const onSearch = () => {
    const formData = getFormData({
      formReference: formRefSearch,
    })

    navigate(
      `${window.location.pathname}?${convertObjToUrlQuery(
        Object.assign({}, getSearchAsObject(), { page: 1 }, formData)
      )}`
    )
  }

  // Handles search by enter key
  // ------------------------------------------------------------
  const onPressEnter = (evt) => {
    if (evt.key === 'Enter') {
      onSearch()
    }
  }

  // Resets search
  // ------------------------------------------------------------
  const onReset = () => {
    navigate(`${window.location.pathname}?page=1&pageSize=10`)
    incrementResetCount()
  }
  return children({
    dialectClassName,
    formRefSearch,
    intl,
    onPressEnter,
    onReset,
    onSearch,
    searchStyle,
    searchTerm,
  })
}
// PROPTYPES
const { func } = PropTypes
SearchDialectData.propTypes = {
  children: func,
  incrementResetCount: func,
}
SearchDialectData.defaultProps = {
  incrementResetCount: () => {},
}

export default SearchDialectData
