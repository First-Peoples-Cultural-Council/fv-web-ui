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
import {
  disableDialect,
  enableDialect,
  fetchDialect2,
  publishDialect,
  publishDialectOnly,
  unpublishDialect,
  updateDialect2,
} from 'providers/redux/reducers/fvDialect'
import { fetchPortal, publishPortal, unpublishPortal, updatePortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import { EditableComponentHelper } from 'views/components/Editor/EditableComponent'
import Header from 'views/pages/explore/dialect/header'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import GridView from 'views/pages/explore/dialect/learn/base/grid-view'
import TextHeader from 'views/components/Document/Typography/text-header'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import { routeHasChanged } from 'common/NavigationHelpers'
import Kids from './kids'
import FVLabel from '../../../components/FVLabel/index'

/**
 * Dialect portal page showing all the various components of this dialect.
 */

const { array, func, object, string } = PropTypes

export class ExploreDialect extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeDialectUnpublish: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    computePublish: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    disableDialect: func.isRequired,
    enableDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    publishDialect: func.isRequired,
    publishDialectOnly: func.isRequired,
    publishPortal: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    unpublishDialect: func.isRequired,
    unpublishPortal: func.isRequired,
    updateDialect2: func.isRequired,
    updatePortal: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)

    // NOTE: this is functionally similar to `ProviderHelpers.fetchIfMissing`
    // fetchIfMissing` doesn't support passing in other params
    // to be used with the `action` function
    const path = newProps.routeParams.dialect_path + '/Portal'
    if (!selectn('success', ProviderHelpers.getEntry(this.props.computePortal, path))) {
      newProps.fetchPortal(
        path,
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
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
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

  /**
   * Publish changes
   */
  _publishChangesAction = () => {
    this.props.publishPortal(
      this.props.routeParams.dialect_path + '/Portal',
      null,
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
    this.props.publishDialectOnly(
      this.props.routeParams.dialect_path,
      { target: this.props.routeParams.language_path.replace(WORKSPACES, SECTIONS) },
      null,
      null
    )
  }

  _handleSelectionChange = (itemId, item) => {
    NavigationHelpers.navigate(
      NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, selectn('properties', item), 'words'),
      this.props.pushWindowPath,
      true
    )
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

    const featuredWords = selectn('response.contextParameters.portal.fv-portal:featured_words', computePortal) || []

    /**
     * Suppress Editing for Language Recorders with Approvers
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
    let toolbar = null
    if (this.props.routeParams.area === WORKSPACES) {
      if (selectn('response', computeDialect2)) {
        toolbar = (
          <PageToolbar
            label={this.props.intl.trans('portal', 'Portal', 'first')}
            handleNavigateRequest={this._onNavigateRequest}
            computeEntity={computeDialect2}
            computeLogin={this.props.computeLogin}
            showPublish={false}
            actions={['dialect', 'edit', 'publish', 'more-options']}
            publishChangesAction={this._publishChangesAction}
            {...this.props}
          />
        )
      }
    }
    let portalTitle = null
    if (
      selectn('isConnected', this.props.computeLogin) ||
      selectn('response.properties.fv-portal:greeting', computePortal) ||
      selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)
    ) {
      const portalTitleAudio = selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal) ? (
        <audio
          id="portalFeaturedAudio"
          src={
            NavigationHelpers.getBaseURL() +
            selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal).path
          }
          controls
        />
      ) : (
        ''
      )
      portalTitle = (
        <h1 className={classNames('display', 'dialect-greeting-container', dialectClassName)}>
          <AuthorizationFilter
            filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
            renderPartial
          >
            <EditableComponentHelper
              dataTestid="EditableComponent__fv-portal-greeting"
              className="fv-portal-greeting"
              isSection={isSection}
              computeEntity={computePortal}
              updateEntity={this.props.updatePortal}
              property="fv-portal:greeting"
              entity={selectn('response', computePortal)}
            />
          </AuthorizationFilter>

          {portalTitleAudio}
        </h1>
      )
    }
    let editableNews = null
    if (!isSection || selectn('response.properties.fv-portal:news', computePortal)) {
      editableNews = (
        <AuthorizationFilter
          filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
          renderPartial
        >
          <div>
            <h3>
              <FVLabel transKey="news" defaultStr="News" transform="first" />
            </h3>
            <EditableComponentHelper
              dataTestid="EditableComponent__fv-portal-news"
              isSection={isSection}
              computeEntity={computePortal}
              updateEntity={this.props.updatePortal}
              property="fv-portal:news"
              entity={selectn('response', computePortal)}
            />
          </div>
        </AuthorizationFilter>
      )
    }
    return (
      <PromiseWrapper computeEntities={computeEntities}>
        <div className="row">{toolbar}</div>
        <Header
          portal={{ compute: computePortal, update: this.props.updatePortal }}
          dialect={{ compute: computeDialect2, update: this.props.updateDialect2 }}
          login={this.props.computeLogin}
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
                    <FVLabel transKey="learn_our_lang" defaultStr="Learn our Language" />
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

        <div className={classNames('row', 'dialect-body-container')} style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <div>{portalTitle}</div>

            <div className={dialectClassName}>
              <TextHeader
                title={this.props.intl.trans('views.pages.explore.dialect.about_us', 'ABOUT US', 'upper')}
                tag="h2"
                properties={this.props.properties}
              />
              <AuthorizationFilter
                filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
                renderPartial
              >
                <EditableComponentHelper
                  dataTestid="EditableComponent__fv-portal-about"
                  className="fv-portal-about"
                  isSection={isSection}
                  computeEntity={computePortal}
                  updateEntity={this.props.updatePortal}
                  property="fv-portal:about"
                  entity={selectn('response', computePortal)}
                />
              </AuthorizationFilter>
            </div>

            <div>{editableNews}</div>
          </div>

          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>
            <div className="row">
              <div className={classNames('col-xs-12')}>
                {featuredWords.length > 0 ? (
                  <TextHeader
                    tag="h2"
                    title={this.props.intl.trans('first_words', 'FIRST WORDS', 'upper')}
                    properties={this.props.properties}
                  />
                ) : (
                  ''
                )}

                <GridView
                  action={this._handleSelectionChange}
                  cols={3}
                  cellHeight={194}
                  type="FVWord"
                  className="grid-view-first-words"
                  metadata={selectn('response', computeDialect2)}
                  items={featuredWords.map((word) => {
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

                <div>
                  {(selectn('response.contextParameters.portal.fv-portal:related_links.length', computePortal) > 0 ||
                    !isSection) && (
                    <AuthorizationFilter
                      filter={{ permission: 'Write', entity: selectn('response', computePortal) }}
                      renderPartial
                    >
                      <div>
                        <TextHeader
                          tag="h2"
                          title={this.props.intl.trans('related_links', 'RELATED LINKS', 'upper')}
                          properties={this.props.properties}
                        />
                        <EditableComponentHelper
                          dataTestid="EditableComponent__fv-portal-related_links"
                          isSection={isSection}
                          computeEntity={computePortal}
                          updateEntity={this.props.updatePortal}
                          context={computeDialect2}
                          showPreview
                          previewType="FVLink"
                          property="fv-portal:related_links"
                          sectionProperty="contextParameters.portal.fv-portal:related_links"
                          entity={selectn('response', computePortal)}
                        />
                      </div>
                    </AuthorizationFilter>
                  )}
                </div>
              </div>

              <div className={classNames('col-xs-12')}>
                <TextHeader
                  tag="h2"
                  title={this.props.intl.trans('views.pages.explore.dialect.about', 'REGION DATA', 'upper')}
                  properties={this.props.properties}
                />

                <div className={classNames('dialect-info-banner')}>
                  <div>
                    <div className="dib-body-row">
                      <strong>
                        <FVLabel transKey="country" defaultStr="Country" />:{' '}
                      </strong>
                      <AuthorizationFilter
                        filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
                        renderPartial
                      >
                        <EditableComponentHelper
                          className="EditableComponent--inline"
                          dataTestid="EditableComponent__fv-dialect-country"
                          isSection={isSection}
                          computeEntity={computeDialect2}
                          updateEntity={this.props.updateDialect2}
                          property="fvdialect:country"
                          entity={selectn('response', computeDialect2)}
                        />
                      </AuthorizationFilter>
                    </div>
                    <div className="dib-body-row">
                      <strong>
                        <FVLabel transKey="region" defaultStr="Region" transform="first" />:{' '}
                      </strong>
                      <AuthorizationFilter
                        filter={{ permission: 'Write', entity: selectn('response', computeDialect2) }}
                        renderPartial
                      >
                        <EditableComponentHelper
                          className="EditableComponent--inline"
                          dataTestid="EditableComponent__fv-dialect-region"
                          isSection={isSection}
                          computeEntity={computeDialect2}
                          updateEntity={this.props.updateDialect2}
                          property="fvdialect:region"
                          entity={selectn('response', computeDialect2)}
                        />
                      </AuthorizationFilter>
                    </div>
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
  const { computeDialect2, computeDialectUnpublish } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeDialectUnpublish,
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
  disableDialect,
  enableDialect,
  fetchDialect2,
  fetchPortal,
  publishDialect,
  publishDialectOnly,
  publishPortal,
  pushWindowPath,
  replaceWindowPath,
  unpublishDialect,
  unpublishPortal,
  updateDialect2,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDialect)
