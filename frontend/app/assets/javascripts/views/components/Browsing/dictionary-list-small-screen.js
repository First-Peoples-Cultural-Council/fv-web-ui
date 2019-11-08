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
import { List, Map } from 'immutable'
// import classNames from 'classnames'
import selectn from 'selectn'
import Edit from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import FVButton from 'views/components/FVButton'
import Preview from 'views/components/Editor/Preview'
import UIHelpers from 'common/UIHelpers'
import IntlService from 'views/services/intl'
import '!style-loader!css-loader!./dictionaryListSmallScreen.css'

const intl = IntlService.instance
const { array, func, instanceOf, number, object, oneOfType, string } = PropTypes

export default class DictionaryListSmallScreen extends Component {
  static propTypes = {
    action: func,
    cellHeight: number,
    cols: number,
    columns: array.isRequired,
    cssModifier: string,
    fields: instanceOf(Map),
    filteredItems: oneOfType([array, instanceOf(List)]),
    items: oneOfType([array, instanceOf(List)]),
    style: object,
    type: string,
    wrapperStyle: object,
  }

  static defaultProps = {
    cssModifier: '',
    columns: [],
    cols: 3,
    cellHeight: 210,
    wrapperStyle: null,
    style: null,
  }

  constructor(props, context) {
    super(props, context)

    this._columnClassNames = this._getColumnClassNames()
  }
  render() {
    const {
      columns,
      cssModifier,
      data,
      dialect,
      disablePageSize,
      flashcardTitle,
      gridCols,
      gridListTile,
      gridListView,
      pagination,
      page,
      pageSize,
      type,
    } = this.props

    const props = {
      cellHeight: 160,
      cols: gridCols,
      cssModifier,
      dialect,
      disablePageSize,
      fetcher: this._gridListFetcher,
      fetcherParams: { currentPageIndex: page, pageSize: pageSize },
      flashcardTitle,
      gridListTile,
      items: selectn('response.entries', data),
      metadata: selectn('response', data),
      pagination,
      style: { overflowY: 'auto', maxHeight: '50vh' },
      type,
    }

    const items = selectn('response.entries', data)

    if (selectn('length', items) === 0) {
      return (
        <div className="dictionaryListSmallScreen">
          {intl.translate({
            key: 'no_results_found',
            default: 'No Results Found',
            case: 'first',
            append: '.',
          })}
        </div>
      )
    }
    const renderItems = (items || []).map((item, i1) => {
      const title = item.title ? (
        <Typography variant="title" component="h2">
          {item.title}
          <FVButton type="button" variant="flat" size="small">
            <Edit title={intl.trans('edit', 'Edit', 'first')} />
          </FVButton>
        </Typography>
      ) : null

      const _definitions = selectn(['properties', 'fv:definitions'], item) || []
      const definitions =
        _definitions.length > 0 ? (
          <div className="dictionaryListSmallScreen__definitionsGroup">
            <Typography variant="subheading" component="h3">
              Definitions
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                {_definitions.map((definitionObj, i2) => {
                  const dfn = selectn('translation', definitionObj)
                  return dfn ? <li key={i2}>{dfn}</li> : null
                })}
              </ul>
            </Typography>
          </div>
        ) : null

      const firstAudio = selectn(['contextParameters', 'word', 'related_audio', '0'], item)
      const audio = firstAudio ? (
        <div className="dictionaryListSmallScreen__audioGroup">
          <Preview
            key={selectn('uid', firstAudio)}
            minimal
            tagProps={{ preload: 'none' }}
            // className="dictionaryListSmallScreen__audio"
            tagStyles={{ width: '250px', maxWidth: '100%' }}
            expandedValue={firstAudio}
            type="FVAudio"
          />
        </div>
      ) : null

      const firstPicture = selectn(['contextParameters', 'word', 'related_pictures', '0'], item)
      const image = (
        <div className="dictionaryListSmallScreen__imageGroup">
          <img
            key={selectn('uid', firstPicture)}
            style={{ maxWidth: '62px', maxHeight: '45px' }}
            src={UIHelpers.getThumbnail(firstPicture, 'Thumbnail')}
            alt=""
          />
        </div>
      )

      const partOfSpeechValue = selectn('contextParameters.word.part_of_speech', item)
      const partOfSpeech = partOfSpeechValue ? (
        <li>
          <strong>Part of speech:</strong> {partOfSpeechValue}
        </li>
      ) : null

      const categoryData = selectn('contextParameters.word.categories', item) || []
      const categories =
        categoryData.length > 0 ? (
          <li>
            <strong>Categories:</strong>
            {UIHelpers.renderComplexArrayRow(selectn('contextParameters.word.categories', data), (entry, i) => (
              <li key={i}>{selectn('dc:title', entry)}</li>
            ))}
          </li>
        ) : null

      const state = item.state ? (
        <li>
          <strong>State:</strong> {item.state}
        </li>
      ) : null

      return (
        <li
          key={i1}
          className={`dictionaryListSmallScreen__listItem ${
            i1 % 2 !== 0 ? 'dictionaryListSmallScreen__listItem--alt' : ''
          }`}
        >
          {title}

          <div className="dictionaryListSmallScreen__group">
            {definitions}
            {audio}

            {image}

            <div className="dictionaryListSmallScreen__miscGroup">
              <Typography variant="body1" component="div">
                <ul>
                  {partOfSpeech}
                  {categories}
                  {state}
                </ul>
              </Typography>
            </div>
          </div>
        </li>
      )
    })
    return (
      <div className="dictionaryListSmallScreen">
        <div className="dictionaryListSmallScreen__sortContainer">
          <strong className="dictionaryListSmallScreen__sortHeading">Sort by:</strong>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Word
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Definitions
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Audio
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Picture
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Part of speech
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            Categories
          </FVButton>
          <FVButton type="button" variant="outlined" size="small" className="dictionaryListSmallScreen__sortButton">
            State
          </FVButton>
        </div>
        <ul className="dictionaryListSmallScreen__list">{renderItems}</ul>
      </div>
    )
  }

  _columnClassNames = []

  _getColumnClassNames = () => {
    const { columns } = this.props
    return columns.map((currentValue) => {
      const name = selectn('name', currentValue)
      const prefix = 'DictionaryList'
      let className = ''
      switch (name) {
        case 'title':
          className = `${prefix}__data ${prefix}__data--title `
          break
        case 'footer':
          className = `${prefix}__data ${prefix}__data--footer `
          break
        case 'fv:definitions':
          className = `${prefix}__data ${prefix}__data--definitions `
          break
        case 'related_audio':
          className = `${prefix}__data ${prefix}__data--audio  PrintHide`
          break
        case 'related_pictures':
          className = `${prefix}__data ${prefix}__data--pictures  PrintHide`
          break
        case 'fv-word:part_of_speech':
          className = `${prefix}__data ${prefix}__data--speech `
          break
        case 'dc:description':
          className = `${prefix}__data ${prefix}__data--description `
          break
        default:
          className = `${prefix}__data ${prefix}__data--${name}`
      }
      return className
    })
  }
  _getColumnHeaders = () => {
    const { columns } = this.props
    return columns.map((column, i) => {
      const text = selectn('title', column)
      const className = this._columnClassNames[i] || ''
      return (
        <th key={i} className={`${className} DictionaryList__header`}>
          {text}
        </th>
      )
    })
  }
  _getColumnFooter = () => {
    const { columns } = this.props
    let willUpdate = false
    const tds = columns.map((column, i) => {
      const footerData = selectn('footer', column) || {}
      if (footerData && !willUpdate) {
        willUpdate = true
      }
      const className = this._columnClassNames[i] || ''
      const cellData = footerData.element ? (
        <td key={i} className={`${className} DictionaryList__footer`} colSpan={footerData.colSpan || 1}>
          {footerData.element}
        </td>
      ) : null
      return cellData
    })
    return willUpdate ? tds : null
  }
}
