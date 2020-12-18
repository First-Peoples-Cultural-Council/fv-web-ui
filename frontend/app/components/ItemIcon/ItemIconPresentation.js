import React from 'react'
import PropTypes from 'prop-types'
import IconChat from './IconChat'
import IconQuote from './IconQuote'
import IconBook from './IconBook'
import IconGenericItem from './IconGenericItem'
import IconNew from './IconStarburst'
import {
  // UNKNOWN,
  BOOK,
  WORD,
  PHRASE,
  UNKNOWN,
  // SONG,
  // STORY,
} from 'common/Constants'

import './ItemIcon.css'

/**
 * @summary ItemIconPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ItemIconPresentation({ itemType, isNew }) {
  let IconItemType = null
  switch (itemType) {
    case WORD:
      IconItemType = IconChat
      break
    case PHRASE:
      IconItemType = IconQuote
      break
    case BOOK:
      IconItemType = IconBook
      break
    // TODO: server returns FVBook for Song & Story
    // case STORY:
    //   IconItemType = IconBook
    //   break
    // case SONG:
    //   IconItemType = IconMusic
    //   break
    case UNKNOWN:
      IconItemType = IconGenericItem
      break

    default:
      /* IconItemType = IconGenericItem */
      break
  }
  return (
    <span className="ItemIcon">
      {IconItemType && <IconItemType className="ItemIcon__type" />}
      {isNew && <IconNew className="ItemIcon__new" />}
    </span>
  )
}
// PROPTYPES
const { number, bool } = PropTypes
ItemIconPresentation.propTypes = {
  itemType: number,
  isNew: bool,
}

export default ItemIconPresentation
