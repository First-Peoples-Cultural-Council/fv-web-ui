import React from 'react'
import PropTypes from 'prop-types'

// TODO: Temp icons until design is finished
import IconPhrase from '@material-ui/icons/ChatOutlined'
import IconWord from '@material-ui/icons/DescriptionOutlined'
import IconStory from '@material-ui/icons/ImportContactsOutlined'
import IconGeneric from '@material-ui/icons/InsertDriveFileOutlined'
import IconSong from '@material-ui/icons/LibraryMusicOutlined'
import IconNew from '@material-ui/icons/NewReleasesTwoTone'

import { WORD, PHRASE, SONG, STORY } from 'common/Constants'
import '!style-loader!css-loader!./DashboardDetailIcon.css'
/**
 * @summary DashboardDetailIconPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {integer} props.itemType
 * @param {boolean} props.isNew
 *
 * @returns {node} jsx markup
 */
function DashboardDetailIconPresentation({ itemType, isNew }) {
  let Icon = IconGeneric
  switch (itemType) {
    case WORD:
      Icon = IconWord
      break
    case PHRASE:
      Icon = IconPhrase
      break
    case SONG:
      Icon = IconSong
      break
    case STORY:
      Icon = IconStory
      break

    default:
      break
  }
  return (
    <div className="DashboardDetailIcon">
      {isNew && <IconNew fontSize="small" className="DashboardDetailIcon__new" />}
      <Icon className="DashboardDetailIcon__icon" fontSize="large" />
    </div>
  )
}
// PROPTYPES
const { bool, oneOf } = PropTypes
DashboardDetailIconPresentation.propTypes = {
  itemType: oneOf([WORD, PHRASE, SONG, STORY]),
  isNew: bool,
}

export default DashboardDetailIconPresentation
