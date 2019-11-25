import React, { useState, useEffect } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, {
  windowLocationPathnameWithoutPagination,
  getSearchObject,
  getSearchObjectAsUrlQuery,
} from 'common/NavigationHelpers'
import Checkbox from 'views/components/Form/Common/Checkbox'
import ConfirmationDelete from 'views/components/Confirmation'

// batchTitle
// ============================================
export const batchTitle = ({ uidsNotDeleted = [], selected, setSelected, copyDeselect, copySelect }) => {
  // uidsNotDeleted = getUidsThatAreNotDeleted({ computedData, deletedUids })
  // All items selected, show deselect
  if (uidsNotDeleted.length === selected.length && uidsNotDeleted.length !== 0) {
    return (
      <button
        className="_btn _btn--compact"
        type="button"
        onClick={() => {
          setSelected([])
        }}
      >
        {copyDeselect}
      </button>
    )
  }
  // show select
  return (
    <button
      className="_btn _btn--compact"
      type="button"
      onClick={() => {
        setSelected(uidsNotDeleted)
      }}
    >
      {copySelect}
    </button>
  )
}
// batchFooter
// ============================================
export const batchFooter = ({
  colSpan,
  confirmationAction,
  copyBtnConfirm,
  copyBtnDeny,
  copyBtnInitiate,
  copyIsConfirmOrDenyTitle,
  selected,
}) => {
  return {
    colSpan,
    element: (
      <ConfirmationDelete
        confirmationAction={confirmationAction}
        className="Contributor__delete"
        compact
        copyIsConfirmOrDenyTitle={copyIsConfirmOrDenyTitle}
        copyBtnInitiate={copyBtnInitiate}
        copyBtnDeny={copyBtnDeny}
        copyBtnConfirm={copyBtnConfirm}
        disabled={selected.length === 0}
      />
    ),
  }
}
// batchRender
// ============================================
export const batchRender = ({ dataUid, selected, setSelected }) => {
  const uid = dataUid
  return (
    <Checkbox
      selected={isSelected({ selected, uid })}
      id={uid}
      value={uid}
      name="batch"
      labelText=""
      handleChange={(isChecked) => {
        toggleCheckbox({
          isChecked,
          selected,
          setSelected,
          uid,
        })
      }}
    />
  )
}

// deleteSelected
// ============================================
/*
export const deleteSelected = ({ deleteApi, deletedUids, selected, setDeletedUids, setSelected }) => {
  // Add to deleted
  setDeletedUids([...deletedUids, ...selected])

  // Delete all items in selected
  selected.forEach(async (uid) => {
    await deleteApi(uid)
  })

  // Clear out selected
  setSelected([])
}
*/
export const deleteSelected = ({ batchConfirmationAction, deletedUids, selected, setDeletedUids, setSelected }) => {
  // Add to deleted
  setDeletedUids([...deletedUids, ...selected])

  // Call handler
  batchConfirmationAction(selected)

  // Clear out selected
  setSelected([])
}

// getIcon
// ============================================
export const getIcon = ({ field, sortOrder, sortBy }) => {
  if (sortBy === field) {
    return sortOrder === 'asc' ? (
      // SORTED ASCENDING
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    ) : (
      // SORTED DESCENDING
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    )
  }
  // UNSORTED
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
    </svg>
  )
}

// getUidsThatAreNotDeleted
// Returns all available uids that are not deleted
// Used to determine the state of the De/Select all button
// ============================================
export const getUidsThatAreNotDeleted = ({ computedDataUids = [], deletedUids = [] }) => {
  return computedDataUids.reduce((accumulator, computedDataUid) => {
    const isDeleted = deletedUids.find((deletedUid) => {
      return deletedUid === computedDataUid
    })
    return isDeleted === undefined ? [...accumulator, computedDataUid] : accumulator
  }, [])
}

// getUidsFromComputedData
// Returns array of uids from computedData
// Doesn't care about selected or deleted items
// ============================================
export const getUidsFromComputedData = ({ computedData = {} }) => {
  if (computedData && computedData.isFetching === false && computedData.success) {
    return computedData.response.entries.map((item) => {
      return item.uid
    })
  }
  return []
}

// isSelected
// ============================================
export const isSelected = ({ selected, uid }) => {
  const exists = selected.find((selectedUid) => {
    return selectedUid === uid
  })
  return exists ? true : false
}

// sortCol
// ============================================
/*
export const sortCol = ({ dialect_path, urlItemType, newSortBy, pageSize, pushWindowPath, siteTheme, sortOrder }) => {
  const url = `/${siteTheme}${dialect_path}/${urlItemType}/${pageSize}/1?sortBy=${newSortBy}&sortOrder=${
    sortOrder === 'asc' ? 'desc' : 'asc'
  }`
  NavigationHelpers.navigate(url, pushWindowPath, false)
}
*/
// sortCol
// ============================================
export const sortCol = ({ newSortBy, pageSize, pushWindowPath, sortOrder, sortHandler }) => {
  const page = 1
  const url = `${windowLocationPathnameWithoutPagination()}/${pageSize}/${page}`
  // Get search object, add in new sortBy & sortOrder
  const searchObj = Object.assign({}, getSearchObject(), {
    sortBy: newSortBy,
    sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
  })
  // Smash together & update url
  NavigationHelpers.navigate(`/${url}?${getSearchObjectAsUrlQuery(searchObj)}`, pushWindowPath, false)

  if (sortHandler) {
    sortHandler({
      page,
      pageSize,
      sortOrder: searchObj.sortOrder,
      sortBy: searchObj.sortBy,
    })
  }
}

// toggleCheckbox
// ============================================
export const toggleCheckbox = ({ isChecked, selected, setSelected, uid }) => {
  let _selected = [...selected]

  const exists = isSelected({ selected, uid })

  if (isChecked && !exists) {
    _selected.push(uid)
  }

  if (!isChecked && exists) {
    _selected = _selected.filter((selectedUid) => {
      return selectedUid !== uid
    })
  }

  setSelected(_selected)
}

// useDeleteItem
// ============================================
export const useDeleteItem = ({ deleteApi, deletedUids, deleteItemUid, selected, setDeletedUids, setSelected }) => {
  useEffect(() => {
    if (deleteItemUid) {
      // Add to deleted
      setDeletedUids([...deletedUids, deleteItemUid])

      // Remove from selected
      setSelected(
        // filter out deleteItemUid
        selected.filter((uid) => {
          return uid !== deleteItemUid
        })
      )

      // call server
      deleteApi(deleteItemUid)
    }
  }, [deleteItemUid])
}

// useGetData
// ============================================
export const useGetData = ({ computeData, dataPath, deletedUids, getData, routeParams, search }) => {
  useEffect(() => {
    getData()
  }, [routeParams.pageSize, routeParams.page, search.sortBy, search.sortOrder])

  // Filter out any items deleted after page load:
  const computedData = ProviderHelpers.getEntry(computeData, dataPath)
  if (computedData && computedData.isFetching === false && computedData.success) {
    const entries = computedData.response.entries
    const filtered = entries.reduce((accumulator, entry) => {
      const isDeleted = deletedUids.find((uid) => {
        return uid === entry.uid
      })
      if (isDeleted === undefined) {
        return [...accumulator, entry]
      }
      return accumulator
    }, [])
    const filterComputedData = Object.assign({}, computedData)
    filterComputedData.response.entries = filtered
    return filterComputedData
  }
  return computedData
}

// useGetCopy
// ============================================
export const useGetCopy = (webpackDynamicImport) => {
  const [copy, setCopy] = useState()
  useEffect(() => {
    const promised = webpackDynamicImport()
    promised.then((_copy) => {
      setCopy(_copy)
    })
  }, [])
  return copy
}

// usePaginationRequest
// ============================================
export const usePaginationRequest = ({ pushWindowPath, paginationRequest }) => {
  useEffect(() => {
    if (paginationRequest) {
      NavigationHelpers.navigate(paginationRequest, pushWindowPath, false)
    }
  }, [paginationRequest])
}
