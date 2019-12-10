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
  link: 4,
  phrase: 5,
  phrasebook: 6,
  word: 7,
}

// const intl = IntlService.instance
const DictionaryListSmallScreen = (props) => {
  const { items, columns } = props

  const getContent = () => {
    const itemRows = items.map((item, inc) => {
      let actions = null
      let audio = null
      let batch = null
      let bio = null
      let categories = null
      let dateModified = null
      let dateCreated = null
      let definitions = null
      let image = null
      let partOfSpeech = null
      let phraseBooks = null
      let state = null
      let title = null

      const _item = item

      columns.forEach((column) => {
        const cellValue = selectn(column.name, item)
        const cellRender = typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue

        switch (column.name) {
          case 'actions':
            actions = cellRender
            break
          case 'batch':
            batch = cellRender
            break
          case 'dc:modified':
            dateModified = (
              <div>
                <strong>Date modified:</strong> {cellRender}
              </div>
            )
            break
          case 'dc:created':
            dateCreated = (
              <div>
                <strong>Date created:</strong> {cellRender}
              </div>
            )
            break
          case 'dc:description':
            bio = (
              <div>
                <strong>
                  {props.dictionaryListSmallScreenTemplate === dictionaryListSmallScreenTemplate.phrasebook
                    ? 'Description'
                    : 'Biography'}
                  :
                </strong>
                {cellRender}
              </div>
            )
            break
          case 'fv-phrase:phrase_books':
            phraseBooks = (
              <div>
                <strong>Phrase books:</strong>
                {cellRender}
              </div>
            )
            break
          case 'fv-word:categories':
            categories = (
              <div>
                <strong>Categories:</strong>
                {cellRender}
              </div>
            )
            break
          case 'fv-word:part_of_speech':
            partOfSpeech = (
              <div>
                <strong>Part of speech:</strong> {cellRender}
              </div>
            )
            break
          case 'fv:definitions':
            definitions = cellRender
            break
          case 'related_audio':
            audio = <div className="DictionaryListSmallScreen__audioGroup">{cellRender}</div>
            break
          case 'related_pictures':
            image = cellRender
            break
          case 'state':
            state = (
              <div>
                <strong>State:</strong> {cellRender}
              </div>
            )
            break
          case 'title':
            title = (
              <Typography variant="title" component="h2">
                {cellRender}
              </Typography>
            )
            break

          default: // NOTE: do nothing
        }
      })

      let markup = null
      const { book, category, contributor, link, phrase, phrasebook, word } = dictionaryListSmallScreenTemplate
      switch (props.dictionaryListSmallScreenTemplate) {
        // Book template, NOTE: book === song, story
        case book: {
          const wordMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group">
                {dateCreated}
                {dateModified}
                {state}
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{wordMain}</div>
            </div>
          ) : (
            wordMain
          )
          break
        }
        // Category template
        case category: {
          const categoryMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{categoryMain}</div>
            </div>
          ) : (
            categoryMain
          )
          break
        }
        // Contributor template
        case contributor: {
          const contributorMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{contributorMain}</div>
            </div>
          ) : (
            contributorMain
          )
          break
        }
        // TODO
        // Link template
        case link: {
          const categoryMain = <>{title}</>
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{categoryMain}</div>
            </div>
          ) : (
            categoryMain
          )
          break
        }
        // Phrase template
        case phrase: {
          const phraseMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group">
                {definitions}
                {audio}

                {image}

                <div className="DictionaryListSmallScreen__miscGroup">
                  <Typography variant="body1" component="div">
                    {phraseBooks}
                    {state}
                  </Typography>
                </div>
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{phraseMain}</div>
            </div>
          ) : (
            phraseMain
          )
          break
        }
        // Phrasebook template
        case phrasebook: {
          const phrasebookMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group DictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{phrasebookMain}</div>
            </div>
          ) : (
            phrasebookMain
          )
          break
        }
        // Word template
        case word: {
          const wordMain = (
            <>
              {title}
              <div className="DictionaryListSmallScreen__group">
                {definitions}
                {audio}

                {image}

                <div className="DictionaryListSmallScreen__miscGroup">
                  <Typography variant="body1" component="div">
                    {partOfSpeech}
                    {categories}
                    {state}
                  </Typography>
                </div>
              </div>
            </>
          )
          markup = batch ? (
            <div className="DictionaryListSmallScreen__groupContainer">
              <div className="DictionaryListSmallScreen__batch">{batch}</div>
              <div className="DictionaryListSmallScreen__batchSibling">{wordMain}</div>
            </div>
          ) : (
            wordMain
          )
          break
        }

        default:
        // NOTE: do nothing
      }
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
  dictionaryListSmallScreenTemplate: dictionaryListSmallScreenTemplate.word,
}

export default DictionaryListSmallScreen
