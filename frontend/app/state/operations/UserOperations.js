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
// import Nuxeo from 'nuxeo'

// import StringHelpers from 'common/StringHelpers'
import BaseOperations from 'operations/BaseOperations'
import IntlService from 'common/services/IntlService'

export default class UserOperations {
  /**
   * Gets current user object
   */
  static getCurrentUser(headers = {}, params = {}) {
    const properties = BaseOperations.getProperties()

    return new Promise((resolve, reject) => {
      properties.client
        .request('/me/', params)
        .get(headers)
        .then((userObj) => {
          resolve(userObj)
        })
        .catch((/*error*/) => {
          reject(
            IntlService.instance.translate({
              key: 'operations.could_not_retrieve_current_user',
              default: 'Could not retrieve current user',
              case: 'first',
            }) + '.'
          )
        })
    })
  }

  static fvUpdateUser(username = '', languagePreference) {
    const properties = BaseOperations.getProperties()

    return properties.client
      .operation('FVUpdateUser')
      .params({
        username,
        languagePreference,
        groupsAction: 'update',
      })
      .execute()
  }
}
