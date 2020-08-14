import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import ActionLaunch from '@material-ui/icons/Launch'

import { StoryCoverStyles } from './StoryCoverStyles'
import FVButton from 'views/components/FVButton'
/**
 * @summary StoryCoverPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryCoverPresentation({ book, openBookAction, pageCount }) {
  const classes = StoryCoverStyles()
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="col-xs-12 col-md-3">
          {/* <MediaThumbnail videos={this.props.videos} photos={this.props.photos} /> */}
        </div>

        <div className="col-xs-12 col-md-9 fontBCSans">
          <header className={classes.header}>
            <Typography variant="h3" component="h2">
              <div>{book.title}</div>
            </Typography>
            <Typography variant="h4" component="h3">
              <div>{book.titleTranslation}</div>
            </Typography>
            <div className="subheader">
              {book.authors.map(function renderAuthors(author, i) {
                return (
                  <span className="label label-default" key={i}>
                    {author}
                  </span>
                )
              })}
            </div>
          </header>

          {/* <div>
            <Introduction
              item={book}
              defaultLanguage={this.props.defaultLanguage}
              style={{ height: '16vh', padding: '5px' }}
            />
            {this.props.audios}
          </div> */}
        </div>
      </div>

      <div className="col-xs-12">
        <div className="col-xs-12 text-right">
          {openBookAction && pageCount > 0 ? (
            <FVButton variant="contained" style={{ marginRight: '10px' }} color="primary" onClick={openBookAction}>
              <ActionLaunch />
              {'Open Book'}
            </FVButton>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
StoryCoverPresentation.propTypes = {
  content: string,
}

export default StoryCoverPresentation
