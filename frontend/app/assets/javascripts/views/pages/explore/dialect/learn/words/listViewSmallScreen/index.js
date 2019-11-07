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
import Edit from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
const intl = IntlService.instance

import '!style-loader!css-loader!./listViewSmallScreen.css'
/*
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchWords } from 'providers/redux/reducers/fvWord'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import { WORKSPACES } from 'common/Constants'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import DocumentListView from 'views/components/Document/DocumentListView'
import DocumentListViewDatatable from 'views/components/Document/DocumentListViewDatatable'
import FVButton from 'views/components/FVButton'

import Media from 'react-media'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
*/
// const { array, bool, func, number, object, string } = PropTypes
class ListViewSmallScreen extends Component {
  static propTypes = {}
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div className="listViewSmallScreen">
        <div className="listViewSmallScreen__sortContainer">
          <strong className="listViewSmallScreen__sortHeading">Sort by:</strong>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Word
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Definitions
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Audio
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Picture
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Part of speech
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            Categories
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="listViewSmallScreen__sortButton">
            State
          </FVButton>
        </div>
        <ul className="listViewSmallScreen__list">
          <li className="listViewSmallScreen__listItem">
            <Typography variant="title" component="h2">
              American
              <FVButton type="button" variant="flat" size="small">
                <Edit title={intl.trans('edit', 'Edit', 'first')} />
              </FVButton>
            </Typography>

            <div className="listViewSmallScreen__group">
              <div>
                <audio
                  className="listViewSmallScreen__audio"
                  preload="none"
                  controls
                  src="https://dev.firstvoices.com/nuxeo/nxfile/default/7af0fa4d-84b3-40b2-838a-a082812beae2/file:content/punch.mp3"
                />
              </div>
              <div>
                <Typography variant="subheading" component="h3">
                  Definitions
                </Typography>
                <Typography variant="body1" component="div">
                  <ul>
                    <li>Definitions 1</li>
                    <li>Definitions 2</li>
                  </ul>
                </Typography>
              </div>

              <div>
                <img
                  src="https://dev.firstvoices.com/nuxeo/nxfile/default/93b21a87-b68e-44ba-bdf0-b95f9c887927/picture:views/0/content/Thumbnail_Performance Goals.jpg"
                  alt=""
                />
              </div>
              <div>
                <Typography variant="body1" component="div">
                  <ul>
                    <li>
                      <strong>Part of speech:</strong> Verb
                    </li>

                    <li>
                      <strong>Categories:</strong>
                    </li>

                    <li>
                      <strong>State:</strong> Enabled
                    </li>
                  </ul>
                </Typography>
              </div>
            </div>
          </li>
          <li className="listViewSmallScreen__listItem">
            <Typography variant="title" component="h2">
              Congress (with a bunch of words included that makes it a long title)
              <FVButton type="button" variant="flat" size="small">
                <Edit title={intl.trans('edit', 'Edit', 'first')} />
              </FVButton>
            </Typography>
            <div className="listViewSmallScreen__group">
              <div>
                <audio
                  preload="none"
                  controls
                  src="https://dev.firstvoices.com/nuxeo/nxfile/default/7af0fa4d-84b3-40b2-838a-a082812beae2/file:content/punch.mp3"
                  className="listViewSmallScreen__audio"
                />
              </div>
              <div>
                <Typography variant="subheading" component="h3">
                  Definitions
                </Typography>

                <Typography variant="body1" component="div">
                  <ul>
                    <li>Definitions 1</li>
                    <li>Definitions 2</li>
                  </ul>
                </Typography>
              </div>

              <div>
                <img
                  src="https://dev.firstvoices.com/nuxeo/nxfile/default/93b21a87-b68e-44ba-bdf0-b95f9c887927/picture:views/0/content/Thumbnail_Performance Goals.jpg"
                  alt=""
                />
              </div>
              <div>
                <Typography variant="body1" component="div">
                  <ul>
                    <li>
                      <strong>Part of speech:</strong> Verb
                    </li>

                    <li>
                      <strong>Categories:</strong>
                    </li>

                    <li>
                      <strong>State:</strong> Enabled
                    </li>
                  </ul>
                </Typography>
              </div>
            </div>
          </li>
        </ul>
      </div>
    )
  }
}
/*
// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvDialect, fvWord, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeWords } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeWords,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchWords,
  fetchDialect2,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListViewSmallScreen)
*/
export default ListViewSmallScreen
