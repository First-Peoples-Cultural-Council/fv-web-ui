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

import '!style-loader!css-loader!./dictionaryListSmallScreen.css'

export const dictionaryListSmallScreenTemplate = {
  category: 1,
  contributor: 2,
  link: 3,
  phrase: 4,
  phrasebook: 5,
  word: 6,
}

// const intl = IntlService.instance
const DictionaryListSmallScreen = (props) => {
  const { items, columns } = props

  const getContent = () => {
    const itemRows = items.map((item, inc) => {
      let actions = null
      const batch = null
      let audio = null
      let bio = null
      let categories = null
      let definitions = null
      let partOfSpeech = null
      let image = null
      let state = null
      let title = null
      let phraseBooks = null

      const _item = item

      columns.forEach((column) => {
        const cellValue = selectn(column.name, item)
        const cellRender = typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
        switch (column.name) {
          case 'actions':
            actions = cellRender
            break
          // case 'batch':
          //   batch = cellRender
          //   break
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
            audio = <div className="dictionaryListSmallScreen__audioGroup">{cellRender}</div>
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
      const { word, phrase, phrasebook, category, contributor /*, link*/ } = dictionaryListSmallScreenTemplate
      switch (props.dictionaryListSmallScreenTemplate) {
        // Word template
        case word:
          markup = (
            <>
              {title}
              <div className="dictionaryListSmallScreen__group">
                {definitions}
                {audio}

                {image}

                <div className="dictionaryListSmallScreen__miscGroup">
                  <Typography variant="body1" component="div">
                    {partOfSpeech}
                    {categories}
                    {state}
                  </Typography>
                </div>
              </div>
            </>
          )
          break
        // Phrase template
        case phrase:
          markup = (
            <>
              {title}
              <div className="dictionaryListSmallScreen__group">
                {definitions}
                {audio}

                {image}

                <div className="dictionaryListSmallScreen__miscGroup">
                  <Typography variant="body1" component="div">
                    {phraseBooks}
                    {state}
                  </Typography>
                </div>
              </div>
            </>
          )
          break
        // Category template
        case category:
          markup = batch ? (
            <div className="dictionaryListSmallScreen__groupContainer">
              <div className="dictionaryListSmallScreen__batch">{batch}</div>
              <div>
                {title}
                <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                  {bio}
                  {actions}
                </div>
              </div>
            </div>
          ) : (
            <>
              {title}
              <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          break
        // Contributor template
        case contributor:
          markup = batch ? (
            <div className="dictionaryListSmallScreen__groupContainer">
              <div className="dictionaryListSmallScreen__batch">{batch}</div>
              <div>
                {title}
                <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                  {bio}
                  {actions}
                </div>
              </div>
            </div>
          ) : (
            <>
              {title}
              <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          break
        // Phrasebook template
        case phrasebook:
          markup = batch ? (
            <div className="dictionaryListSmallScreen__groupContainer">
              <div className="dictionaryListSmallScreen__batch">{batch}</div>
              <div>
                {title}
                <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                  {bio}
                  {actions}
                </div>
              </div>
            </div>
          ) : (
            <>
              {title}
              <div className="dictionaryListSmallScreen__group dictionaryListSmallScreen__group--contributor">
                {bio}
                {actions}
              </div>
            </>
          )
          break

        default:
        // NOTE: do nothing
      }
      return markup ? (
        <li
          key={`content-${inc}`}
          className={`dictionaryListSmallScreen__listItem ${
            inc % 2 !== 0 ? 'dictionaryListSmallScreen__listItem--alt' : ''
          }`}
          onClick={() => {
            props.rowClickHandler(_item)
          }}
        >
          {markup}
        </li>
      ) : null
    })
    return itemRows.length > 0 ? <ul className="dictionaryListSmallScreen__list">{itemRows}</ul> : null
  }
  const getSortByHeader = () => {
    const headerCells = []
    columns.forEach((column, i) => {
      // Header
      if (column.sortBy) {
        headerCells.push(<span key={`getSortByHeader-${i}`}>{selectn('titleSmall', column)}</span>)
      }
    })
    return (
      <div className="dictionaryListSmallScreen__sortContainer">
        <strong className="dictionaryListSmallScreen__sortHeading">Sort by:</strong>
        {headerCells}
      </div>
    )
  }

  return (
    <div className="dictionaryListSmallScreen">
      {props.hasSorting && getSortByHeader()}
      {getContent()}
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
