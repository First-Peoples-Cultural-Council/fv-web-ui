import React from 'react'
import PropTypes from 'prop-types'
import DashboardDetailListPresentation from 'components/DashboardDetail/DashboardDetailList/DashboardDetailListPresentation'
import DashboardDetailListPaginationPresentation from 'components/DashboardDetail/DashboardDetailList/DashboardDetailListPaginationPresentation'

import Typography from '@material-ui/core/Typography'
import { WORD, PHRASE, SONG, STORY } from 'common/Constants'

/**
 * @summary DashboardDetailListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.listItems
 * @param {function} props.onClick
 * @param {string} props.selectedId
 * @param {string} props.title
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListContainer({ listItems, onClick, selectedId, title, page, pageSize, count }) {
  return (
    <DashboardDetailListPresentation
      childrenHeader={
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      }
      childrenPagination={
        <DashboardDetailListPaginationPresentation count={count} page={page - 1} rowsPerPage={pageSize} />
      }
      listItems={listItems}
      onClick={onClick}
      selectedId={selectedId}
    />
  )
}
// PROPTYPES
const { array, func, number, string } = PropTypes
DashboardDetailListContainer.propTypes = {
  listItems: array,
  onClick: func,
  selectedId: string,
  title: string,
  page: number,
  pageSize: number,
  count: number,
}
DashboardDetailListContainer.defaultProps = {
  listItems: [
    {
      title: 'Unknown Title',
      initiator: 'John Doe',
      date: '09/09/2020',
      isNew: true,
    },
    {
      title: 'Word Title',
      initiator: 'John Doe',
      date: '09/09/2020',
      itemType: WORD,
      isNew: true,
    },
    {
      title: 'Phrase Title',
      initiator: 'John Doe',
      date: '09/09/2020',
      itemType: PHRASE,
      isNew: true,
    },
    {
      title: 'Song Title',
      initiator: 'John Doe',
      date: '09/09/2020',
      itemType: SONG,
      isNew: true,
    },
    {
      title: 'Story Title',
      initiator: 'John Doe',
      date: '09/09/2020',
      itemType: STORY,
      isNew: true,
    },
  ],
}

export default DashboardDetailListContainer
