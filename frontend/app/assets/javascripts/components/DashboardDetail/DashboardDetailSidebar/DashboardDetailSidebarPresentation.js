import React from 'react'
import PropTypes from 'prop-types'
import DashboardDetailSidebarItem from 'components/DashboardDetail/DashboardDetailSidebarItem'
import ItemIcon from 'components/ItemIcon'
import '!style-loader!css-loader!./DashboardDetailSidebar.css'
import { EVEN, ODD } from 'common/Constants'
/**
 * @summary DashboardDetailSidebarPresentation
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
function DashboardDetailSidebarPresentation({ childrenHeader, childrenPagination, listItems, onClick, selectedId }) {
  return (
    <div className="DashboardDetailSidebar">
      {childrenHeader && <div className="DashboardDetailSidebar__headerContainer">{childrenHeader}</div>}
      <div className="DashboardDetailSidebar__listContainer">
        <ul className="DashboardDetailSidebar__list">
          {listItems.map(({ id, itemType, isNew, titleItem, titleTask, initiator, date }, index) => {
            const variant = index % 2 ? ODD : EVEN
            return (
              <DashboardDetailSidebarItem.Presentation
                key={`DashboardDetailSidebar__listItem--${index}`}
                date={date}
                icon={<ItemIcon.Presentation itemType={itemType} isNew={isNew} />}
                initiator={initiator}
                isActive={selectedId === id}
                onClick={() => {
                  onClick(id)
                }}
                titleItem={titleItem}
                titleTask={titleTask}
                variant={variant}
              />
            )
          })}
        </ul>
      </div>
      {childrenPagination && <div className="DashboardDetailSidebar__pagination">{childrenPagination}</div>}
    </div>
  )
}
// PROPTYPES
const { func, string, node, array } = PropTypes
DashboardDetailSidebarPresentation.propTypes = {
  childrenHeader: node,
  listItems: array,
  onClick: func,
  selectedId: string,
  childrenPagination: node,
}
DashboardDetailSidebarPresentation.defaultProps = {
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

export default DashboardDetailSidebarPresentation
