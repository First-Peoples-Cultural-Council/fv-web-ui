import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import useDialect from 'DataSource/useDialect'
import useRoute from 'DataSource/useRoute'

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
  const { fetchDialect, fetchDialect2, computeDialect2 } = useDialect()
  const { routeParams } = useRoute()
  const [dialect, setDialect] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Dialect
    // await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect, computeDialect)
    // await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)

    await fetchDialect(`/${routeParams.dialect_path}`)
    await fetchDialect2(routeParams.dialect_path)

    // const _computeDialect = await ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    // const _dialect = await selectn('response', _computeDialect)

    const _computeDialect2 = await ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const _dialect2 = await selectn('response', _computeDialect2)

    setDialect(_dialect2)
  }

  return children({
    publicDialect: false,
    dialect,
  })
}
// PROPTYPES
const { func } = PropTypes
VisibilitySelectData.propTypes = {
  children: func,
}

export default VisibilitySelectData
