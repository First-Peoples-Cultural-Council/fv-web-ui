import React from 'react'
import PropTypes from 'prop-types'
import DashboardDetailListItem from 'components/DashboardDetail/DashboardDetailListItem'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import '!style-loader!css-loader!./DashboardDetailList.css'

/**
 * @summary DashboardDetailListPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.childrenHeader
 * @param {array} props.listItems
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListPresentation({ listItems, childrenHeader }) {
  return (
    <div className="DashboardDetailList">
      {childrenHeader && <div className="DashboardDetailList__HeaderContainer">{childrenHeader}</div>}
      <div className="DashboardDetailList__ListContainer">
        <ul className="DashboardDetailList__List">
          {listItems.map(({ itemType, isNew, title, requestedBy, date }, index) => {
            return (
              <DashboardDetailListItem.Presentation
                key={`DashboardDetailList__ListItem--${index}`}
                title={title}
                requestedBy={requestedBy}
                date={date}
                icon={<DashboardDetailIcon.Presentation itemType={itemType} isNew={isNew} />}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}
// PROPTYPES
const { node, array } = PropTypes
DashboardDetailListPresentation.propTypes = {
  childrenHeader: node,
  listItems: array,
}
DashboardDetailListPresentation.defaultProps = {
  listItems: [
    {
      title: '',
      requestedBy: '',
      date: '',
    },
  ],
}

export default DashboardDetailListPresentation
