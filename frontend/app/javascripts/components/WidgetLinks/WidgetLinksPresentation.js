import React from 'react'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import Link from 'views/components/Link'
import FVLabel from 'views/components/FVLabel'
import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./WidgetLinks.css'
/**
 * @summary WidgetLinksPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.links array
 *
 * @returns {node} jsx markup
 */

function WidgetLinksPresentation({ links: linkSets }) {
  return (
    <Widget.Presentation title="Admin Links">
      <div className="WidgetLinks">
        {linkSets.map(({ title, links }, linkSetIndex) => {
          return (
            <div key={`linkSet${linkSetIndex}`}>
              <Typography className="WidgetLinks__subtitle" variant="h6" component="h3">
                {title}
              </Typography>
              <ul className="WidgetLinks__list">
                {links.map(({ url, text, transKey, transform }, index) => {
                  return (
                    <li className="WidgetLinks__listItem" key={index}>
                      <Link className="Widget__link" href={url}>
                        {transKey ? <FVLabel transKey={transKey} defaultStr={text} transform={transform} /> : text}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </Widget.Presentation>
  )
}
// PROPTYPES
const { array } = PropTypes
WidgetLinksPresentation.propTypes = {
  links: array,
}

export default WidgetLinksPresentation
