import PropTypes from 'prop-types'
import StringHelpers from 'common/StringHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
import URLHelpers from 'common/URLHelpers'
/**
 * @summary WidgetTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 *
 */
function WidgetTasksData({ children }) {
  const { navigate } = useNavigationHelpers()

  const onRowClick = (event, { id }) => {
    navigate(`/dashboard/tasks?active=${id}`)
  }

  // NOTE: Works on July 20
  const dataPromised = ({
    // filters
    orderBy: sortBy = 'dc:created',
    orderDirection: sortOrder = 'ASC',
    page: currentPageIndex = 0,
    pageSize = 100,
    // search
    // totalCount
  }) => {
    return fetch(`${URLHelpers.getBaseURL()}/site/automation/GetTasksForUserGroupOperation`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Nuxeo-Transaction-Timeout': 3,
        'X-NXproperties': '*',
        'X-NXRepository': 'default',
        'X-NXVoidOperation': false,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params: { sortOrder, currentPageIndex, pageSize, sortBy }, context: {} }),
    })
      .then((data) => {
        return data.json()
      })
      .then(({ entries, pageIndex, resultsCount }) => {
        return {
          data: entries.map(({ uid: id, properties }) => {
            return {
              date: properties['dc:created'],
              id,
              initiator: properties['nt:initiator'],
              title: properties['nt:name'],
            }
          }),
          page: pageIndex,
          totalCount: resultsCount,
        }
      })
  }

  return children({
    columns: [
      {
        title: '',
        field: 'icon',
        render: () => {
          return '[~]'
        },
      },
      {
        title: 'Entry title',
        field: 'title',
      },
      {
        title: 'Requested by',
        field: 'initiator',
      },
      {
        title: 'Date submitted',
        field: 'date',
        render: ({ date }) => StringHelpers.formatUTCDateString(new Date(date)),
      },
    ],
    onRowClick,
    options: {
      paging: true,
      pageSizeOptions: [5], // NOTE: with only one option the Per Page Select is hidden
    },
    data: dataPromised,
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
