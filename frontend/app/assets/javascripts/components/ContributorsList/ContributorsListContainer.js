import React from 'react'
// import PropTypes from 'prop-types'
import ContributorsListPresentation from './ContributorsListPresentation'
import ContributorsListData from './ContributorsListData'

/**
 * @summary ContributorsListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContributorsListContainer() {
  return (
    <ContributorsListData>
      {(ContributorsListDataOutput) => {
        // TODO: PLEASE REMOVE
        // eslint-disable-next-line
        console.log('ContributorsListDataOutput', ContributorsListDataOutput)
        return <ContributorsListPresentation />
      }}
    </ContributorsListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ContributorsListContainer.propTypes = {
  //   something: string,
}

export default ContributorsListContainer
