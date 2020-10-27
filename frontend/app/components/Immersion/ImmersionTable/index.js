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

import { Table, TableBody, TableCell, TableRow, TableFooter, TablePagination } from '@material-ui/core'
import { Error } from '@material-ui/icons'
import TablePaginationActions from './tablepagination'
import SortingHeader from './sortingheader'

import Preview from 'components/Preview'
import FVLabel from 'components/FVLabel'
import { windowLocationPathnameWithoutPagination } from 'common/NavigationHelpers'
import { withStyles } from '@material-ui/core/styles'
import '!style-loader!css-loader!./immersiontable.css'

/**
 * List view for words in immersion
 */
const { array, object, string } = PropTypes

function desc(a, b, orderBy) {
  const aObj = a[orderBy]
  const bObj = b[orderBy]
  if (!aObj && !bObj) {
    return 0
  }
  if (!bObj) {
    return -1
  }
  if (!aObj) {
    return 1
  }
  if (bObj.toUpperCase() > aObj.toUpperCase()) {
    return -1
  }
  if (bObj.toUpperCase() < aObj.toUpperCase()) {
    return 1
  }
  return 0
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const styles = () => ({
  icon: {
    color: '#b40000',
  },
  font: {
    fontSize: '1.6rem',
    fontWeight: '700',
  },
  select: {
    paddingRight: '24px',
  },
})

class ImmersionTable extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    mappedTranslations: array.isRequired,
    selectedCategory: string,
    selectedFilter: string,
    classes: object.isRequired,
  }
  static defaultProps = {
    mappedTranslations: [],
  }

  constructor(props, context) {
    super(props, context)

    const { pageNumber, pageSize } = this._getURLPageProps()

    this.state = {
      order: 'desc',
      orderBy: 'translation',
      pageNumber: pageNumber,
      pageSize: pageSize,
    }
  }
  _getURLPageProps() {
    const pageProps = { pageNumber: 1, pageSize: 10 }
    const page = selectn('page', this.props.routeParams)
    const pageSize = selectn('pageSize', this.props.routeParams)

    if (page) {
      pageProps.pageNumber = parseInt(page, 10) - 1
    }
    if (pageSize) {
      pageProps.pageSize = parseInt(pageSize, 10)
    }

    return pageProps
  }

  handleChangePage = (event, pageNumber) => {
    const { pageSize } = this.state
    const newUrl =
      window.location.origin + '/' + windowLocationPathnameWithoutPagination() + '/' + pageSize + '/' + (pageNumber + 1)
    window.history.pushState({}, '', newUrl)
    this.setState({ pageNumber })
  }

  handleChangeRowsPerPage = (event) => {
    const pageSize = event.target.value
    const { pageNumber } = this.state
    const newUrl =
      window.location.origin + '/' + windowLocationPathnameWithoutPagination() + '/' + pageSize + '/' + (pageNumber + 1)
    window.history.pushState({}, '', newUrl)
    this.setState({ pageSize })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  renderTranslation = (label, type = 'base') => {
    if (label.type === 'phrase') return label[type]
    const translation = label[type]
    let count = 0
    const words = translation.split(/(%s)/g).map((word, i) => {
      if (word === '%s') {
        const chip = (
          <span className="template-span" key={i}>
            {label.templateStrings[count]}
          </span>
        )
        count++
        return chip
      }
      return <span key={i}>{word}</span>
    })
    return words
  }

  render() {
    const { mappedTranslations, selectedCategory, selectedFilter, classes } = this.props
    const { order, orderBy, pageNumber, pageSize } = this.state
    const filteredTranslations = mappedTranslations
      .filter((label) => {
        if (!selectedCategory) {
          return true
        }
        return label.categoryId.startsWith(selectedCategory)
      })
      .filter((label) => {
        if (selectedFilter === 'untranslated') {
          return !label.translation
        }
        if (selectedFilter === 'translated') {
          return label.translation !== undefined
        }
        return true
      })
    const emptyRows = pageSize - Math.min(pageSize, (filteredTranslations.length || 1) - pageNumber * pageSize)

    return (
      <div style={{ flexShrink: 0, overflowX: 'scroll' }}>
        <Table className="DictionaryList data-table fontBCSans">
          <SortingHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            columns={[
              {
                id: 'translation',
                label: <FVLabel transKey="translation" defaultStr="Translation" transform="words" />,
              },
              {
                id: 'base',
                label: (
                  <FVLabel
                    transKey="original_associated_word_phrase"
                    defaultStr="Original Associated Word/Phrase"
                    transform="words"
                  />
                ),
              },
              { id: 'audio', label: <FVLabel transKey="audio" defaultStr="Audio" transform="words" />, noSort: true },
              { id: 'category', label: <FVLabel transKey="category" defaultStr="Category" transform="words" /> },
              { id: 'state', label: <FVLabel transKey="state" defaultStr="State" transform="words" /> },
              { id: 'type', label: <FVLabel transKey="type" defaultStr="Type" transform="words" /> },
            ]}
          />
          <TableBody>
            {filteredTranslations.length !== 0 ? (
              <>
                {filteredTranslations
                  .sort(getSorting(order, orderBy))
                  .slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)
                  .map((row) => {
                    return (
                      <TableRow
                        key={row.labelKey}
                        className="DictionaryList__row DictionaryList__row--a"
                        style={{ background: 'white' }}
                      >
                        <TableCell className="DictionaryList__data DictionaryList__data--translation DictionaryList__data--title">
                          <a
                            className="translation-cell DictionaryList__link DictionaryList__link--indigenous"
                            onClick={row.editClick}
                          >
                            {row.translation ? (
                              this.renderTranslation(row, 'translation')
                            ) : (
                              <div>
                                <Error className={classes.icon} />
                                <div className="untranslated">UNTRANSLATED</div> {/* need locale key for this */}
                              </div>
                            )}
                          </a>
                          {row.editButton}
                        </TableCell>
                        <TableCell className="DictionaryList__data DictionaryList__data--base">
                          {this.renderTranslation(row, 'base')}
                        </TableCell>
                        <TableCell className="DictionaryList__data DictionaryList__data--audio">
                          {row.relatedAudio && (
                            <Preview
                              id={row.relatedAudio}
                              minimal
                              tagProps={{ preload: 'none' }}
                              styles={{ padding: 0 }}
                              tagStyles={{ width: '100%', minWidth: '230px' }}
                              type="FVAudio"
                            />
                          )}
                        </TableCell>
                        <TableCell className="DictionaryList__data DictionaryList__data--category">
                          {row.category || 'UNCATEGORIZED'} {/* need locale key for this */}
                        </TableCell>
                        <TableCell className="DictionaryList__data DictionaryList__data--state"> {row.state}</TableCell>
                        <TableCell className="DictionaryList__data DictionaryList__data--type"> {row.type}</TableCell>
                      </TableRow>
                    )
                  })}
              </>
            ) : (
              <TableRow style={{ background: 'white' }}>
                <TableCell colSpan={5} className="DictionaryList__data">
                  <FVLabel transKey="no_results_found" defaultStr="No Results Found" transform="words" />
                </TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                classes={{ caption: classes.font, input: classes.font, select: classes.select }}
                colSpan={6}
                count={filteredTranslations.length}
                rowsPerPage={pageSize}
                page={pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelDisplayedRows={({ from, to, count }) => {
                  return `Results: ${from}-${to} of ${count}` // need locale key for this
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(ImmersionTable)
