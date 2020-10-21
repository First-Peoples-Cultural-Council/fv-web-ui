import React, { useEffect, useState } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import useRoute from 'dataSources/useRoute'
import StringHelpers from 'common/StringHelpers'

const DictionaryListLargeScreen = (props) => {
  const [columnClassNames, setColumnClassNames] = useState([])
  const { routeParams } = useRoute()
  useEffect(() => {
    setColumnClassNames(
      props.columns.map((currentValue) => {
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
    )
  }, [props.columns])

  const items = props.filteredItems || props.items || []

  // Construct Header & Footer
  const headerCells = []
  const footerCells = []

  props.columns.forEach((column, i) => {
    // Header
    // Note: With a batch column use the column.title data
    headerCells.push(
      <th key={`header${i}`} className={`${columnClassNames[i] || ''} DictionaryList__header`}>
        {props.hasSorting && column.name !== 'batch' ? selectn('titleLarge', column) : selectn('title', column)}
      </th>
    )

    // Footer
    const footerData = selectn('footer', column) || {}
    if (footerData.element) {
      footerCells.push(
        <td
          key={`footer${i}`}
          className={`${columnClassNames[i] || ''} DictionaryList__footer`}
          colSpan={footerData.colSpan || 1}
        >
          {footerData.element}
        </td>
      )
    }
  })

  const trHeader =
    headerCells.length > 0 ? (
      <tr key="headerCells" className="DictionaryList__row DictionaryList__row--header">
        {headerCells}
      </tr>
    ) : null
  const trFooter =
    footerCells.length > 0 ? (
      <tr key="footerCells" className="DictionaryList__row DictionaryList__row--footer">
        {footerCells}
      </tr>
    ) : null

  return (
    <table className={`DictionaryList data-table fontBCSans ${props.cssModifier}`}>
      <tbody>
        {trHeader}

        {items.map((item, i) => {
          return (
            <tr
              key={i}
              data-testid="DictionaryList__row"
              className={`DictionaryList__row ${i % 2 ? 'DictionaryList__row--b' : 'DictionaryList__row--a'}`}
            >
              {props.columns.map((column, j) => {
                let cellValue = selectn(column.name, item)
                if (column.name === 'state') {
                  cellValue = StringHelpers.visibilityText({
                    visibility: cellValue,
                    dialectName: routeParams.dialect_name,
                  })
                }
                const cellRender =
                  typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
                const className = columnClassNames[j] || ''
                return (
                  <td key={j} className={className}>
                    {cellRender}
                  </td>
                )
              })}
            </tr>
          )
        })}

        {trFooter}
      </tbody>
    </table>
  )
}

const { array, bool, func, instanceOf, oneOfType, string } = PropTypes
DictionaryListLargeScreen.propTypes = {
  columns: array,
  cssModifier: string,
  filteredItems: oneOfType([array, instanceOf(List)]),
  items: oneOfType([array, instanceOf(List)]),
  rowClickHandler: func,
  hasSorting: bool,
}

DictionaryListLargeScreen.defaultProps = {
  rowClickHandler: () => {},
  hasSorting: true,
}

export default DictionaryListLargeScreen
