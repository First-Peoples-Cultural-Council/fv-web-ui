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

import React from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  fetchReportDocuments,
  fetchReportSongsAll,
  fetchReportStoriesAll,
  fetchReportPhrasesAll,
  fetchReportWordsAll,
} from 'reducers/reports'
import { pushWindowPath } from 'reducers/windowPath'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import DocumentListView from 'components/DocumentListView'

import CircularProgress from '@material-ui/core/CircularProgress'
import Doughnut from 'react-chartjs/lib/doughnut'

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 10

const { array, func, object, string } = PropTypes
export class PageDialectReports extends React.Component {
  static propTypes = {
    // REDUX: reducers/state
    computeReportDocuments: object.isRequired,
    computeReportPhrasesAll: object.isRequired,
    computeReportSongsAll: object.isRequired,
    computeReportStoriesAll: object.isRequired,
    computeReportWordsAll: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchReportDocuments: func.isRequired,
    fetchReportSongsAll: func.isRequired,
    fetchReportStoriesAll: func.isRequired,
    fetchReportPhrasesAll: func.isRequired,
    fetchReportWordsAll: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      path: this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 1).join('/'),
      queryName: '',
      queryAppend: '',
    }
    // Bind methods to 'this'
    ;[
      '_handleQueryDataRequest',
      '_handleRefetch',
      '_buildColumns',
      '_resetQueryData',
      '_onEntryNavigateRequest',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    // Retrieve the total number of words, phrases, songs and stories
    newProps.fetchReportWordsAll(this.state.path)
    newProps.fetchReportPhrasesAll(this.state.path)
    newProps.fetchReportSongsAll(this.state.path)
    newProps.fetchReportStoriesAll(this.state.path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  _handleQueryDataRequest(queryName, queryAppend, dataGridProps) {
    // TODO: do not mutate `state` directly
    /* eslint-disable */
    this.state.queryName = queryName
    this.state.queryAppend = queryAppend
    /* eslint-enable */
    let page = DEFAULT_PAGE
    let pageSize = DEFAULT_PAGE_SIZE
    if (dataGridProps.page !== undefined) {
      page = dataGridProps.page
    }
    if (dataGridProps.pageSize !== undefined) {
      pageSize = dataGridProps.pageSize
    }

    this._buildColumns()
    this.props.fetchReportDocuments(this.state.path, this.state.queryAppend, page, pageSize)
  }

  _handleRefetch(dataGridProps, page, pageSize) {
    this._buildColumns()
    this.props.fetchReportDocuments(this.state.path, this.state.queryAppend, page, pageSize)
  }

  // Render different columns based on the doctype in the query
  _buildColumns() {
    // TODO: do not mutate `state` directly
    /* eslint-disable */
    if (this.state.queryAppend.indexOf("ecm:primaryType='FVWord'") != -1) {
      this.state.queryDocType = 'words'
      this.state.columns = [
        {
          name: 'title',
          title: 'Word',
          render: function(v, data, cellProps) {
            return v
          },
        },
      ]
    } else if (this.state.queryAppend.indexOf("ecm:primaryType='FVPhrase'") != -1) {
      this.state.queryDocType = 'phrases'
      this.state.columns = [
        {
          name: 'title',
          title: 'Phrase',
          render: function(v, data, cellProps) {
            return v
          },
        },
      ]
    } else if (this.state.queryAppend.indexOf("fvbook:type='song'") != -1) {
      this.state.queryDocType = 'songs'
      this.state.columns = [
        {
          name: 'title',
          title: 'Song',
          render: function(v, data, cellProps) {
            return v
          },
        },
      ]
    } else if (this.state.queryAppend.indexOf("fvbook:type='story'") != -1) {
      this.state.queryDocType = 'stories'
      this.state.columns = [
        {
          name: 'title',
          title: 'Story',
          render: function(v, data, cellProps) {
            return v
          },
        },
      ]
    }
    /* eslint-enable */
  }

  _resetQueryData() {
    this.setState({ queryDocType: '', queryName: '', queryAppend: '' })
  }

  _onEntryNavigateRequest(item) {
    let addPath = ''
    const splitPath = item.path.split('/')

    switch (item.type) {
      case 'FVWord':
        addPath = '/learn/words/'
        break

      case 'FVPhrase':
        addPath = '/learn/phrases/'
        break

      case 'FVBook':
        addPath = '/learn/songs-stories/'
        break
      default: // NOTE: do nothing
    }

    this.props.pushWindowPath('/explore/' + this.state.path + addPath + splitPath[splitPath.length - 1])
  }

  _generateDocTypeDoughnutData(wordsCount, phrasesCount, songsCount, storiesCount) {
    const doughnutData = []
    doughnutData.push({ value: wordsCount, color: '#949FB1', highlight: '#A8B3C5', label: 'Words' })
    doughnutData.push({ value: phrasesCount, color: '#FDB45C', highlight: '#FFC870', label: 'Phrases' })
    doughnutData.push({ value: songsCount, color: '#46BFBD', highlight: '#5AD3D1', label: 'Songs' })
    doughnutData.push({ value: storiesCount, color: '#F7464A', highlight: '#FF5A5E', label: 'Stories' })
    return doughnutData
  }

  _generateTwoSliceDoughnutData(total, subset, labels) {
    const doughnutData = []
    //let total = this.state.totalCounts[this.state.queryDocType];
    const totalMinusSubset = total - subset
    doughnutData.push({ value: subset, color: '#46BFBD', highlight: '#5AD3D1', label: labels[1] })
    doughnutData.push({ value: totalMinusSubset, color: '#F7464A', highlight: '#FF5A5E', label: labels[0] })
    return doughnutData
  }

  render() {
    const {
      computeReportDocuments,
      computeReportWordsAll,
      computeReportPhrasesAll,
      computeReportSongsAll,
      computeReportStoriesAll,
    } = this.props

    if (
      computeReportWordsAll.isFetching ||
      computeReportPhrasesAll.isFetching ||
      computeReportSongsAll.isFetching ||
      computeReportStoriesAll.isFetching
    ) {
      return <CircularProgress mode="indeterminate" />
    }

    if (
      !computeReportWordsAll.success ||
      !computeReportPhrasesAll.success ||
      !computeReportSongsAll.success ||
      !computeReportStoriesAll.success
    ) {
      return <CircularProgress mode="indeterminate" />
    }

    const wordsCount = computeReportWordsAll.response.resultsCount
    const phrasesCount = computeReportPhrasesAll.response.resultsCount
    const songsCount = computeReportSongsAll.response.resultsCount
    const storiesCount = computeReportStoriesAll.response.resultsCount

    // If a report has been selected, display the query results
    if (this.state.queryName !== '') {
      if (computeReportDocuments.isFetching || !computeReportDocuments.success) {
        return <CircularProgress mode="indeterminate" />
      }
      let docTypeCount
      if (this.state.queryDocType === 'words') {
        docTypeCount = wordsCount
      } else if (this.state.queryDocType === 'phrases') {
        docTypeCount = phrasesCount
      } else if (this.state.queryDocType === 'songs') {
        docTypeCount = songsCount
      } else if (this.state.queryDocType === 'stories') {
        docTypeCount = storiesCount
      }
      const doughnutData = this._generateTwoSliceDoughnutData(
        docTypeCount,
        computeReportDocuments.response.resultsCount,
        ['Other ' + this.state.queryDocType, this.state.queryName]
      )

      return (
        <div className="row">
          <div className="col-xs-12">
            <h1>Reports - {this.state.queryName}</h1>
            <a onClick={this._resetQueryData}>Reset query data</a>

            <div className="col-xs-12">
              <div className="col-xs-2 col-xs-offset-4">
                <Doughnut data={doughnutData} />
              </div>
              <div className="col-xs-2">
                {doughnutData.map((slice) => (
                  <div key={slice.label}>
                    <span className={'glyphicon glyphicon-stop'} style={{ color: slice.color }} /> {slice.label}:{' '}
                    {slice.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-xs-12">
              <DocumentListView
                // onSelectionChange={this._onEntryNavigateRequest}
                className="browseDataGrid"
                columns={this.state.columns}
                data={this.props.computeReportDocuments}
                refetcher={this._handleRefetch}
              />
            </div>
          </div>
        </div>
      )
    }

    // If no report selected, display the reports index view
    const docTypeDoughnutData = this._generateDocTypeDoughnutData(wordsCount, phrasesCount, songsCount, storiesCount)

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h1>Reports</h1>

            <div className="col-xs-12">
              <div className="col-xs-2 col-xs-offset-4">
                <Doughnut data={docTypeDoughnutData} />
              </div>
              <div className="col-xs-2">
                {docTypeDoughnutData.map((slice) => (
                  <div key={slice.label}>
                    <span className={'glyphicon glyphicon-stop'} style={{ color: slice.color }} /> {slice.label}:{' '}
                    {slice.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-xs-3">
              <h2>Words: {wordsCount}</h2>
              <List>
                <ListItem
                  primaryText="List of words in new status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words in new status',
                    " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New'"
                  )}
                />
                <ListItem
                  primaryText="List of words in enabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words in enabled status',
                    " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled'"
                  )}
                />
                <ListItem
                  primaryText="List of words in published status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words in published status',
                    " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published'"
                  )}
                />
                <ListItem
                  primaryText="List of words in disabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words in disabled status',
                    " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled'"
                  )}
                />

                <ListItem
                  primaryText="List of words without audio"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without audio',
                    " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of words without images"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without images',
                    " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of words without video"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without video',
                    " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of words without source"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without source',
                    " AND ecm:primaryType='FVWord' AND fv:source/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of words without categories"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without categories',
                    " AND ecm:primaryType='FVWord' AND fv-word:categories/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of words without part of speech"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without part of speech',
                    " AND ecm:primaryType='FVWord' AND fv-word:part_of_speech=''"
                  )}
                />
                <ListItem
                  primaryText="List of words without pronunciation"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without pronunciation',
                    " AND ecm:primaryType='FVWord' AND fv-word:pronunciation=''"
                  )}
                />
                <ListItem
                  primaryText="List of words without related phrases"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Words without related phrases',
                    " AND ecm:primaryType='FVWord' AND fv-word:related_phrases/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of words in children's archive"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    "Words in children's archive",
                    " AND ecm:primaryType='FVWord' AND fv:available_in_childrens_archive=1"
                  )}
                />
              </List>
            </div>
            <div className="col-xs-3">
              <h2>Phrases: {phrasesCount}</h2>
              <List>
                <ListItem
                  primaryText="List of phrases in new status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases in new status',
                    " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='New'"
                  )}
                />
                <ListItem
                  primaryText="List of phrases in enabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases in enabled status',
                    " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Enabled'"
                  )}
                />
                <ListItem
                  primaryText="List of phrases in published status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases in published status',
                    " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Published'"
                  )}
                />
                <ListItem
                  primaryText="List of phrases in disabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases in disabled status',
                    " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Disabled'"
                  )}
                />

                <ListItem
                  primaryText="List of phrases without audio"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases without audio',
                    " AND ecm:primaryType='FVPhrase' AND fv:related_audio/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of phrases without images"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases without images',
                    " AND ecm:primaryType='FVPhrase' AND fv:related_pictures/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of phrases without video"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases without video',
                    " AND ecm:primaryType='FVPhrase' AND fv:related_videos/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of phrases without source"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases without source',
                    " AND ecm:primaryType='FVPhrase' AND fv:source/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of phrases without phrase books"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Phrases without phrase books',
                    " AND ecm:primaryType='FVPhrase' AND fv-phrase:phrase_books/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of phrases in children's archive"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    "Phrases in children's archive",
                    " AND ecm:primaryType='FVPhrase' AND fv:available_in_childrens_archive=1"
                  )}
                />
              </List>
            </div>
            <div className="col-xs-3">
              <h2>Songs: {songsCount}</h2>
              <List>
                <ListItem
                  primaryText="List of songs in new status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs in new status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='New'"
                  )}
                />
                <ListItem
                  primaryText="List of songs in enabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs in enabled status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Enabled'"
                  )}
                />
                <ListItem
                  primaryText="List of songs in published status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs in pubilshed status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Published'"
                  )}
                />
                <ListItem
                  primaryText="List of songs in disabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs in disabled status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Disabled'"
                  )}
                />

                <ListItem
                  primaryText="List of songs without audio"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs without audio',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_audio/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of songs without images"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs without images',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_pictures/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of songs without video"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs without video',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_videos/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of songs without source"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Songs without source',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:source/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of songs in children's archive"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    "Songs in children's archive",
                    " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:available_in_childrens_archive=1"
                  )}
                />
              </List>
            </div>
            <div className="col-xs-3">
              <h2>Stories: {storiesCount}</h2>
              <List>
                <ListItem
                  primaryText="List of stories in new status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories in new status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='New'"
                  )}
                />
                <ListItem
                  primaryText="List of stories in enabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories in enabled status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Enabled'"
                  )}
                />
                <ListItem
                  primaryText="List of stories in published status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories in published status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Published'"
                  )}
                />
                <ListItem
                  primaryText="List of stories in disabled status"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories in disabled status',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Disabled'"
                  )}
                />

                <ListItem
                  primaryText="List of stories without audio"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories without audio',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_audio/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of stories without images"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories without images',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_pictures/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of stories without video"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories without video',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_videos/* IS NULL"
                  )}
                />
                <ListItem
                  primaryText="List of stories without source"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    'Stories without source',
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:source/* IS NULL"
                  )}
                />

                <ListItem
                  primaryText="List of stories in children's archive"
                  onClick={this._handleQueryDataRequest.bind(
                    this,
                    "Stories in children's archive",
                    " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:available_in_childrens_archive=1"
                  )}
                />
              </List>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { reports, windowPath } = state

  const {
    computeReportDocuments,
    computeReportPhrasesAll,
    computeReportSongsAll,
    computeReportStoriesAll,
    computeReportWordsAll,
  } = reports
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeReportDocuments,
    computeReportPhrasesAll,
    computeReportSongsAll,
    computeReportStoriesAll,
    computeReportWordsAll,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchReportDocuments,
  fetchReportSongsAll,
  fetchReportStoriesAll,
  fetchReportPhrasesAll,
  fetchReportWordsAll,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectReports)
