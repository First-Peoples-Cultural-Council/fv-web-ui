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

// import Edit from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

// import FVButton from 'views/components/FVButton'
// import Preview from 'views/components/Editor/Preview'
// import UIHelpers from 'common/UIHelpers'
// import IntlService from 'views/services/intl'

import '!style-loader!css-loader!./DictionaryListSmallScreen.css'

export const dictionaryListSmallScreenTemplate = {
  book: 1,
  category: 2,
  contributor: 3,
  custom: 4,
  link: 5,
  phrase: 6,
  phrasebook: 7,
  user: 8,
  word: 9,
}
export const dictionaryListSmallScreenColumnDataTemplate = {
  passthrough: 0,
  heading: 1,
  withName: 2,
  custom: 3,
}

// const intl = IntlService.instance
const DictionaryListSmallScreen = (props) => {
  const { items, columns } = props

  const getContent = () => {
    const itemRows = items.map((item, inc) => {
      const templateData = {}

      const actions = 'actions'
      const audio = 'related_audio'
      const batch = 'batch'
      const categories = 'fv-word:categories'
      const dateCreated = 'dc:created'
      const dateModified = 'dc:modified'
      const definitions = 'fv:definitions'
      const description = 'dc:description'
      const email = 'email'
      const firstLastName = 'firstLastName'
      const firstName = 'firstName'
      const image = 'related_pictures'
      const lastName = 'lastName'
      const linkUrl = 'fvlink:url'
      const parentCategory = 'parent'
      const partOfSpeech = 'fv-word:part_of_speech'
      const phraseBooks = 'fv-phrase:phrase_books'
      const state = 'state'
      const thumbnail = 'thumb:thumbnail'
      const title = 'title'
      const type = 'type'
      const username = 'username'

      const _item = item

      columns.forEach((column) => {
        const cellValue = selectn(column.name, item)
        const cellRender = typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
        const colName = column.name

        // console.log({
        //   columnName: column.name,
        //   columnTitle: column.title,
        //   cellRender,
        //   cellValue,
        //   column,
        // })

        // Extracting data
        // ------------------------------------------------
        // TEMPLATES: passthrough, heading, withName, custom
        switch (colName) {
          case actions:
            templateData[colName] = cellRender
            break
          case audio:
            templateData[colName] = cellRender ? (
              <div className="DictionaryListSmallScreen__audioGroup">{cellRender}</div>
            ) : null
            break
          case batch:
            templateData[colName] = cellRender
            break
          case definitions: {
            const definitionChildren = selectn('props.children', cellRender) || []
            templateData[colName] =
              cellRender && cellRender !== '' && cellRender !== null && definitionChildren.length > 0 ? (
                <div>
                  <strong>{column.title ? `${column.title}:` : ''}</strong> {cellRender}
                </div>
              ) : null
            break
          }
          case description:
            templateData[colName] = cellRender ? (
              <div>
                <strong>{column.title || 'Description'}:</strong>
                {cellRender}
              </div>
            ) : null
            break
          case firstName:
            templateData[colName] = cellRender
            break
          case image:
            templateData[colName] = cellRender
            break
          case lastName:
            templateData[colName] = cellRender
            break
          case thumbnail:
            templateData[colName] = cellRender
            break
          case title:
            templateData[colName] = (
              <Typography variant="title" component="h2">
                {cellRender}
              </Typography>
            )
            break
          case type:
            templateData[colName] = cellRender
            break
          case username:
            templateData[colName] = (
              <Typography variant="title" component="h2">
                {cellRender}
              </Typography>
            )
            break
          case categories: // NOTE: Intentional fallthrough
          case dateCreated: // NOTE: ibid
          case dateModified: // NOTE: ibid
          case email: // NOTE: ibid
          case linkUrl: // NOTE: ibid
          case parentCategory: // NOTE: ibid
          case partOfSpeech: // NOTE: ibid
          case phraseBooks: // NOTE: ibid
          case state: // NOTE: ibid
          default: {
            // Note: insert data if exists and not an empty string
            templateData[colName] =
              cellRender && cellRender !== '' && cellRender !== null ? (
                <div>
                  <strong>{column.title ? `${column.title}:` : ''}</strong> {cellRender}
                </div>
              ) : null
          }
        }
      })

      templateData[firstLastName] =
        templateData[firstName] || templateData[lastName] ? (
          <div>
            <strong>Name:</strong> {`${templateData[firstName] || ''} ${templateData[lastName] || ''}`}
          </div>
        ) : null

      // Inserting data from above into templates
      // ------------------------------------------------
      /*
      NOTE: The `default` case displays all available data but if it doesn't meet your needs:
      - Add an entry to the `dictionaryListSmallScreenTemplate` object above, eg:
          export const dictionaryListSmallScreenTemplate = {
            // other templates
            brandNewTemplate: 9999, // NOTE: ensure unique number!
          }
      - Add the `dictionaryListSmallScreenTemplate` prop to the components that need to use it, eg:
          import { dictionaryListSmallScreenTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
          // code, code, code
          <SpecialDictionaryListView
            // other props
            dictionaryListSmallScreenTemplate={dictionaryListSmallScreenTemplate.brandNewTemplate}
            />
      - Create the `brandNewTemplate` template in the switch statement below, eg:
          const { brandNewTemplate } = dictionaryListSmallScreenTemplate
          switch (props.dictionaryListSmallScreenTemplate) {
            // ...
            case brandNewTemplate: {
              markup = (
                <div>
                  (╯°□°）╯︵ ┻━┻
                </div>
              )
              break
            }
          // ...
      */
      let markup = null
      const {
        // book,
        category,
        // contributor,
        // custom,
        link,
        // phrase,
        phrasebook,
        // user,
        word,
      } = dictionaryListSmallScreenTemplate
      let dataMain = null
      // TEMPLATES: default, custom
      switch (props.dictionaryListSmallScreenTemplate) {
        // Category template
        case category: {
          dataMain = (
            <>
              {/* !!! Category TEMPLATE !!! */}
              {templateData[title]}
              <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
                {templateData[description]}
                {templateData[actions]}
              </div>
            </>
          )
          break
        }
        // Contributor template
        // case contributor: {
        //   dataMain = (
        //     <>
        //       {templateData[title]}
        //       <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
        //         {templateData[description]}
        //         {templateData[state]}
        //         {templateData[actions]}
        //       </div>
        //     </>
        //   )
        //   break
        // }
        // TODO
        // Link template
        case link: {
          dataMain = (
            <>
              {/* !!! Link TEMPLATE !!! */}
              {templateData[title]}
            </>
          )
          break
        }
        // Phrasebook template
        case phrasebook: {
          dataMain = (
            <>
              {/* !!! Phrasebook TEMPLATE !!! */}
              {templateData[title]}
              <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
                {templateData[description]}
                {templateData[actions]}
              </div>
            </>
          )
          break
        }
        // Word template
        case word: {
          dataMain = (
            <>
              {/* !!! WORD TEMPLATE !!! */}
              {templateData[title]}
              <div className="DictionaryListSmallScreen__group">
                {templateData[definitions]}
                {templateData[audio]}

                {templateData[image]}

                <div className="DictionaryListSmallScreen__miscGroup">
                  <Typography variant="body1" component="div">
                    {templateData[partOfSpeech]}
                    {templateData[categories]}
                    {templateData[state]}
                  </Typography>
                </div>
              </div>
            </>
          )
          break
        }
        // case custom: {
        //   dataMain = props.dictionaryListSmallScreenTemplate(templateData)
        //   break
        // }
        // NOTE: No template available, display all available data.
        // Templates using default:
        // - User
        // - Book (aka Song or Story)
        // - Contributor
        default: {
          dataMain = (
            <>
              {/* !!! default TEMPLATE !!! */}
              {templateData[type]}
              {templateData[title]}
              <div className="DictionaryListSmallScreen__group">
                {templateData[audio]}
                {templateData[description]}
                {templateData[definitions]}
                {templateData[partOfSpeech]}

                {templateData[image]}
                {templateData[thumbnail]}

                {templateData[categories]}
                {templateData[parentCategory]}
                {templateData[phraseBooks]}

                {templateData[username]}
                {templateData[firstLastName]}
                {templateData[email]}

                {templateData[linkUrl]}

                {templateData[dateModified]}
                {templateData[dateCreated]}
                {templateData[state]}
                {templateData[actions]}
              </div>
            </>
          )
          break
        }
      }

      markup = templateData[batch] ? (
        <div className="DictionaryListSmallScreen__groupContainer">
          <div className="DictionaryListSmallScreen__batch">{templateData[batch]}</div>
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
          onClick={() => {
            props.rowClickHandler(_item)
          }}
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

const { array, bool, func, number, string } = PropTypes
DictionaryListSmallScreen.propTypes = {
  columns: array,
  hasSorting: bool,
  items: array,
  rowClickHandler: func,
  type: string,
  dictionaryListSmallScreenTemplate: number,
}

DictionaryListSmallScreen.defaultProps = {
  columns: [],
  hasSorting: true,
  items: [],
  rowClickHandler: () => {},
}

export default DictionaryListSmallScreen
