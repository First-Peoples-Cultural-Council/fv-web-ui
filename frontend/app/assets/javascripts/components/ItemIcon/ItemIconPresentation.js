import React from 'react'
import PropTypes from 'prop-types'
import IconChat from './IconChat'
import IconQuote from './IconQuote'
import IconNew from '@material-ui/icons/Star'
import IconUnknown from '@material-ui/icons/InsertDriveFile'
import {
  // UNKNOWN,
  BOOK,
  WORD,
  PHRASE,
  // SONG,
  // STORY,
} from 'common/Constants'
import '!style-loader!css-loader!./ItemIcon.css'
import IconBook from './IconBook'
// import IconMusic from './IconMusic'

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
  const IconIsNew = isNew ? IconNew : null
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

    default:
      IconItemType = IconUnknown
      break
  }
  return (
    <span className="ItemIcon">
      <IconItemType className="ItemIcon__type" />
      <IconIsNew className="ItemIcon__new" />
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
