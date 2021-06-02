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

import Immutable from 'immutable'
import StringHelpers from 'common/StringHelpers'
import selectn from 'selectn'
import { WORKSPACES, SECTIONS } from 'common/Constants'
// Used by replaceAllWorkspaceSectionKeys() & switchWorkspaceSectionKeys()
const proxiesKeys = [
  {
    workspace: 'fv-word:categories',
    section: 'fvproxy:proxied_categories',
  },
  {
    workspace: 'fv-phrase:phrase_books',
    section: 'fvproxy:proxied_categories',
  },
  {
    workspace: 'fvm:origin',
    section: 'fvproxy:proxied_origin',
  },
  {
    workspace: 'fv:related_pictures',
    section: 'fvproxy:proxied_pictures',
  },
  {
    workspace: 'fv:related_videos',
    section: 'fvproxy:proxied_videos',
  },
  {
    workspace: 'fv:related_audio',
    section: 'fvproxy:proxied_audio',
  },
]

// Will perform action only if the data is not found in store
// @key - the key to look up (or set) in the store for this action/reducer
// @action - the action to perform if nothing found in store.
// @reducer - the reducer to look for
async function fetchIfMissing({ action, actionParams, key, reducer }) {
  if (key !== undefined && !selectn('success', getEntry(reducer, key)) && typeof action === 'function') {
    await action(key, actionParams)
  }
}

function filtersToNXQL(filterArray) {
  let nxqlFilterString = ''
  const nxqlGroups = {}

  const generateNXQLString = function generateNXQLString(nxql, appliedFilter) {
    return nxql.replace(/\$\{value\}/g, appliedFilter)
  }

  for (const appliedFilterKey in filterArray) {
    const ak = Object.assign({}, filterArray[appliedFilterKey])
    if (
      Object.prototype.hasOwnProperty.call(ak, 'filterOptions') &&
      ak.filterOptions &&
      Object.prototype.hasOwnProperty.call(ak.filterOptions, 'nxql')
    ) {
      const filterOptions = ak.filterOptions

      if (ak.appliedFilter === true) ak.appliedFilter = 1
      if (ak.appliedFilter === false) ak.appliedFilter = 0

      if (!Object.prototype.hasOwnProperty.call(filterOptions, 'nxqlGroup')) {
        nxqlFilterString +=
          ' ' +
          (Object.prototype.hasOwnProperty.call(filterOptions, 'operator') ? filterOptions.operator : 'AND') +
          ' ' +
          generateNXQLString(filterOptions.nxql, ak.appliedFilter)
      } else {
        if (
          Object.prototype.hasOwnProperty.call(nxqlGroups, filterOptions.nxqlGroup) &&
          nxqlGroups[filterOptions.nxqlGroup].length > 0
        ) {
          nxqlGroups[filterOptions.nxqlGroup].push(generateNXQLString(filterOptions.nxql, ak.appliedFilter))
        } else {
          nxqlGroups[filterOptions.nxqlGroup] = [generateNXQLString(filterOptions.nxql, ak.appliedFilter)]
        }
      }
    }
  }

  let appendGroupNXQL = ''

  for (const key in nxqlGroups) {
    appendGroupNXQL += ' AND (' + nxqlGroups[key].join(' OR ') + ')'
  }

  return nxqlFilterString + appendGroupNXQL
}

/*
getDialectGroups()

Input:
  aces = [],
  currentlyAssignedGroups = []
Output:
  - null
  - {all, new}
*/
function getDialectGroups(aces = [], currentlyAssignedGroups = []) {
  if (aces.length === 0) {
    return {
      all: null,
      new: null,
    }
  }

  // Generate list of groups this user can be added to
  const allAvailableGroups = {}

  // Generate list of all groups related to this dialect
  const newAvailableGroups = {}

  aces.forEach(function acesForEach(group) {
    const groupArray = group.username.split('_')
    if (group.username.match(/members|recorders|administrators/g) != null) {
      const groupLabel = groupArray.map((_group) => StringHelpers.toTitleCase(_group)).join(' ')

      allAvailableGroups[group.username] = groupLabel

      // If user is not already a memeber of this group, add to new available groups
      if (currentlyAssignedGroups.indexOf(group.username) === -1) {
        newAvailableGroups[group.username] = groupLabel
      }
    }
  })

  return {
    all: allAvailableGroups,
    new: newAvailableGroups,
  }
}

/*
getDialectPathFromURLArray(urlArray)

Extracts dialect path from url array.
Returns null if not found
*/
function getDialectPathFromURLArray(urlArray) {
  const index = urlArray.findIndex((el) => {
    return el.match(/^FV$/)
  })
  if (index !== -1) {
    const _url = urlArray.slice(index, index + 6)
    return decodeURI(`/${_url.join('/')}`)
  }
  return null
}

function getEntry(wordResults, path) {
  if (!wordResults || wordResults.isEmpty() || !path) {
    return null
  }

  const result = wordResults.find(function wordResultsFind(entry) {
    return entry.get('id') === path
  })
  if (result) {
    return result.toJS()
  }
  return null
}

// TODO: confirm if this can be delted
function hasExtendedGroup(extendedGroups, group) {
  if (extendedGroups && extendedGroups.size > 0) {
    if (
      extendedGroups.findIndex(function extendedGroupsFindIndex(entry) {
        return entry.get('name') === group
      }) === -1
    ) {
      return false
    }
    return true
  }
  return false
}

function isActiveRole(roles) {
  if (roles && roles.length > 0) {
    if (
      roles.indexOf('Record') !== -1 ||
      roles.indexOf('Approve') !== -1 ||
      roles.indexOf('Manage') !== -1 ||
      roles.indexOf('Member') !== -1
    ) {
      return true
    }
  }

  return false
}

/**
 * A site admin
 *
 * Returns:
 * - boolean
 * - undefined
 */
function isAdmin(computeLogin) {
  const extendedGroups = selectn('response.extendedGroups', computeLogin)
  const extendGroupsFiltered = (extendedGroups || []).filter((group) => group.name.includes('administrators'))
  return extendGroupsFiltered.length > 0
}

/**
 * Checks if a current user is parts of list of groups
 */
function isDialectMember(computeLogin, computeDialect) {
  const userGroups = selectn('response.properties.groups', computeLogin)
  const acls = selectn('response.contextParameters.acls', computeDialect)
  const separateName = acls?.[0].aces?.[0].id.split('_')
  const dialectname = separateName?.[0]
  const dialectGroups = [
    `${dialectname}_language_administrators`,
    `${dialectname}_recorders_with_approval`,
    `${dialectname}_recorders`,
    `${dialectname}_members`,
  ]

  if (userGroups && userGroups.length > 0) {
    const arrayIntersection = userGroups.filter((value) => dialectGroups.indexOf(value) > -1)
    return arrayIntersection.length >= 1
  }
  return false
}

function isDialectPath(windowPath = '') {
  return windowPath.indexOf('/FV/Workspaces/Data/') !== -1
}

/**
 * Recorder with Approval
 */
function isRecorderWithApproval(computeLogin) {
  const extendedGroups = selectn('response.extendedGroups', computeLogin)
  const extendGroupsFiltered = (extendedGroups || []).filter((group) => group.name === 'recorders_with_approval')
  return extendGroupsFiltered.length > 0
}

/**
 * A site member is not associated with any specific dialect, but still has access to site for other functionality.
 */
function isSiteMember(groups) {
  return groups && groups.length === 1 && groups[0] === 'members'
}

/**
 * WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
 */
function isStartsWithQuery(currentAppliedFilter) {
  let starts_with_query = ''
  // eslint-disable-next-line
  const regex = /^ AND \( dc\:title ILIKE '(.*)%' \)$/g
  const regexTest = new RegExp(regex)

  if (regexTest.test(currentAppliedFilter)) {
    starts_with_query = '&starts_with_query=Document.Query'
  }

  return starts_with_query
}

function replaceAllWorkspaceSectionKeys(string, area) {
  // TODO: is this related to values found in Redux > navigation.route.routeParams.area === 'sections' || 'Workspaces' ?
  const searchKey = area === 'sections' ? 'workspace' : 'section'
  const replaceKey = area === 'sections' ? 'section' : 'workspace'
  let _string = string
  for (const proxyKey in proxiesKeys) {
    _string = _string.replace(new RegExp(proxiesKeys[proxyKey][searchKey], 'g'), proxiesKeys[proxyKey][replaceKey])
  }
  return _string
}

function switchWorkspaceSectionKeys(workspaceKey, area) {
  const row = proxiesKeys.find(function proxiesKeysFind(mapping) {
    return mapping.workspace === workspaceKey
  })

  if (row) {
    if (area === SECTIONS) {
      return row.section
    }
    return row.workspace
  }

  return workspaceKey
}

function toJSKeepId(js) {
  // const toReturn = typeof js !== 'object' || js === null
  // ? js
  // : Array.isArray(js)
  //   ? Immutable.Seq(js)
  //     .map(toJSKeepId)
  //     .toList()
  //   : js.hasOwnProperty('id')
  //     ? Immutable.Seq(js).toMap()
  //     : Immutable.Seq(js)
  //       .map(toJSKeepId)
  //       .toMap()
  // return toReturn
  // Note: The following should be the same as the above nested ternary
  if (typeof js !== 'object' || js === null) {
    return js
  } else if (Array.isArray(js)) {
    return Immutable.Seq(js).map(toJSKeepId).toList()
  } else if (Object.prototype.hasOwnProperty.call(js, 'id')) {
    return Immutable.Seq(js).toMap()
  }
  return Immutable.Seq(js).map(toJSKeepId).toMap()
}
// prettier-ignore
export default {
  fetchIfMissing,
  filtersToNXQL,
  getEntry,
  getDialectGroups,
  getDialectPathFromURLArray,
  hasExtendedGroup, // TODO: confirm if this can be delted
  isAdmin,
  isActiveRole,
  isDialectMember,
  isDialectPath,
  isRecorderWithApproval,
  isSiteMember,
  isStartsWithQuery,
  replaceAllWorkspaceSectionKeys,
  switchWorkspaceSectionKeys,
  toJSKeepId,
  regex: {
    NUMBER: '^([0-9]+)\??$',
    QUERY_PARAMS: /\?(.*)/,
    ANYTHING_BUT_SLASH: '([^/]*)\??$', // eslint-disable-line
    ANY_LANGUAGE_CODE: '(en|fr)',
    WORKSPACE_OR_SECTION: `(${SECTIONS}|${WORKSPACES})`,
    KIDS_OR_DEFAULT: '(kids|explore)',
    DEFAULT: '(explore)',
    KIDS: '(kids)',
  },
  userRegistrationRoles: [
    { value: 'teacher', text: 'I am a teacher/educator' },
    { value: 'student', text: 'I am a learner/student' },
    { value: 'learner-1', text: 'I am interested in learning MY language' },
    { value: 'learner-2', text: 'I am interested in learning A language' },
    { value: 'other', text: 'Other (please mention in comments)' },
  ],
}
