import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'

export default class Link extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    let linkedTitle
    const link = this.props.data
    let description
    const showDescription = this.props.showDescription

    // Title if the link document contains an attached file
    if (link.path) {
      linkedTitle = <a href={NavigationHelpers.getBaseURL() + link.path}>{link.title}</a>
    }
    // Title if the link document has no attached file and points to an external link
    else {
      linkedTitle = <a href={link.url}>{link.title}</a>
    }

    if (showDescription == true) {
      description = <p>{link.description}</p>
    }

    return (
      <div key={link.uid}>
        {linkedTitle}
        {description}
      </div>
    )
  }
}
