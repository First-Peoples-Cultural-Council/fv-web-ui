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
import ConfGlobal from 'conf/local.js'
import selectn from 'selectn'
import NavigationHelpers from 'common/NavigationHelpers'

export default {
  renderComplexArrayRow(dataItems = [], render) {
    const rows = []

    dataItems.map(function dataItemsMap(entry, i) {
      rows.push(render(entry, i))
    })

    return (
      <ol className={`renderComplexArrayRow ${rows.length === 1 ? 'renderComplexArrayRow--rowSingle' : ''}`}>{rows}</ol>
    )
  },
  generateOrderedListFromDataset({
    dataSet = [],
    extractDatum = () => {},
    classNameList = 'generateOrderedListFromDataset',
    classNameListItem = 'generateOrderedListFromDataset__listItem',
  }) {
    const rows = []

    dataSet.forEach((entry, i) => {
      rows.push(
        <li className={classNameListItem} key={i}>
          {extractDatum(entry, i)}
        </li>
      )
    })

    return <ol className={`${classNameList} ${rows.length === 1 ? `${classNameList}--single` : ''}`}>{rows}</ol>
  },
  generateDelimitedDatumFromDataset({
    dataSet = [],
    extractDatum = () => {},
    classNameContainer = '',
    classNameText = '',
    delimiter = ', ',
  }) {
    const rows = []

    dataSet.forEach((entry, i) => {
      rows.push(
        <span key={`generateDelimitedDatumFromDataset${i}`}>
          {i > 0 ? delimiter : ''}
          <span className={classNameText}>{extractDatum(entry, i)}</span>
        </span>
      )
    })

    return <span className={classNameContainer}>{rows}</span>
  },
  getPreferenceVal(key, preferences) {
    return selectn('preferences.values.' + key + '.' + selectn(key, preferences), ConfGlobal)
  },
  getThumbnail(imgObj, view = 'Thumbnail', returnObj = false) {
    let i = 0

    switch (view) {
      case 'Thumbnail':
        i = 0
        break

      case 'Small':
        i = 1
        break

      case 'Medium':
        i = 2
        break

      case 'OriginalJpeg':
        i = 3
        break
      default: // Note: do nothing
    }

    if (selectn('views[' + i + ']', imgObj)) {
      return returnObj ? selectn('views[' + i + ']', imgObj) : selectn('views[' + i + '].url', imgObj)
    } else if (selectn('properties.picture:views[' + i + ']', imgObj)) {
      return returnObj
        ? selectn('properties.picture:views[' + i + ']', imgObj)
        : selectn('properties.picture:views[' + i + '].content.data', imgObj)
    } else if (selectn('properties.file:content.data', imgObj)) {
      return returnObj
        ? selectn('properties.file:content.data', imgObj)
        : selectn('properties.file:content.data', imgObj)
    } else if (selectn('path', imgObj)) {
      return (
        NavigationHelpers.getBaseURL() +
        selectn('path', imgObj)
          .replace('nxfile', 'nxpicsfile')
          .replace('file:', view + ':')
      )
    } else if (selectn('data', imgObj)) {
      return selectn('data', imgObj)
    }

    return 'assets/images/cover.png'
  },
  playAudio(state, stateFunc, audioUrl, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const audioItem = new Audio(audioUrl)

    if (state.nowPlaying != null) {
      state.nowPlaying.pause()
      state.currentTime = 0
    }

    stateFunc({
      nowPlaying: audioItem,
    })

    audioItem.play()

    audioItem.onended = function audioItemOnended() {
      stateFunc({
        nowPlaying: null,
      })
    }

    return false
  },
  stopAudio(state, stateFunc, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (state.nowPlaying != null) {
      state.nowPlaying.pause()
      state.currentTime = 0

      stateFunc({
        nowPlaying: null,
      })
    }

    return false
  },
  isViewSize(size) {
    switch (size) {
      case 'xs':
        return window.innerWidth <= 420
      default: // Note: do nothing
    }

    return false
  },
}
