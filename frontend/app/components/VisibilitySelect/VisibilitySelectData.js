import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import useDialect from 'dataSources/useDialect'
import useRoute from 'dataSources/useRoute'

import ProviderHelpers from 'common/ProviderHelpers'

/**
 * @summary VisibilitySelectData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilitySelectData({ children }) {
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { routeParams } = useRoute()

  const [publicDialect, setPublicDialect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Compute dialect to get dialect state
  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const fetchDocumentAction = selectn('action', extractComputeDialect)
  const dialectState = selectn('response.state', extractComputeDialect)

  useEffect(() => {
    setIsLoading(true)
    if (dialectState === 'Published') {
      setPublicDialect(true)
    }
    ProviderHelpers.fetchIfMissing({ key: routeParams.dialect_path, action: fetchDialect2, reducer: computeDialect2 })
  }, [])

  // Set dialect state if/when fetch finishes
  useEffect(() => {
    if (fetchDocumentAction === 'FV_DIALECT2_FETCH_SUCCESS') {
      if (dialectState === 'Published') {
        setPublicDialect(true)
      }
      setIsLoading(false)
    }
  }, [fetchDocumentAction])

  return children({
    isLoading,
    publicDialect,
  })
}
// PROPTYPES
const { func } = PropTypes
VisibilitySelectData.propTypes = {
  children: func,
}

export default VisibilitySelectData
