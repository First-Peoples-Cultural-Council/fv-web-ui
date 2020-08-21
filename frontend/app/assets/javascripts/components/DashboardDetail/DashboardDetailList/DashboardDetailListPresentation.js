import React from 'react'
import PropTypes from 'prop-types'
import DashboardDetailListItem from 'components/DashboardDetail/DashboardDetailListItem'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import '!style-loader!css-loader!./DashboardDetailList.css'
import { EVEN, ODD } from 'common/Constants'
/**
 * @summary DashboardDetailListPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.listItems
 * @param {function} props.onClick
 * @param {integer} props.selectedId
 * @param {node} props.childrenHeader
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListPresentation({ childrenHeader, childrenPagination, listItems, onClick, selectedId }) {
  return (
    <div className="DashboardDetailList">
      {childrenHeader && <div className="DashboardDetailList__headerContainer">{childrenHeader}</div>}
      <div className="DashboardDetailList__listContainer">
        <ul className="DashboardDetailList__list">
          {listItems.map(({ id, itemType, isNew, title, initiator, date }, index) => {
            const variant = index % 2 ? ODD : EVEN
            return (
              <DashboardDetailListItem.Presentation
                variant={variant}
                isActive={selectedId === id}
                key={`DashboardDetailList__listItem--${index}`}
                title={title}
                initiator={initiator}
                date={date}
                icon={<DashboardDetailIcon.Presentation itemType={itemType} isNew={isNew} />}
                onClick={() => {
                  onClick(id)
                }}
              />
            )
          })}
        </ul>
      </div>
      {childrenPagination && <div className="DashboardDetailList__pagination">{childrenPagination}</div>}
    </div>
  )
}
// PROPTYPES
const { func, string, node, array } = PropTypes
DashboardDetailListPresentation.propTypes = {
  childrenHeader: node,
  listItems: array,
  onClick: func,
  selectedId: string,
  childrenPagination: node,
}
DashboardDetailListPresentation.defaultProps = {
  listItems: [
    {
      date: '',
      id: '',
      initiator: '',
      isNew: true,
      itemType: undefined,
      title: '',
    },
  ],
  onClick: () => {},
}

export default DashboardDetailListPresentation
