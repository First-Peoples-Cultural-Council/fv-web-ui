import React from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

const { string, object, func } = PropTypes

const categoryType = {
  title: { plural: 'Categories', singular: 'Category' },
  label: { plural: 'categories', singular: 'category' },
}

export class CategoryStateSuccessEdit extends React.Component {
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
    className: 'FormCategory',
    copy: {
      edit: {},
    },
  }
  render() {
    const { className, copy, formData, routeParams, itemUid } = this.props
    const { siteTheme, dialect_path } = routeParams

    const name = formData['dc:title']
    const description = formData['dc:description']
    const categoryDetailUrl = `/${siteTheme}${dialect_path}/${categoryType.label.singular}/${itemUid || ''}`
    const categoryCreateUrl = `/${siteTheme}${dialect_path}/create/${categoryType.label.singular}`
    const categoryEditUrl = `/${siteTheme}${dialect_path}/edit/${categoryType.label.singular}/${itemUid || ''}`
    const categoryBrowseUrl = `/${siteTheme}${dialect_path}/${categoryType.label.plural}/10/1`
    return (
      <div className={`${className} Category Category--successEdit`}>
        <h1 className="Category__heading">{copy.edit.success.title}</h1>

        <p>{copy.edit.success.thanks}</p>

        <div className="Category__successContent">
          <div className="Category__successReview">
            <dl className="">
              <dt>
                <a
                  href={categoryDetailUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(categoryDetailUrl, this.props.pushWindowPath, false)
                  }}
                >
                  {name}
                </a>{' '}
                -{' '}
                <a
                  href={categoryEditUrl}
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
          <div className="Category__successMore">
            <ul className="Category__successLinks">
              {/* CREATE ANOTHER ------------- */}
              <li>
                <a
                  href={categoryCreateUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(categoryCreateUrl, this.props.pushWindowPath, false)
                  }}
                >
                  {copy.edit.success.linkCreateAnother}
                </a>
              </li>

              {/* BROWSE ------------- */}
              <li>
                <a
                  href={categoryBrowseUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(categoryBrowseUrl, this.props.pushWindowPath, false)
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
export default connect(mapStateToProps, mapDispatchToProps)(CategoryStateSuccessEdit)
