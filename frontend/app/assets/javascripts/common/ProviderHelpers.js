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

import Immutable, { List, Map } from 'immutable'
import StringHelpers from './StringHelpers'

import selectn from 'selectn'

const toJSKeepId = function(js) {
  return typeof js !== 'object' || js === null
    ? js
    : Array.isArray(js)
      ? Immutable.Seq(js)
        .map(toJSKeepId)
        .toList()
      : js.hasOwnProperty('id')
        ? Immutable.Seq(js).toMap()
        : Immutable.Seq(js)
          .map(toJSKeepId)
          .toMap()
}

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

const getEntryFunc = function(wordResults, path) {
  if (!wordResults || wordResults.isEmpty() || !path) {
    return null
  }

  const result = wordResults.find(function(entry) {
    return entry.get('id') === path
  })

  if (result) {
    return result.toJS()
  }

  return null
}

export default {
  getEntry: getEntryFunc,
  // Will perform action only if the data is not found in store
  // @key - the key to look up (or set) in the store for this action/reducer
  // @action - the action to perform if nothing found in store.
  // @reducer - the reducer to look for
  fetchIfMissing: function(key, action, reducer) {
    if (!selectn('success', getEntryFunc(reducer, key))) {
      action(key)
    }
  },
  toJSKeepId: function(js) {
    return toJSKeepId(js)
  },
  /*hasExtendedGroup: function (extendedGroups, group) {

      if (extendedGroups && extendedGroups.size > 0) {
        if (extendedGroups.findIndex(function(entry) { return (entry.get('name') === group) }) === -1) {
          return false;
        } else {
          return true;
        }
      }

      return false;
    },*/
  isActiveRole: function(roles) {
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
  },
  /**
   * A site member is not associated with any specific dialect, but still has access to site for other functionality.
   */
  isSiteMember: function(groups) {
    return groups && groups.length === 1 && groups[0] === 'members'
  },
  /**
   * A site admin
   */
  isAdmin: function(computeLogin) {
    const userGroups = selectn('response.properties.groups', computeLogin)
    return userGroups && userGroups.indexOf('administrators') != -1
  },
  /**
   * Recorder with Approval
   */
  isRecorderWithApproval: function(computeLogin) {
    const extendedGroups = selectn('response.extendedGroups', computeLogin)
    const extendGroupsFiltered = (extendedGroups || []).filter((group) => group.name === 'recorders_with_approval')
    return extendGroupsFiltered.length > 0
  },
  /**
   * Checks if a current user is parts of list of groups
   */
  isDialectMember: function(computeLogin, computeDialect) {
    const userGroups = selectn('response.properties.groups', computeLogin)

    let groupsToCheck = []
    if (computeDialect && computeDialect.size > 0) {
      const dialect = computeDialect.get(0).get('response')

      if (dialect && dialect != undefined) {
        groupsToCheck = selectn('contextParameters.acls[0].aces', dialect).map((a) => a.username)
      }
    }

    if (!userGroups || !groupsToCheck) {
      return true
    }

    const arrayIntersection = userGroups.filter((value) => groupsToCheck.indexOf(value) !== -1)

    return arrayIntersection.length >= 1
  },
  isDialectPath: function(windowPath) {
    return windowPath.indexOf('/FV/Workspaces/Data/') !== -1
  },
  getDialectPathFromURLArray: function(url) {
    return decodeURI(url.slice(1, 7).join('/'))
  },
  switchWorkspaceSectionKeys: function(workspaceKey, area) {
    const row = proxiesKeys.find(function(mapping) {
      return mapping.workspace === workspaceKey
    })

    if (row) {
      if (area == 'sections') {
        return row.section
      }
      return row.workspace
    }

    return workspaceKey
  },
  getDialectGroups: function(aces = [], currentlyAssignedGroups = []) {
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

    aces.forEach(function(group, i) {
      const groupArray = group.username.split('_')
      if (group.username.match(/members|recorders|administrators/g) != null) {
        const groupLabel = groupArray.map((group) => StringHelpers.toTitleCase(group)).join(' ')

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
  },
  replaceAllWorkspaceSectionKeys: function(string, area) {
    const searchKey = area == 'sections' ? 'workspace' : 'section'
    const replaceKey = area == 'sections' ? 'section' : 'workspace'

    for (const proxyKey in proxiesKeys) {
      string = string.replace(new RegExp(proxiesKeys[proxyKey][searchKey], 'g'), proxiesKeys[proxyKey][replaceKey])
    }

    return string
  },
  filtersToNXQL: function(filterArray) {
    let nxqlFilterString = ''
    const nxqlGroups = {}

    const generateNXQLString = function(nxql, appliedFilter) {
      return nxql.replace(/\$\{value\}/g, appliedFilter)
    }

    for (const appliedFilterKey in filterArray) {
      const ak = Object.assign({}, filterArray[appliedFilterKey])
      if (ak && ak.hasOwnProperty('filterOptions') && ak.filterOptions && ak.filterOptions.hasOwnProperty('nxql')) {
        if (ak.appliedFilter === true) ak.appliedFilter = 1
        if (ak.appliedFilter === false) ak.appliedFilter = 0

        if (!ak.filterOptions.hasOwnProperty('nxqlGroup')) {
          nxqlFilterString +=
            ' ' +
            (ak.filterOptions.hasOwnProperty('operator') ? ak.filterOptions.operator : 'AND') +
            ' ' +
            generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter)
        } else {
          if (
            nxqlGroups.hasOwnProperty(ak.filterOptions.nxqlGroup) &&
            nxqlGroups[ak.filterOptions.nxqlGroup].length > 0
          ) {
            nxqlGroups[ak.filterOptions.nxqlGroup].push(generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter))
          } else {
            nxqlGroups[ak.filterOptions.nxqlGroup] = [generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter)]
          }
        }
      }
    }

    let appendGroupNXQL = ''

    for (const key in nxqlGroups) {
      appendGroupNXQL += ' AND (' + nxqlGroups[key].join(' OR ') + ')'
    }

    return nxqlFilterString + appendGroupNXQL
  },
  regex: {
    QUERY_PARAMS: /\?(.*)/,
    ANYTHING_BUT_SLASH: '([^/]*)',
    ANY_LANGUAGE_CODE: '(en|fr)',
    WORKSPACE_OR_SECTION: '(sections|Workspaces)',
    KIDS_OR_DEFAULT: '(kids|explore)',
  },
  userRegistrationRoles: [
    { value: 'teacher', text: 'I am a teacher/educator' },
    { value: 'student', text: 'I am a learner/student' },
    { value: 'learner-1', text: 'I am interested in learning MY language' },
    { value: 'learner-2', text: 'I am interested in learning A language' },
    { value: 'other', text: 'Other (please mention in comments)' },
  ],
}
