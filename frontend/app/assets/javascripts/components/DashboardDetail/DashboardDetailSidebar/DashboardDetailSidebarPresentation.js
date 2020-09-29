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
 *
 * @param {node} props.childrenHeader Child slot for list header
 * @param {node} props.childrenPagination Child slot for pagination
 * @param {array} props.listItems Data to generate list items: [{date, id, initiator, isNew, isProcessed, itemType, titleItem, titleTask}]
 * @param {function} props.onClick li click handler
 * @param {integer} props.selectedId Used to set style on selected item
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSidebarPresentation({ childrenHeader, childrenPagination, listItems, onClick, selectedId }) {
  return (
    <div className="DashboardDetailSidebar">
      {childrenHeader && <div className="DashboardDetailSidebar__headerContainer">{childrenHeader}</div>}
      <div className="DashboardDetailSidebar__listContainer">
        <ul className="DashboardDetailSidebar__list">
          {listItems.map(
            ({ dateMDY, id, initiatorFullName, isNew, isProcessed, itemType, titleItem, titleTask }, index) => {
              const variant = index % 2 ? ODD : EVEN
              return (
                <DashboardDetailSidebarItem.Presentation
                  key={`DashboardDetailSidebar__listItem--${index}`}
                  date={dateMDY}
                  icon={<ItemIcon.Presentation itemType={itemType} isNew={isNew} />}
                  initiator={initiatorFullName}
                  isActive={selectedId === id}
                  isProcessed={isProcessed}
                  onClick={() => {
                    onClick(id)
                  }}
                  titleItem={titleItem}
                  titleTask={titleTask}
                  variant={variant}
                />
              )
            }
          )}
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
