import React from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'
import Link from 'components/Link'
// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'reducers/windowPath'

const { string, object, func } = PropTypes
export class PhrasebookStateSuccessCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    formData: object,
    itemUid: string,
    handleClick: func,
  }
  static defaultProps = {
    className: 'FormRecorder',
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
    const phrasebookDetailUrl = `/${siteTheme}${dialect_path}/phrasebook/${itemUid}`
    const phrasebookEditUrl = `/${siteTheme}${dialect_path}/edit/phrasebook/${itemUid}`
    const phrasebookBrowseUrl = `/${siteTheme}${dialect_path}/phrasebooks/10/1`
    return (
      <div className={`${className} Phrasebook Phrasebook--successCreate`}>
        <h1 className="Phrasebook__heading">{copy.create.success.title}</h1>

        <p>{copy.create.success.thanks}</p>

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
                    NavigationHelpers.navigate(phrasebookEditUrl, this.props.pushWindowPath, false)
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
                <Link href={phrasebookBrowseUrl}>{copy.create.success.browseView}</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(PhrasebookStateSuccessCreate)
