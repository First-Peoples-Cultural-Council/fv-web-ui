import React from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

const { string, object, func } = PropTypes
export class CategoryStateSuccessDelete extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    createUrl: string,
    formData: object,
    handleClick: func,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    className: 'FormCategory',
    copy: {
      edit: {},
    },
  }
  render() {
    const { className, copy, createUrl } = this.props
    const _createUrl = createUrl || '#'
    return (
      <div className={`${className} Category Category--successDelete`}>
        <h1 className="Category__heading">{copy.edit.successDelete.title}</h1>

        {/* CREATE ANOTHER ------------- */}
        <p>
          <a
            href={_createUrl}
            onClick={(e) => {
              e.preventDefault()
              NavigationHelpers.navigate(_createUrl, this.props.pushWindowPath, false)
            }}
          >
            {copy.create.success.linkCreateAnother}
          </a>
        </p>
      </div>
    )
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(null, mapDispatchToProps)(CategoryStateSuccessDelete)
