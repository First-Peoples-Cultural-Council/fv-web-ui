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
 * @param {array} props.listItems
 * @param {function} props.onClick
 * @param {integer} props.selectedId
 * @param {node} props.childrenHeader
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListPresentation({ listItems, childrenHeader, onClick, selectedId }) {
  return (
    <div className="DashboardDetailList">
      {childrenHeader && <div className="DashboardDetailList__HeaderContainer">{childrenHeader}</div>}
      <div className="DashboardDetailList__ListContainer">
        <ul className="DashboardDetailList__List">
          {listItems.map(({ id, itemType, isNew, title, initiator, date }, index) => {
            return (
              <DashboardDetailListItem.Presentation
                variant={index % 2}
                isActive={selectedId === id}
                key={`DashboardDetailList__ListItem--${index}`}
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
