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
import React, { Component, PropTypes } from "react"
import { List, Map } from "immutable"
// import classNames from 'classnames'
import selectn from "selectn"

import IntlService from "views/services/intl"

export default class DictionaryList extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    fields: PropTypes.instanceOf(Map),
    columns: PropTypes.array.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
    action: PropTypes.func,
    cols: PropTypes.number,
    cellHeight: PropTypes.number,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    columns: [],
    cols: 3,
    cellHeight: 210,
    wrapperStyle: null,
    style: null,
  }

  intl = IntlService.instance

  constructor(props, context) {
    super(props, context)
    ;["_getColumnClassNames", "_getColumnHeaders"].forEach((method) => (this[method] = this[method].bind(this)))
  }
  componentWillMount() {
    this._columnClassNames = this._getColumnClassNames()
  }

  render() {
    const items = this.props.filteredItems || this.props.items
    const columns = this.props.columns

    if (selectn("length", items) === 0) {
      return (
        <div style={{ margin: "20px 0" }}>
          {this.intl.translate({
            key: "no_results_found",
            default: "No Results Found",
            case: "first",
            append: ".",
          })}
        </div>
      )
    }

    const columnHeaders = this._getColumnHeaders()
    return (
      <table className="DictionaryList data-table fontAboriginalSans">
        <tbody>
          <tr>{columnHeaders}</tr>

          {(items || []).map((item, i) => (
            <tr
              key={i}
              className="DictionaryListRow"
              style={{
                borderBottom: "1px dotted #a8a8a8",
                margin: "10px",
                background: i % 2 ? "#f2f7ff" : "#ffffff",
              }}
            >
              {(columns || []).map((column, j) => {
                const cellValue = selectn(column.name, item)
                const cellRender =
                  typeof column.render === "function" ? column.render(cellValue, item, column) : cellValue
                const className = this._columnClassNames[j] || ""
                return (
                  <td key={j} className={className} align="left">
                    {cellRender}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  _columnClassNames = []

  _getColumnClassNames() {
    const { columns } = this.props
    return columns.map((currentValue) => {
      const name = selectn("name", currentValue)
      // title
      // fv:definitions
      // related_audio
      // related_pictures
      // fv-word:part_of_speech
      const prefix = "DictionaryList"
      let className = ""
      switch (name) {
        case "title":
          className = `${prefix}Title ${prefix}Data`
          break
        case "fv:definitions":
          className = `${prefix}Definitions ${prefix}Data`
          break
        case "related_audio":
          className = `${prefix}Audio ${prefix}Data PrintHide`
          break
        case "related_pictures":
          className = `${prefix}Pictures ${prefix}Data PrintHide`
          break
        case "fv-word:part_of_speech":
          className = `${prefix}Speech ${prefix}Data`
          break
        default:
          className = `${prefix}Data`
      }
      return className
    })
  }
  _getColumnHeaders() {
    const { columns } = this.props
    return columns.map((column, i) => {
      const text = selectn("title", column)
      const className = this._columnClassNames[i] || ""
      return (
        <th key={i} align="left" className={className}>
          {text}
        </th>
      )
    })
  }
}
