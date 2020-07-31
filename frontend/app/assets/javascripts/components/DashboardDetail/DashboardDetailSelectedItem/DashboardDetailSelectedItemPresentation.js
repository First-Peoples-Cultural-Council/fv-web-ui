import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import '!style-loader!css-loader!./DashboardDetailSelectedItem.css'

/**
 * @summary DashboardDetailSelectedItemPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.date
 * @param {node} props.icon
 * @param {string} props.initiator
 * @param {string} props.title
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSelectedItemPresentation({
  idTask,
  childrenTaskSummary,
  childrenActivityStream,
  childrenApprovalNotes,
  childrenItemDetail,
}) {
  const scrollContainerRef = useRef(null)
  useEffect(() => {
    scrollContainerRef.current.scrollTop = 0
  }, [idTask])
  return (
    <div className="DashboardDetailSelectedItem">
      <div ref={scrollContainerRef} className="DashboardDetailSelectedItem__ItemOverview">
        {childrenTaskSummary && <div className="DashboardDetailSelectedItem__TaskSummary">{childrenTaskSummary}</div>}
        {childrenActivityStream}

        {childrenApprovalNotes}

        {childrenItemDetail && <div className="DashboardDetailSelectedItem__ItemDetail">{childrenItemDetail}</div>}
      </div>
      <div className="DashboardDetailSelectedItem__TaskActions">
        <div>
          <h2 style={{ margin: 0, padding: 0 }}>TaskActions</h2>
          <p>Lorem ipsum dolor sit amet</p>
          <p>consectetur adipiscing elit, sed do eiusmod tempor</p>
          <p>incididunt ut labore et dolore magna aliqua</p>
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { node, string } = PropTypes
DashboardDetailSelectedItemPresentation.propTypes = {
  idTask: string,
  childrenTaskSummary: node,
  childrenActivityStream: node,
  childrenApprovalNotes: node,
  childrenItemDetail: node,
}

export default DashboardDetailSelectedItemPresentation
