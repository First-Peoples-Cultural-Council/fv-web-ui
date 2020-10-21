import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./DashboardDetailNotes.css'

/**
 * @summary DashboardDetailNotesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.comments array of comments: [{author, text, creationDate}]
 *
 * @returns {node} jsx markup
 */

// import { EVEN, ODD } from 'common/Constants'

function DashboardDetailNotesPresentation({ comments }) {
  return (
    <div className="DashboardDetailNotes">
      <Typography variant="h5" component="h3" className="DashboardDetailNotes__heading">
        Notes:
      </Typography>
      <ul className="DashboardDetailNotes__list">
        {comments.map(({ text }, index) => {
          return (
            <li key={`DashboardDetailNotes__li--${index}`} className="DashboardDetailNotes__listItem">
              <Typography variant="body1" component="h3">
                {text ? text : '···'}
              </Typography>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
// PROPTYPES
const { array } = PropTypes
DashboardDetailNotesPresentation.propTypes = {
  comments: array,
}

export default DashboardDetailNotesPresentation
