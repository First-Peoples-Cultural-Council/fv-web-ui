import React from 'react'
import { PropTypes } from 'react'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

const { string, object, func } = PropTypes
export class PhrasebookStateSuccessEdit extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    formData: object,
    handleClick: func,

    // REDUX: reducers/state
    routeParams: object.isRequired,
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
    const { className, copy, formData, routeParams, itemUid } = this.props
    const { theme, dialect_path } = routeParams

    const name = formData['dc:title']
    const description = formData['dc:description']
    const phrasebookDetailUrl = `/${theme}${dialect_path}/phrasebook/${itemUid || ''}`
    const phrasebookCreateUrl = `/${theme}${dialect_path}/create/phrasebook`
    const phrasebookEditUrl = `/${theme}${dialect_path}/edit/phrasebook/${itemUid || ''}`
    const phrasebookBrowseUrl = `/${theme}${dialect_path}/phrasebooks/10/1`
    return (
      <div className={`${className} Phrasebook Phrasebook--successEdit`}>
        <h1 className="Phrasebook__heading">{copy.edit.success.title}</h1>

        <p>{copy.edit.success.thanks}</p>

        <div className="Phrasebook__successContent">
          <div className="Phrasebook__successReview">
            <dl className="">
              <dt>
                <a
                  href={phrasebookDetailUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(phrasebookDetailUrl, this.props.pushWindowPath, false)
                  }}
                >
                  {name}
                </a>{' '}
                -{' '}
                <a
                  href={phrasebookEditUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    // NavigationHelpers.navigate(phrasebookEditUrl, this.props.pushWindowPath, false)
                    this.props.handleClick()
                  }}
                >
                  {copy.create.success.editView}
                </a>
              </dt>
              <dd>
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </dd>
            </dl>
          </div>
          <div className="Phrasebook__successMore">
            <ul className="Phrasebook__successLinks">
              {/* CREATE ANOTHER ------------- */}
              <li>
                <a
                  href={phrasebookCreateUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(phrasebookCreateUrl, this.props.pushWindowPath, false)
                  }}
                >
                  {copy.edit.success.linkCreateAnother}
                </a>
              </li>

              {/* BROWSE ------------- */}
              <li>
                <a
                  href={phrasebookBrowseUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(phrasebookBrowseUrl, this.props.pushWindowPath, false)
                  }}
                >
                  {copy.create.success.browseView}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhrasebookStateSuccessEdit)
