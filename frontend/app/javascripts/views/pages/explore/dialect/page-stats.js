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
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'

import ProviderHelpers from 'common/ProviderHelpers'

import Paper from '@material-ui/core/Paper'

import Typography from '@material-ui/core/Typography'
import Close from '@material-ui/icons/Close'

import FVTab from 'components/FVTab'
import Statistics from 'components/Dashboard/Statistics'
import '!style-loader!css-loader!./PageStats.css'

const { func, object, string } = PropTypes
export class PageStats extends Component {
  static propTypes = {
    handleNavigateRequest: func,
    dialectPath: string.isRequired,
    handleShowStats: func,
    // REDUX: reducers/state
    computeDialectStats: object.isRequired,
    windowPath: string.isRequired,
  }
  static defaultProps = {
    handleShowStats: () => {},
  }
  state = {
    tabValue: 0,
  }
  constructor(props, context) {
    super(props, context)
    ;[].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const computeDialectStats = ProviderHelpers.getEntry(this.props.computeDialectStats, this.props.dialectPath)

    if (!selectn('response', computeDialectStats)) {
      return <div className="PageStats hidden-xs">Loading...</div>
    }

    return (
      <div className="PageStats hidden-xs">
        <button
          type="button"
          className="PageStats__close"
          data-testid="PageStats__close"
          onClick={this.props.handleShowStats}
        >
          <Close className="PageStats__closeIcon" />
          <span className="visually-hidden">Close Page Statistics</span>
        </button>

        <FVTab
          tabItems={[
            { label: 'Words', id: 'statisticsWords' },
            { label: 'Phrases', id: 'statisticsPhrases' },
            { label: 'Songs', id: 'statisticsSongs' },
            { label: 'Stories', id: 'statisticsStories' },
          ]}
          tabsValue={this.state.tabValue}
          tabsOnChange={(e, tabValue) => this.setState({ tabValue })}
        />

        {this.state.tabValue === 0 && (
          <Typography component="div" style={{ padding: 8 * 3 }}>
            <Paper style={{ padding: '15px' }}>
              <Statistics
                data={selectn('response', computeDialectStats)}
                docType="words"
                headerText={this.props.intl.trans('words', 'Words', 'first')}
              />
            </Paper>
          </Typography>
        )}
        {this.state.tabValue === 1 && (
          <Typography component="div" style={{ padding: 8 * 3 }}>
            <Paper style={{ padding: '15px' }}>
              <Statistics
                data={selectn('response', computeDialectStats)}
                docType="phrases"
                headerText={this.props.intl.trans('phrases', 'Phrases', 'first')}
              />
            </Paper>
          </Typography>
        )}
        {this.state.tabValue === 2 && (
          <Typography component="div" style={{ padding: 8 * 3 }}>
            <Paper style={{ padding: '15px' }}>
              <Statistics
                data={selectn('response', computeDialectStats)}
                docType="songs"
                headerText={this.props.intl.trans('songs', 'Songs', 'first')}
              />
            </Paper>
          </Typography>
        )}
        {this.state.tabValue === 3 && (
          <Typography component="div" style={{ padding: 8 * 3 }}>
            <Paper style={{ padding: '15px' }}>
              <Statistics
                data={selectn('response', computeDialectStats)}
                docType="stories"
                headerText={this.props.intl.trans('stories', 'Stories', 'first')}
              />
            </Paper>
          </Typography>
        )}
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, windowPath, locale } = state

  const { computeDialectStats } = fvDialect
  const { _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialectStats,
    windowPath: _windowPath,
    intl: intlService,
  }
}

export default connect(mapStateToProps, null)(PageStats)
