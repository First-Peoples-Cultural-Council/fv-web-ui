import { useState, useEffect } from 'react'
import selectn from 'selectn'

import useLogin from 'DataSource/useLogin'
import useUser from 'DataSource/useUser'
import ProviderHelpers from 'common/ProviderHelpers'

// TODO: Update useTasks.js when Guy is done editing
// import useTasks from 'DataSource/useTasks'

import StringHelpers from 'common/StringHelpers'
/**
 * @summary useRegistrations
 * @description Custom hook that returns user registrations
 * @version 1.0.1
 *
 * @component
 */
function useRegistrations() {
  // State Hooks
  const [userId, setUserId] = useState()
  const [registrations, setRegistrations] = useState([])
  const [count, setCount] = useState()

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { computeUserDialects, fetchUserDialects } = useUser()

  // TODO: Update useTasks.js when Guy is done editing
  // const { computeRegistrations, fetchRegistrations: _fetchRegistrations } = useTasks()
  // TODO: Drop this fake stub when endpoint is live
  const _fetchRegistrations = (id, params) => {
    /* eslint-disable */
    // console.log('Fake _fetchRegistrations', { id, params })
    /* eslint-enable */

    // TODO/NOTE: the real method may need to handle a sortOrder === ''
    // TODO: (sortOrder === '' || !sortOrder) ? 'desc' : sortOrder

    return new Promise((resolve /*, reject*/) => {
      resolve({
        entries: [
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4e',
            dateCreated: '2020-08-20T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fn1',
              lastName: 'ln1',
              email: 'fn1@ln1.ca',
            },
          },
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4f',
            dateCreated: '2020-08-21T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fn2',
              lastName: 'ln2',
              email: 'email@email2.ca',
            },
          },
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4g',
            dateCreated: '2020-08-22T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fn3',
              lastName: 'ln3',
              email: 'email@email3.ca',
            },
          },
        ],
        resultsCount: 123456789,
        pageIndex: params.currentPageIndex,
      })
    })
  }

  // User Id
  const _userId = selectn('response.id', computeLogin)
  useEffect(() => {
    if (_userId) {
      setUserId(_userId)
      ProviderHelpers.fetchIfMissing(_userId, fetchUserDialects, computeUserDialects)
    }
  }, [_userId])

  // Formatting server response for component
  const formatDataForComponent = (_registrations) => {
    return _registrations.map(({ uid, dateCreated, requestedBy }) => {
      const { firstName, lastName, email } = requestedBy
      return {
        name: `${firstName} ${lastName}`,
        email,
        date: StringHelpers.formatUTCDateString(dateCreated),
        id: uid,
      }
    })
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const fetchRegistrations = ({ pageIndex = 0, pageSize = 100, sortBy = 'date', sortOrder, userId: _id }) => {
    // Component & query params aren't the same as the data name from the server...
    const friendlyNamePropertyNameLookup = {
      date: 'dateCreated',
      id: 'uid',
      email: 'email', // TODO: confirm this works when endpoint is live. The server returns this data at `requestedBy.email`
    }

    return _fetchRegistrations(_id, {
      currentPageIndex: pageIndex,
      pageSize,
      sortBy: friendlyNamePropertyNameLookup[sortBy],
      sortOrder,
    }).then(({ entries, resultsCount, pageIndex: _pageIndex }) => {
      const data = formatDataForComponent(entries)
      setRegistrations(data)
      setCount(resultsCount)

      return {
        data,
        page: _pageIndex,
        totalCount: resultsCount,
      }
    })
  }

  /*
  const resetRegistrations = () => {
    setRegistrations([])
  }
  */
  const _computeUserDialects = ProviderHelpers.getEntry(computeUserDialects, userId)
  return {
    count,
    dialectId: selectn(['response', 'entries', 0, 'uid'], _computeUserDialects),
    dialectTitle: selectn(['response', 'entries', 0, 'title'], _computeUserDialects),
    dialectPath: selectn(['response', 'entries', 0, 'path'], _computeUserDialects),
    fetchRegistrations,
    registrations,
    // resetRegistrations,
    userId,
  }
}

export default useRegistrations
