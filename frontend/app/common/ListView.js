import React, { useState, useEffect } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, {
  windowLocationPathnameWithoutPagination,
  getSearchObject,
  getSearchObjectAsUrlQuery,
} from 'common/NavigationHelpers'
import Checkbox from 'components/Form/Common/Checkbox'
import ConfirmationDelete from 'components/Confirmation'

import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import UnfoldMore from '@material-ui/icons/UnfoldMore'

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
        className="DictionaryList__confirmationDelete"
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
  if (batchConfirmationAction) {
    batchConfirmationAction(selected)
  }

  // Clear out selected
  setSelected([])
}

// getIcon
// ============================================
export const getIcon = ({ field, sortOrder, sortBy, color = 'inherit' }) => {
  let icon
  if (sortBy === field) {
    icon =
      sortOrder === 'asc' ? (
        // SORTED ASCENDING
        <KeyboardArrowUp color={color} />
      ) : (
        // SORTED DESCENDING
        <KeyboardArrowDown color={color} />
      )
  } else {
    // UNSORTED
    icon = <UnfoldMore color={color} />
  }
  return <span className="PrintHide">{icon}</span>
}

// getSortState
// If sorted returns sortOrder (ie: 'asc' or 'desc')
// If not sorted returns undefined
// ============================================
export const getSortState = ({ field, sortOrder, sortBy }) => {
  if (sortBy === field) {
    return sortOrder
  }
  return undefined
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
export const sortCol = ({ newSortBy, pageSize, navigationFunc, sortOrder, sortHandler }) => {
  const page = 1
  const url = `/${windowLocationPathnameWithoutPagination()}/${pageSize}/${page}`
  // Get search object, add in new sortBy & sortOrder
  const searchObj = Object.assign({}, getSearchObject(), {
    sortBy: newSortBy,
    sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
  })
  const urlWithQuery = `${url}?${getSearchObjectAsUrlQuery(searchObj)}`

  if (sortHandler) {
    sortHandler({
      page,
      pageSize,
      sortOrder: searchObj.sortOrder,
      sortBy: searchObj.sortBy,
      url,
      urlWithQuery,
    })
  } else {
    // Update url
    NavigationHelpers.navigate(urlWithQuery, navigationFunc, false)
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
