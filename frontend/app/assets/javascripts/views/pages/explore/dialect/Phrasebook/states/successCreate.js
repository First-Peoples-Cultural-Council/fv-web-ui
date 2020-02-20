import React from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'
import Link from 'views/components/Link'
// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

const { string, object, func } = PropTypes

const categoryType = {
  title: { plural: 'Phrase Books', singular: 'Phrase Book' },
  label: { plural: 'phrasebooks', singular: 'phrasebook' },
}

export class CategoryStateSuccessCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    formData: object,
    itemUid: string,
    handleClick: func,
  }
  static defaultProps = {
    className: 'FormCategory',
    formData: {
      'dc:title': '-',
      'dc:description': '-',
    },
    copy: {
      default: {},
    },
  }
  render() {
    const { className, copy, formData, handleClick, routeParams, itemUid } = this.props
    const { siteTheme, dialect_path } = routeParams
    const name = formData['dc:title']
    const description = formData['dc:description']
    // const photo = formData['fvcontributor:profile_picture'] ? formData['fvcontributor:profile_picture'][0] : {}
    const categoryDetailUrl = `/${siteTheme}${dialect_path}/${categoryType.label.singular}/${itemUid}`
    const categoryEditUrl = `/${siteTheme}${dialect_path}/edit/${categoryType.label.singular}/${itemUid}`
    const categoryBrowseUrl = `/${siteTheme}${dialect_path}/${categoryType.label.plural}/10/1`
    return (
      <div className={`${className} Category Category--successCreate`}>
        <h1 className="Category__heading">{copy.create.success.title}</h1>

        <p>{copy.create.success.thanks}</p>

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
                    NavigationHelpers.navigate(categoryEditUrl, this.props.pushWindowPath, false)
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
                  href={window.location.pathname}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick()
                  }}
                >
                  {copy.create.success.linkCreateAnother}
                </a>
              </li>

              {/* BROWSE ------------- */}
              <li>
                <Link href={categoryBrowseUrl}>{copy.create.success.browseView}</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryStateSuccessCreate)
