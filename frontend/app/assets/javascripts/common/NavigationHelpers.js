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
import selectn from 'selectn'
import ConfRoutes, { paramMatch } from 'conf/routes'
import Immutable, { is } from 'immutable'
import { SECTIONS } from 'common/Constants'
import URLHelpers from 'common/URLHelpers'

const arrayPopImmutable = (array, sizeToPop = 1) => {
  return array.slice(0, array.length - sizeToPop)
}

/**
 * Adds a forward slash to path if it is missing to help generate URLs
 * @param String path
 */
const AddForwardSlash = (path) => {
  let addForwardSlash = '/'

  if (path.indexOf('/') === 0) {
    addForwardSlash = ''
  }

  return addForwardSlash + path
}

/**
 * Stores some default route parameters
 */
const DefaultRouteParams = {
  siteTheme: 'explore',
  area: SECTIONS,
}

export default {
  // Navigate to an absolute path, possibly URL encoding the last path part
  // If no NavigationFunc is provided, will return the path
  // Will add context path unless already provided
  navigate: (path, navigationFunc, encodeLastPart = false) => {
    const pathArray = path.split('/')

    if (encodeLastPart) {
      pathArray[pathArray.length - 1] = encodeURIComponent(pathArray[pathArray.length - 1])
    }

    // Only add context path if it doesn't exist
    const transformedPath =
      path.indexOf(URLHelpers.getContextPath()) === 0
        ? pathArray.join('/')
        : URLHelpers.getContextPath() + pathArray.join('/')

    if (!navigationFunc) {
      return transformedPath
    }
    navigationFunc(transformedPath)
  },
  // Navigate up by removing the last page from the URL
  navigateUp: (currentPathArray, navigationFunc) => {
    navigationFunc('/' + arrayPopImmutable(currentPathArray).join('/'))
  },
  // Navigate forward, replacing the current page within the URL
  navigateForwardReplace: (currentPathArray, forwardPathArray, navigationFunc) => {
    navigationFunc(
      '/' +
        arrayPopImmutable(currentPathArray)
          .concat(forwardPathArray)
          .join('/')
    )
  },
  // Navigate forward, replacing the current page within the URL
  navigateForwardReplaceMultiple: (currentPathArray, forwardPathArray, navigationFunc) => {
    navigationFunc(
      '/' +
        arrayPopImmutable(currentPathArray, forwardPathArray.length)
          .concat(forwardPathArray)
          .join('/')
    )
  },
  // Navigate forward by appending the forward path
  navigateForward: (currentPathArray, forwardPathArray, navigationFunc) => {
    navigationFunc('/' + currentPathArray.concat(forwardPathArray).join('/'))
  },
  // Navigate back to previous page
  navigateBack: () => {
    window.history.back()
  },
  // Method will append given path (/path/to/) to context path
  generateStaticURL: (path) => {
    return URLHelpers.getContextPath() + AddForwardSlash(path)
  },
  // Method will lookup a path, based on id, in routes, and generate the correct path
  generateDynamicURL: (routeId, routeParams, moreParams) => {
    const matchedRoute = ConfRoutes.find((route) => route && route.id && route.id === routeId)

    const _params = Object.assign({}, DefaultRouteParams, routeParams, moreParams)

    if (matchedRoute && matchedRoute.path) {
      const outputPath = matchedRoute.path

      matchedRoute.path.forEach((value, key) => {
        if (value instanceof paramMatch) {
          // If dynamic path value exists in parameters - use it
          if (value.id in _params) {
            outputPath[key] = _params[value.id]
          }
        } else if (value instanceof RegExp) {
          // When is regexp an option?
        }
      })

      return URLHelpers.getContextPath() + '/' + matchedRoute.path.join('/')
    }
    // TODO: How do we fall back gracefully when no path is found?
  },
  // Generate a UID link from a Nuxeo document path
  generateUIDPath: (siteTheme, item, pluralPathId) => {
    let path = '/' + siteTheme + selectn('path', item)
    // const type = selectn('type', item)

    switch (pluralPathId) {
      case 'words':
      case 'phrases':
        path = path.replace('/Dictionary/', '/learn/' + pluralPathId + '/')
        break

      case 'songs-stories':
      case 'songs':
      case 'stories':
        path = path.replace('/Stories & Songs/', '/learn/' + pluralPathId + '/')
        break

      case 'gallery':
        path = path.replace('/Portal/', '/' + pluralPathId + '/')
        break

      case 'media':
        // Resources can be in folders, so ensure everything after 'Resources' is ignored
        path = path.substring(0, path.lastIndexOf('/Resources/') + 11)
        path = path.replace('/Resources/', '/' + pluralPathId + '/')
        break
      default: // Note: do nothing
    }

    return (path = URLHelpers.getContextPath() + path.substring(0, path.lastIndexOf('/') + 1) + selectn('uid', item))
  },
  // Generate an edit href from a Nuxeo document path
  // Differs from generateUIDPath in that it:
  // - returns `undefined` if it doesn't recognize the passed in `pluralPathId`
  // - appends `/edit` to the generated path
  generateUIDEditPath: (siteTheme, item, pluralPathId) => {
    let shouldReturnPath = true
    let path = '/' + siteTheme + selectn('path', item)
    // const type = selectn('type', item)

    switch (pluralPathId) {
      case 'words':
      case 'phrases':
        path = path.replace('/Dictionary/', '/learn/' + pluralPathId + '/')
        break

      case 'songs-stories':
      case 'songs':
      case 'stories':
        path = path.replace('/Stories & Songs/', '/learn/' + pluralPathId + '/')
        break

      case 'gallery':
        path = path.replace('/Portal/', '/' + pluralPathId + '/')
        break

      case 'media':
        // Resources can be in folders, so ensure everything after 'Resources' is ignored
        path = path.substring(0, path.lastIndexOf('/Resources/') + 11)
        path = path.replace('/Resources/', '/' + pluralPathId + '/')
        break
      default: {
        shouldReturnPath = false
      }
    }
    path = `${URLHelpers.getContextPath()}${path.substring(0, path.lastIndexOf('/') + 1)}${selectn('uid', item)}/edit`
    return shouldReturnPath ? path : undefined
  },
  // Disable link
  disable: (event) => {
    event.preventDefault()
  },
  // Checks whether a page being accessed is a Workspace
  isWorkspace: (props) => {
    return props.windowPath && props.windowPath.indexOf('/Workspaces/') !== -1
  },
  getBaseWebUIURL: () => {
    return URLHelpers.getBaseWebUIURL()
  },
  getBaseURL: () => {
    return URLHelpers.getBaseURL()
  },
}

/*
Given:
  pathArray: ['create']
  splitWindowPath: ["explore", "FV", "Workspaces", "Data", "Athabascan", "Dene", "Dene", "learn", "words", "categories", "641f1def-4df7-41ab-8bae-ff65664ba24c"]
  landmarkArray: ['words', 'phrases'] // looks in splitWindowPath for the first matching item (going back to front)

  Will return:
  'explore/FV/Workspaces/Data/Athabascan/Dene/Dene/learn/words/create'

If not found, returns `undefined`

*/
export const appendPathArrayAfterLandmark = ({ pathArray, splitWindowPath, landmarkArray = ['words', 'phrases'] }) => {
  let toReturn = undefined

  if (!splitWindowPath) {
    return toReturn
  }

  const _splitWindowPath = [...splitWindowPath].reverse()

  landmarkArray.some((landmarkValue) => {
    const indexLandmark = _splitWindowPath.indexOf(landmarkValue)
    if (indexLandmark !== -1) {
      const cut = _splitWindowPath.slice(indexLandmark)
      cut.reverse()

      if (pathArray) {
        toReturn = [...cut, ...pathArray].join('/')
      } else {
        // if there is no pathArray just return the shorter splitWindowPath
        toReturn = [...cut].join('/')
      }
      return true
    }
    return false
  })
  return toReturn
}

export const getSearchObject = () => {
  if (window.location.search === '') {
    return {}
  }

  const search = {}
  const searchParams = (window.location.search || '?').replace(/^\?/, '')
  searchParams.split('&').forEach((item) => {
    if (item !== '' && /=/.test(item)) {
      const propValue = item.split('=')
      search[propValue[0]] = propValue[1]
    }
  })
  return search
  /*
  return Object.assign(
    {
      sortBy: 'fv:custom_order',
      sortOrder: 'asc',
    },
    search
  )
  */
}

export const getSearchObjectAsUrlQuery = (searchObject) => {
  const urlQueryArray = []
  for (const [key, value] of Object.entries(searchObject)) {
    urlQueryArray.push(`${key}=${value}`)
  }
  return `${urlQueryArray.join('&')}`
}

// Analyzes splitWindowPath (array)
// Determines if it has pagination values eg: ['learn', 'words', '10', '1'] // .../learn/words/10/1
// Returns array if pagination found: [pageSize, page] or undefined if not
export const hasPagination = (arr = []) => {
  let _arr = undefined
  const arrLength = arr.length
  if (arrLength >= 2) {
    // See if the last 2 items in the splitWindowPath array are pagination urls
    const pageSize = arr[arrLength - 2]
    const page = arr[arrLength - 1]
    // Test for pagination url segments
    const onlyNumber = /^([\d]+)$/
    const hasPaginationUrl = pageSize.match(onlyNumber) && page.match(onlyNumber)
    if (hasPaginationUrl) {
      _arr = [pageSize, page]
    }
  }

  return _arr
}

// Returns a new url with pagination
export const getNewPaginationUrl = ({ splitWindowPath, page, pageSize }) => {
  if (hasPagination(splitWindowPath)) {
    return '/' + [...splitWindowPath.slice(0, splitWindowPath.length - 2), pageSize, page].join('/')
  }
  return '/' + [...splitWindowPath, pageSize, page].join('/')
}

export const windowLocationPathnameWithoutPagination = () => {
  const pathnameAsArray = window.location.pathname.replace(/^\//, '').split('/')
  if (hasPagination(pathnameAsArray)) {
    const _pathnameAsArray = [...pathnameAsArray]
    _pathnameAsArray.pop()
    _pathnameAsArray.pop()
    return _pathnameAsArray.join('/')
  }
  return pathnameAsArray.join('/')
}
/*
routeHasChanged({
  prevWindowPath,
  curWindowPath,
  prevRouteParams,
  curRouteParams
})
*/
export const routeHasChanged = (obj = {}) => {
  const { prevWindowPath, curWindowPath, prevRouteParams, curRouteParams } = obj
  // Note: the following Prevents infinite loops
  if (curRouteParams === undefined) {
    return false
  }
  const immutablePrevRouteParams = Immutable.fromJS(prevRouteParams)
  const immutableCurRouteParams = Immutable.fromJS(curRouteParams)
  return (
    encodeURI(prevWindowPath) !== encodeURI(curWindowPath) ||
    is(immutablePrevRouteParams, immutableCurRouteParams) === false
  )
}

export const updateUrlIfPageOrPageSizeIsDifferent = ({
  page = 1,
  pageSize = 10,
  pushWindowPath = () => {},
  routeParamsPage = 1,
  routeParamsPageSize = 10,
  splitWindowPath,
  windowLocationSearch,
  onPaginationReset = () => {},
} = {}) => {
  // Function that will update the url, possibly appending `windowLocationSearch`
  const navigationFunc = (url) => {
    pushWindowPath(`${url}${windowLocationSearch ? windowLocationSearch : ''}`)
  }
  // Cast to numbers
  let pageNum = parseInt(page, 10)
  const pageSizeNum = parseInt(pageSize, 10)
  const routeParamsPageNum = parseInt(routeParamsPage, 10)
  const routeParamsPageSizeNum = parseInt(routeParamsPageSize, 10)

  if (pageNum !== routeParamsPageNum || pageSizeNum !== routeParamsPageSizeNum) {
    if (pageSizeNum !== routeParamsPageSizeNum && pageNum !== 1) {
      pageNum = 1
    }
    // With pagination, replace end part of url
    if (hasPagination(splitWindowPath)) {
      navigationFunc(
        '/' +
          arrayPopImmutable(splitWindowPath, [pageSizeNum, pageNum].length)
            .concat([pageSizeNum, pageNum])
            .join('/')
      )
    } else {
      // When no pagination, append to url
      navigationFunc('/' + splitWindowPath.concat([pageSizeNum, pageNum]).join('/'))
    }
  }
  // TODO: Drop the following?
  // If `pageSize` has changed, reset `page`
  if (pageSizeNum !== routeParamsPageSizeNum) {
    onPaginationReset(pageNum, pageSizeNum)
  }
}
