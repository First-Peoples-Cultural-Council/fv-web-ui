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

import Edit from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

import FVButton from 'views/components/FVButton'
import Preview from 'views/components/Editor/Preview'
import UIHelpers from 'common/UIHelpers'
import IntlService from 'views/services/intl'

import '!style-loader!css-loader!./dictionaryListSmallScreen.css'

const intl = IntlService.instance
const DictionaryListSmallScreen = (props) => {
  const { items } = props

  const listItems = (items || []).map((item, i1) => {
    const _item = item
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
          {UIHelpers.renderComplexArrayRow(categoryData, (entry, i) => (
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
        onClick={() => {
          props.rowClickHandler(_item)
        }}
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

  const getSortByHeader = () => {
    const { columns } = props
    const headerCells = []
    columns.forEach((column) => {
      // Header
      if (column.sortBy) {
        headerCells.push(selectn('titleSmall', column))
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
      {getSortByHeader()}

      <ul className="dictionaryListSmallScreen__list">{listItems}</ul>
    </div>
  )
}

const { any, array, bool, func, number, object, string } = PropTypes
DictionaryListSmallScreen.propTypes = {
  cellHeight: number,
  cols: any, // TODO: set appropriate propType
  cssModifier: string,
  dialect: object,
  disablePageSize: bool,
  fetcher: func,
  fetcherParams: object,
  flashcardTitle: string,
  gridListTile: any, // TODO: set appropriate propType,
  items: array,
  metadata: object,
  pagination: bool,
  rowClickHandler: func,
  style: object,
  type: string,
}

DictionaryListSmallScreen.defaultProps = {
  cellHeight: 210,
  cols: 3,
  columns: [],
  cssModifier: '',
  rowClickHandler: () => {},
  style: null,
  wrapperStyle: null,
}

export default DictionaryListSmallScreen
