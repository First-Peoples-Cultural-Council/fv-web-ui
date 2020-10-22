import React from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'reducers/windowPath'

const { string, object, func } = PropTypes
export class PhrasebookStateSuccessDelete extends React.Component {
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
    className: 'FormRecorder',
    copy: {
      edit: {},
    },
  }
  render() {
    const { className, copy, createUrl } = this.props
    const _createUrl = createUrl || '#'
    return (
      <div className={`${className} Phrasebook Phrasebook--successDelete`}>
        <h1 className="Phrasebook__heading">{copy.edit.successDelete.title}</h1>

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

export default connect(null, mapDispatchToProps)(PhrasebookStateSuccessDelete)
