import PropTypes from 'prop-types'
import { WORD, PHRASE, SONG, STORY } from 'common/Constants'

/**
 * @summary DashboardDetailListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardDetailListData({ children }) {
  return children({
    // TEMP: dummy data
    listItems: [
      {
        title: 'Unknown Title',
        requestedBy: 'John Doe',
        date: '09/09/2020',
        isNew: true,
      },
      {
        title: 'Word Title',
        requestedBy: 'John Doe',
        date: '09/09/2020',
        itemType: WORD,
        isNew: true,
      },
      {
        title: 'Phrase Title',
        requestedBy: 'John Doe',
        date: '09/09/2020',
        itemType: PHRASE,
        isNew: true,
      },
      {
        title: 'Song Title',
        requestedBy: 'John Doe',
        date: '09/09/2020',
        itemType: SONG,
        isNew: true,
      },
      {
        title: 'Story Title',
        requestedBy: 'John Doe',
        date: '09/09/2020',
        itemType: STORY,
        isNew: true,
      },
    ],
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailListData.propTypes = {
  children: func,
}

export default DashboardDetailListData
