import React from 'react'
import { PropTypes } from 'react'

// REDUX
import { connect } from 'react-redux'

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
    const { theme, dialect_path } = routeParams
    const name = formData['dc:title']
    const description = formData['dc:description']
    // const photo = formData['fvcontributor:profile_picture'] ? formData['fvcontributor:profile_picture'][0] : {}
    const phrasebookDetailUrl = `/${theme}${dialect_path}/phrasebook/${itemUid}`
    const phrasebookEditUrl = `/${theme}${dialect_path}/edit/phrasebook/${itemUid}`
    const phrasebookBrowseUrl = `/${theme}${dialect_path}/phrasebooks/10/1`
    return (
      <div className={`${className} Phrasebook Phrasebook--successCreate`}>
        <h1 className="Phrasebook__heading">{copy.create.success.title}</h1>

        <p>{copy.create.success.thanks}</p>

        <div className="Phrasebook__successContent">
          <div className="Phrasebook__successReview">
            <dl className="">
              <dt>
                <a href={phrasebookDetailUrl}>{name}</a> -{' '}
                <a href={phrasebookEditUrl}>{copy.create.success.editView}</a>
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
                <a href={phrasebookBrowseUrl}>{copy.create.success.browseView}</a>
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

export default connect(
  mapStateToProps,
  null
)(PhrasebookStateSuccessCreate)
