import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, Select, TextField } from '@material-ui/core'

import Pagination from 'views/components/Navigation/Pagination'
import UIHelpers from 'common/UIHelpers'
import FVLabel from 'views/components/FVLabel/index'
import '!style-loader!css-loader!./Pagination.css'

/**
 * @summary KidsPhrasesByCategoryPresentation
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {array} props.items [{image, urlDetail, audio, summary, description}]
 *
 * @returns {node} jsx markup
 */
function KidsPhrasesByCategoryPresentation({
  items,
}) {
  return (
    <div className="KidsPhrasesByCategory">{items.map((item, index)=>{
      return <div key={`item${index}`}>An item</div>
    })}</div>
  )
}
// PROPTYPES
const { array } = PropTypes
KidsPhrasesByCategoryPresentation.propTypes = {
  items: array,
}
KidsPhrasesByCategoryPresentation.defaultProps = {
}

export default KidsPhrasesByCategoryPresentation
