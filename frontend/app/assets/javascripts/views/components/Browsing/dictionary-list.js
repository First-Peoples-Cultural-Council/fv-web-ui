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
import { PropTypes } from 'react'
import { List, Map } from 'immutable'
// import classNames from 'classnames'
import selectn from 'selectn'

import IntlService from 'views/services/intl'

const { array, func, instanceOf, number, object, oneOfType, string } = PropTypes

export default class DictionaryList extends Component {
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
    theme: string,
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

  intl = IntlService.instance

  constructor(props, context) {
    super(props, context)

    this._columnClassNames = this._getColumnClassNames()
  }
  // componentDidMount() {
  //   this._columnClassNames = this._getColumnClassNames()
  // }

  render() {
    const items = this.props.filteredItems || this.props.items
    const columns = this.props.columns
    if (this._columnClassNames.length === 0) {
      this._columnClassNames = this._getColumnClassNames()
    }

    if (selectn('length', items) === 0) {
      return (
        <div className={`DictionaryList DictionaryList--noData  ${this.props.cssModifier}`}>
          {this.intl.translate({
            key: 'no_results_found',
            default: 'No Results Found',
            case: 'first',
            append: '.',
          })}
        </div>
      )
    }

    const columnHeaders = this._getColumnHeaders()
    const columnFooter = this._getColumnFooter()
    const trFooter = columnFooter ? (
      <tr className="DictionaryList__row DictionaryList__row--footer">{columnFooter}</tr>
    ) : null
    return (
      <table className={`DictionaryList data-table fontAboriginalSans ${this.props.cssModifier}`}>
        <tbody>
          <tr className="DictionaryList__row DictionaryList__row--header">{columnHeaders}</tr>

          {(items || []).map((item, i) => (
            <tr
              key={i}
              data-testid="DictionaryList__row"
              className={`DictionaryList__row ${i % 2 ? 'DictionaryList__row--b' : 'DictionaryList__row--a'}`}
            >
              {(columns || []).map((column, j) => {
                const cellValue = selectn(column.name, item)
                const cellRender =
                  typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
                const className = this._columnClassNames[j] || ''
                return (
                  <td key={j} className={className}>
                    {cellRender}
                  </td>
                )
              })}
            </tr>
          ))}

          {trFooter}
        </tbody>
      </table>
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
