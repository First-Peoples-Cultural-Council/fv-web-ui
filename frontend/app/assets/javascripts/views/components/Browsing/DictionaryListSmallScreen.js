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
import selectn from 'selectn'

import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./DictionaryListSmallScreen.css'

export const dictionaryListSmallScreenColumnDataTemplate = {
  cellRender: 0,
  cellRenderTypography: 1,
  columnTitleCellRender: 2,
  custom: 3,
}

export const dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren = ({
  cellRender,
  column,
  className = '',
}) => {
  const children = selectn('props.children', cellRender) || []
  const toReturn =
    cellRender && cellRender !== '' && cellRender !== null && children.length > 0 ? (
      <div className={className}>
        <strong>{column.title ? `${column.title}:` : ''}</strong> {cellRender}
      </div>
    ) : null
  return toReturn
}

export const dictionaryListSmallScreenColumnDataTemplateCustomAudio = ({ cellRender, className = '' }) => {
  return cellRender ? <div className={`DictionaryListSmallScreen__audioGroup ${className}`}>{cellRender}</div> : null
}

const DictionaryListSmallScreen = (props) => {
  const { items, columns } = props

  const getContent = () => {
    const itemRows = items.map((item, inc) => {
      const templateData = {}

      const firstName = 'firstName'
      const lastName = 'lastName'
      const firstLastName = 'firstLastName'

      const _item = item
      const classNameDataItem = 'DictionaryListSmallScreen__dataItem'
      let _firstName
      let _lastName
      columns.forEach((column) => {
        const cellValue = selectn(column.name, item)
        const cellRender = typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
        const colName = column.name

        if (colName === firstName) {
          _firstName = cellRender
        }
        if (colName === lastName) {
          _lastName = cellRender
        }
        // Extracting data
        // ------------------------------------------------
        switch (column.columnDataTemplate) {
          case dictionaryListSmallScreenColumnDataTemplate.cellRender:
            templateData[colName] = <span className={classNameDataItem}>{cellRender}</span>
            break
          case dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography:
            templateData[colName] = (
              <Typography
                variant={`${column.typographyVariant ? column.typographyVariant : 'title'}`}
                component="h2"
                className={classNameDataItem}
              >
                {cellRender}
              </Typography>
            )
            break
          case dictionaryListSmallScreenColumnDataTemplate.custom:
            {
              let tmplData
              // Use passed in custom template function
              if (column.columnDataTemplateCustom) {
                tmplData = column.columnDataTemplateCustom({
                  cellRender,
                  column,
                  className: classNameDataItem,
                })
              } else {
                // Fallback to `columnTitleCellRender` template if `columnDataTemplateCustom` is missing
                tmplData =
                  cellRender && cellRender !== '' && cellRender !== null ? (
                    <div className={classNameDataItem}>
                      <strong>{column.title ? `${column.title}:` : ''}</strong> {cellRender}
                    </div>
                  ) : null
              }
              if (tmplData) {
                templateData[colName] = tmplData
              }
            }
            break
          case dictionaryListSmallScreenColumnDataTemplate.columnTitleCellRender: // NOTE: intentional fallthrough
          default:
            // Note: insert data if exists and not an empty string
            templateData[colName] =
              cellRender && cellRender !== '' && cellRender !== null ? (
                <div className={classNameDataItem}>
                  <strong>{column.title ? `${column.title}:` : ''}</strong> {cellRender}
                </div>
              ) : null
            break
          /*
          case thumbnail:
            templateData[colName] = cellRender
            break
          */
        }
      })

      templateData[firstLastName] =
        _firstName || _lastName ? (
          <div className={classNameDataItem}>
            <strong>Name:</strong> {`${_firstName || ''} ${_lastName || ''}`}
          </div>
        ) : null

      // Inserting data from above into templates
      // ------------------------------------------------
      let markup = null

      // Use a provided template, or built-in
      const dataMain = props.dictionaryListSmallScreenTemplate ? (
        props.dictionaryListSmallScreenTemplate({ templateData, item: _item })
      ) : (
        <>
          {templateData.type}
          {templateData.title}
          <div className="DictionaryListSmallScreen__group">
            {templateData.related_audio}
            {templateData['dc:description']}
            {templateData['fv:definitions']}
            {templateData['fv-word:part_of_speech']}

            {templateData.related_pictures}
            {templateData['thumb:thumbnail']}

            {templateData['fv-word:categories']}
            {templateData.parent}
            {templateData['fv-phrase:phrase_books']}

            {templateData.username}
            {templateData[firstLastName]}
            {templateData.email}

            {templateData['fvlink:url']}

            {templateData['dc:modified']}
            {templateData['dc:created']}
            {templateData.state}
            {templateData.actions}
          </div>
        </>
      )

      markup = templateData.batch ? (
        <div className="DictionaryListSmallScreen__groupContainer">
          <div className="DictionaryListSmallScreen__batch">{templateData.batch}</div>
          <div className="DictionaryListSmallScreen__batchSibling">{dataMain}</div>
        </div>
      ) : (
        dataMain
      )

      return markup ? (
        <li
          key={`content-${inc}`}
          className={`DictionaryListSmallScreen__listItem ${
            inc % 2 !== 0 ? 'DictionaryListSmallScreen__listItem--alt' : ''
          }`}
        >
          {markup}
        </li>
      ) : null
    })
    return itemRows.length > 0 ? <ul className="DictionaryListSmallScreen__list">{itemRows}</ul> : null
  }
  const getSortBy = () => {
    const headerCells = []
    columns.forEach((column, i) => {
      // Header
      if (column.sortBy) {
        headerCells.push(<span key={`getSortBy-${i}`}>{selectn('titleSmall', column)}</span>)
      }
    })
    return headerCells.length > 0 ? (
      <div className="DictionaryListSmallScreen__actions">
        <strong className="DictionaryListSmallScreen__sortHeading">Sort by:</strong>
        {headerCells}
      </div>
    ) : null
  }
  const getBatch = () => {
    let selectDeselectButton = null
    let batchConfirmationElement = null
    columns.forEach((column) => {
      if (column.name === 'batch') {
        // Select/Deselect
        selectDeselectButton = selectn('title', column)

        // Action
        const footerData = selectn('footer', column) || {}
        if (footerData.element) {
          batchConfirmationElement = footerData.element
        }
      }
    })

    return selectDeselectButton && batchConfirmationElement ? (
      <div className="DictionaryListSmallScreen__actions DictionaryListSmallScreen__actions--batch">
        <Typography className="DictionaryListSmallScreen__batchHeading" variant="subheading" component="h2">
          Batch Delete
        </Typography>
        <div className="DictionaryListSmallScreen__batchButtons">
          <div>{selectDeselectButton}</div>
          {batchConfirmationElement}
        </div>
      </div>
    ) : null
  }

  return (
    <div className="dictionaryListSmallScreen">
      {props.hasSorting && getSortBy()}
      {getContent()}
      {getBatch()}
    </div>
  )
}

const { array, bool, func, string } = PropTypes
DictionaryListSmallScreen.propTypes = {
  columns: array,
  hasSorting: bool,
  items: array,
  type: string,
  dictionaryListSmallScreenTemplate: func,
}

DictionaryListSmallScreen.defaultProps = {
  columns: [],
  hasSorting: true,
  items: [],
}

export default DictionaryListSmallScreen
