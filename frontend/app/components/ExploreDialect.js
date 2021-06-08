// eslint-disable-next-line
/* global _paq */
/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import classNames from 'classnames'
import { WORKSPACES, SECTIONS } from 'common/Constants'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2, republishDialect, updateDialect2 } from 'reducers/fvDialect'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { routeHasChanged } from 'common/NavigationHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import Header from 'components/Header'
import { getDialectClassname } from 'common/Helpers'
import PageToolbar from 'components/PageToolbar'
import GridView from 'components/LearnBase/grid-view'
import Kids from 'components/Kids'
import FVLabel from 'components/FVLabel'
import Preview from 'components/Preview'

/**
 * Dialect portal page showing all the various components of this dialect.
 */

const { array, func, object, string } = PropTypes
export class ExploreDialect extends Component {
  static propTypes = {
    intl: object,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    computePublish: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    republishDialect: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateDialect2: func.isRequired,
    updatePortal: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(
      `${newProps.routeParams.dialect_path}/Portal`,
      this.props.intl.trans(
        'views.pages.explore.dialect.fetching_community_portal',
        'Fetching community portal.',
        'first'
      ),
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.problem_fetching_portal',
        'Problem fetching community portal it may be unpublished or offline.',
        'first'
      )
    )
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.fetchData(this.props)
    }
  }

  _onNavigateRequest = (path, e) => {
    this.props.pushWindowPath(path)
    e.preventDefault()
  }

  _onSwitchAreaRequest = (e, index, value) => {
    this._onNavigateRequest(this.props.windowPath.replace(value === SECTIONS ? WORKSPACES : SECTIONS, value))
  }

  _publishChangesAction = () => {
    this.props.republishDialect(
      this.props.routeParams.dialect_path,
      { value: 'Republish' },
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.portal_published_successfully',
        'Portal published successfully!',
        'first',
        [],
        null,
        '!'
      )
    )
  }

  _handleSelectionChange = (itemId, item) => {
    NavigationHelpers.navigate(
      NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, selectn('properties', item), 'words'),
      this.props.pushWindowPath,
      true
    )
  }

  _dataAdaptor = ({ dialect, portal }) => {
    const dialectProperties = selectn('response.properties', dialect)
    const portalProperties = selectn('response.properties', portal)
    const dialectContextParams = selectn('response.contextParameters.dialect', dialect)
    const portalContextParams = selectn('response.contextParameters.portal', portal)

    const baseProperties = {
      greeting: dialectProperties?.['fvdialect:greeting'] || portalProperties?.['fv-portal:greeting'] || null,
      audio:
        dialectContextParams?.['fvdialect:featured_audio'] || portalContextParams?.['fv-portal:featured_audio'] || null,
      aboutUs: dialectProperties?.['fvdialect:about_us'] || portalProperties?.['fv-portal:about'] || null,
      news: dialectProperties?.['fvdialect:news'] || portalProperties?.['fv-portal:news'] || null,
      background:
        dialectContextParams?.['fvdialect:background_top_image']?.path ||
        portalContextParams?.['fv-portal:background_top_image']?.path ||
        null,
      logo: dialectContextParams?.['fvdialect:logo'] || portalContextParams?.['fv-portal:logo'] || null,
      featuredWords:
        dialectContextParams?.['fvdialect:featured_words']?.length > 0
          ? dialectContextParams?.['fvdialect:featured_words']
          : portalContextParams?.['fv-portal:featured_words'] || [],
      relatedLinks:
        dialectContextParams?.['fvdialect:related_links']?.length > 0
          ? dialectContextParams?.['fvdialect:related_links']
          : portalContextParams?.['fv-portal:related_links'] || [],
      country: dialectProperties?.['fvdialect:country'] || null,
      region: dialectProperties?.['fvdialect:region'] || null,
    }

    return baseProperties
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
    ])

    let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    let computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    const isSection = this.props.routeParams.area === SECTIONS
    const isKidsTheme = this.props.routeParams.siteTheme === 'kids'

    // Render kids view
    if (isKidsTheme && computePortal) {
      return (
        <PromiseWrapper computeEntities={computeEntities}>
          <Kids {...this.props} portal={computePortal} />
        </PromiseWrapper>
      )
    }

    /**
     * Suppress Editing for Language Recorders with Approval
     */
    const roles = selectn('response.contextParameters.dialect.roles', computeDialect2)

    if (roles && roles.indexOf('Manage') === -1) {
      computeDialect2 = Object.assign(computeDialect2, {
        response: Object.assign(computeDialect2.response, {
          contextParameters: Object.assign(computeDialect2.response.contextParameters, { permissions: ['Read'] }),
        }),
      })
    }

    const portalRoles = selectn('response.contextParameters.portal.roles', computePortal)
    const portalPermissions = selectn('response.contextParameters.portal.permissions', computePortal)

    // if we have roles and no permissions
    if (portalRoles && !portalPermissions) {
      // we have the manage role, but no permissions
      if (portalRoles.indexOf('Manage') >= 0) {
        // update the permissions
        computePortal = Object.assign(computePortal, {
          response: Object.assign(computePortal.response, {
            contextParameters: Object.assign(computePortal.response.contextParameters, {
              permissions: ['Read', 'Write', 'Everything'],
            }),
          }),
        })
      }
    }
    const dialectClassName = getDialectClassname(computeDialect2)

    const data = this._dataAdaptor({ dialect: computeDialect2, portal: computePortal })

    let toolbar = null
    if (this.props.routeParams.area === WORKSPACES) {
      if (selectn('response', computeDialect2)) {
        toolbar = (
          <PageToolbar
            label="Site"
            handleNavigateRequest={this._onNavigateRequest}
            computeEntity={computeDialect2}
            computeLogin={this.props.computeLogin}
            actions={['dialect', 'edit', 'more-options']}
            {...this.props}
          />
        )
      }
    }

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        <div className="row">{toolbar}</div>
        <Header
          dialect={{ compute: computeDialect2, update: this.props.updateDialect2 }}
          portal={{ compute: computePortal, update: this.props.updatePortal }}
          routeParams={this.props.routeParams}
        >
          <div className="dialect-navigation">
            <div className="row">
              <div className="col-xs-12">
                <div float="left">
                  <a
                    href={this.props.windowPath + '/learn'}
                    onClick={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn')}
                  >
                    <FVLabel
                      transKey="views.pages.explore.dialect.learn_our_language"
                      defaultStr="Learn our Language"
                    />
                  </a>
                  <a
                    href={this.props.windowPath + '/play'}
                    onClick={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')}
                  >
                    <FVLabel transKey="views.pages.explore.dialect.play_game" defaultStr="Play a Game" />
                  </a>
                  <a
                    href={this.props.windowPath + '/gallery'}
                    onClick={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery')}
                  >
                    <FVLabel transKey="views.pages.explore.dialect.photo_gallery" defaultStr="Photo Gallery" />
                  </a>
                  <a
                    href={this.props.windowPath + '/kids'}
                    onClick={this._onNavigateRequest.bind(this, this.props.windowPath.replace('explore', 'kids'))}
                  >
                    <FVLabel transKey="views.pages.explore.dialect.kids_portal" defaultStr="Kids Portal" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Header>

        <div className={classNames('row', 'dialect-body-container', dialectClassName)} style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <h1 className={classNames('display', 'dialect-greeting-container', dialectClassName)}>
              <div>{data?.greeting}</div>
              {data?.audio?.path && (
                <audio id="portalFeaturedAudio" src={NavigationHelpers.getBaseURL() + data?.audio?.path} controls />
              )}
            </h1>
            <div className={dialectClassName}>
              <h2>
                <FVLabel transKey="views.pages.explore.dialect.about_us" defaultStr="About us" />
              </h2>
              <hr className="dialect-hr" />
              <div className="fv-portal-about" dangerouslySetInnerHTML={{ __html: data?.aboutUs }} />
            </div>
            <div>
              <h2>
                <FVLabel transKey="general.news" defaultStr="News" />
              </h2>
              <hr className="dialect-hr" />
              <div className="fv-portal-about" dangerouslySetInnerHTML={{ __html: data?.news }} />
            </div>
          </div>

          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>
            <div className="row">
              <div className={classNames('col-xs-12')}>
                {data?.featuredWords?.length > 0 ? (
                  <>
                    <h2>
                      <FVLabel transKey="first_words" defaultStr="First Words" />
                    </h2>
                    <hr className="dialect-hr" />
                    <GridView
                      action={this._handleSelectionChange}
                      cols={3}
                      cellHeight={194}
                      type="FVWord"
                      className="grid-view-first-words"
                      metadata={selectn('response', computeDialect2)}
                      items={data?.featuredWords?.map((word) => {
                        return {
                          contextParameters: {
                            word: {
                              related_pictures: [selectn('fv:related_pictures[0]', word)],
                              related_audio: [selectn('fv:related_audio[0]', word)],
                            },
                          },
                          properties: word,
                        }
                      })}
                    />
                  </>
                ) : null}
                {(data?.relatedLinks?.length > 0 || !isSection) && (
                  <>
                    <h2>
                      <FVLabel transKey="general.related_links" defaultStr="Related Links" />
                    </h2>
                    <hr className="dialect-hr" />
                    {data?.relatedLinks?.map((link, i) => (
                      <Preview key={i} id={link.uid} type={'FVLink'} />
                    ))}
                  </>
                )}
                <h2>
                  <FVLabel transKey="views.pages.explore.dialect.region_data" defaultStr="Region Data" />
                </h2>
                <hr className="dialect-hr" />
                <div className={classNames('dialect-info-banner')}>
                  <div className="dib-body-row">
                    <FVLabel transKey="country" defaultStr="Country" />:{' '}
                    <div dangerouslySetInnerHTML={{ __html: data?.country }} />
                  </div>
                  <div className="dib-body-row">
                    <FVLabel transKey="region" defaultStr="Region" />:{' '}
                    <div dangerouslySetInnerHTML={{ __html: data?.region }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvDialect, fvPortal, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computePublish } = document
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computePortal,
    computePublish,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  republishDialect,
  pushWindowPath,
  replaceWindowPath,
  updateDialect2,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDialect)
