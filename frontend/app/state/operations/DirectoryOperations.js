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
import StringHelpers from 'common/StringHelpers'

import request from 'request'

import BaseOperations from 'operations/BaseOperations'
import IntlService from 'common/services/IntlService'

const TIMEOUT = 60000

export default class DirectoryOperations {
  /**
   * Gets one or more documents based on a path or id.
   * Allows for additional complex queries to be executed.
   */
  static getDocumentsViaAPI(path = '', headers) {
    return new Promise((resolve, reject) => {
      const options = {
        url: path,
        headers: headers,
      }

      request(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          if (Object.prototype.hasOwnProperty.call(error, 'response')) {
            error.response.json().then((jsonError) => {
              reject(StringHelpers.extractErrorMessage(jsonError))
            })
          } else {
            let errorMessage = `Attempting to retrieve ${path}`

            if (error) {
              errorMessage += ' has resulted in '
            } else {
              errorMessage += ' - '
            }

            return reject(
              errorMessage +
                (error ||
                  IntlService.instance.translate({
                    key: 'operations.could_not_access_server',
                    default: 'Could not access server',
                    case: 'first',
                  }))
            )
          }
        } else {
          resolve(JSON.parse(body))
        }

        reject('An unknown error has occured.')
      })

      setTimeout(() => {
        reject('Server timeout while attempting to get documents.')
      }, TIMEOUT)
    })
  }

  static getFromAPI(path) {
    return new Promise((resolve, reject) => {
      request.get({ url: path, json: true }, function handleResponse(error, response, body) {
        if (error) {
          if (Object.prototype.hasOwnProperty.call(error, 'response')) {
            error.response.json().then((jsonError) => {
              return reject(StringHelpers.extractErrorMessage(jsonError))
            })
          } else {
            return reject(error)
          }
        }
        return resolve(body)
      })
      setTimeout(() => {
        reject('Server timeout while attempting to get documents.')
      }, TIMEOUT)
    })
  }

  // Expects a path string and a javascript object with key value pairs for the endpoint params
  static postToAPI(path, bodyObject) {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: path,
          body: JSON.stringify(bodyObject),
          headers: { 'content-type': 'application/json' },
        },
        function handleResponse(error, response, body) {
          if (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'response')) {
              error.response.json().then((jsonError) => {
                return reject(StringHelpers.extractErrorMessage(jsonError))
              })
            } else {
              return reject(error)
            }
          }
          return resolve(body)
        }
      )
      setTimeout(() => {
        reject('Server timeout while attempting to send request.')
      }, TIMEOUT)
    })
  }

  static putToAPI(path, bodyObject = {}) {
    return new Promise((resolve, reject) => {
      request.put(
        {
          url: path,
          body: JSON.stringify(bodyObject),
          headers: { 'content-type': 'application/json' },
        },
        function handleResponse(error, response, body) {
          if (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'response')) {
              error.response.json().then((jsonError) => {
                return reject(StringHelpers.extractErrorMessage(jsonError))
              })
            } else {
              return reject(error)
            }
          }
          return resolve(body)
        }
      )
      setTimeout(() => {
        reject('Server timeout while attempting to send request.')
      }, TIMEOUT)
    })
  }

  /**
   * Gets one or more documents based on a path or id.
   * Allows for additional complex queries to be executed.
   */
  static getDocuments(path = '', type = 'Document', queryAppend = ' ORDER BY dc:title', headers = null, params = null) {
    const defaultParams = {}
    const defaultHeaders = {}

    const _params = Object.assign(defaultParams, params)
    const _headers = Object.assign(defaultHeaders, headers)

    const properties = BaseOperations.getProperties()

    const _queryAppend = queryAppend

    let requestBody

    // Switch between direct REST access and controlled mode
    if (path.indexOf('/api') === 0) {
      // NOTE: Do not escape single quotes in this mode
      requestBody = path.replace('/api/v1', '')
      return new Promise((resolve, reject) => {
        properties.client
          .request(requestBody, _params)
          .get(_headers)
          .then((docs) => {
            resolve(docs)
          })
          .catch((error) => {
            if (Object.prototype.hasOwnProperty.call(error, 'response')) {
              error.response.json().then((jsonError) => {
                reject(StringHelpers.extractErrorMessage(jsonError))
              })
            } else {
              return reject(
                error ||
                  IntlService.instance.translate({
                    key: 'operations.could_not_access_server',
                    default: 'Could not access server',
                    case: 'first',
                  })
              )
            }
          })

        setTimeout(() => {
          reject('Server timeout while attempting to get documents.')
        }, TIMEOUT)
      })
    }

    const where = StringHelpers.isUUID(path)
      ? `ecm:parentId = '${path}'`
      : `ecm:path STARTSWITH '${StringHelpers.clean(path)}'`

    const nxqlQueryParams = Object.assign(
      _params,
      {
        language: 'NXQL',
      },
      StringHelpers.queryStringToObject(
        `?query=SELECT * FROM ${type} WHERE ${where} AND ecm:isVersion = 0 AND ecm:isTrashed = 0 ${_queryAppend}`,
        true
      )
    )

    /*
     WORKAROUND: DY @ 17-04-2019:

     This is a workaround for elasticsearch returning no results for queries that start with
     Instead of querying elasticsearch, do a database query in this occurence.

     TODO: Figure out what elasticsearch configuration is appropriate here.

     starts_with_query is set in learn/words/list-view, and learn/phrases/list-view
     */
    let endPointToUse = 'Document.EnrichedQuery'

    if (Object.prototype.hasOwnProperty.call(nxqlQueryParams, 'starts_with_query')) {
      endPointToUse = 'Document.Query'
      if (nxqlQueryParams.starts_with_query === 'Document.CustomOrderQuery') {
        endPointToUse = 'Document.CustomOrderQuery'
      }
    }

    return new Promise((resolve, reject) => {
      properties.client
        .operation(endPointToUse)
        .params(nxqlQueryParams)
        .execute(_headers)
        .then((docs) => {
          resolve(docs)
        })
        .catch((error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'response')) {
            error.response.json().then((jsonError) => {
              reject(StringHelpers.extractErrorMessage(jsonError))
            })
          } else {
            return reject(
              error ||
                IntlService.instance.translate({
                  key: 'operations.could_not_access_server',
                  default: 'Could not access server',
                  case: 'first',
                })
            )
          }
        })

      setTimeout(() => {
        reject('Server timeout while attempting to get documents.')
      }, TIMEOUT)
    })
  }

  static getDocumentsViaCustomAPI(path) {
    const properties = BaseOperations.getProperties()

    return new Promise((resolve, reject) => {
      properties.client
        .request(path)
        .get([])
        .then((docs) => {
          resolve(docs)
        })
        .catch((error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'response')) {
            error.response.json().then((jsonError) => {
              reject(StringHelpers.extractErrorMessage(jsonError))
            })
          } else {
            return reject(
              error ||
                IntlService.instance.translate({
                  key: 'operations.could_not_access_server',
                  default: 'Could not access server',
                  case: 'first',
                })
            )
          }
        })
    })
  }

  static getDocumentsViaPageProvider(
    pageProvider = '',
    type = 'Document', // eslint-disable-line
    headers = null,
    params = null
  ) {
    // const queryParams = []

    const defaultParams = { pageProvider: pageProvider }
    const defaultHeaders = {}

    const _params = Object.assign(defaultParams, params)
    const _headers = Object.assign(defaultHeaders, headers)

    const properties = BaseOperations.getProperties()

    return new Promise((resolve, reject) => {
      properties.client
        .headers(_headers)
        .repository()
        .query(_params)
        .then((docs) => {
          resolve(docs)
        })
        .catch(() => {
          reject(
            IntlService.instance.translate({
              key: 'operations.could_not_access_server',
              default: 'Could not access server',
              case: 'first',
            })
          )
        })
    })
  }

  static getDirectory(name = '', pageSize = 100) {
    const properties = BaseOperations.getProperties()

    return new Promise((resolve, reject) => {
      properties.client
        .directory(name)
        .fetchAll({ queryParams: { pageSize: pageSize } })
        .then((directory) => {
          resolve(directory)
        })
        .catch(() => {
          reject(
            IntlService.instance.translate({
              key: 'operations.could_not_retrieve_directory',
              default: 'Could not retrieve directory',
              case: 'first',
            })
          )
        })
    })
  }

  /**
   * Get all documents of a certain type based on a path
   * These documents are expected to contain other entries
   * E.g. FVFamily, FVLanguage, FVDialect
   */
  getDocumentsByPath(path = '', headers = null, params = null) {
    // Expose fields to promise
    const client = this.client
    const selectDefault = this.selectDefault
    const domain = BaseOperations.getProperties().domain

    const _path = StringHelpers.clean(path)

    // Initialize and empty document list from type
    const documentList = new this.directoryTypePlural(null)

    return new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      (resolve, reject) => {
        const defaultParams = {
          query: `SELECT * FROM ${documentList.model.prototype.entityTypeName} WHERE (ecm:path STARTSWITH '/${domain}${_path}' AND ${selectDefault}) ORDER BY dc:title`,
        }

        const defaultHeaders = {}

        const _params = Object.assign(defaultParams, params)
        const _headers = Object.assign(defaultHeaders, headers)

        client
          .operation('Document.Query')
          .params(_params)
          .execute(_headers)
          .then((response) => {
            if (response.entries && response.entries.length > 0) {
              documentList.add(response.entries)
              documentList.totalResultSize = response.totalSize

              resolve(documentList)
            } else {
              reject(
                IntlService.instance.translate({
                  key: 'operations.no_found',
                  default: `No ${documentList.model.prototype.entityTypeName} found`,
                  params: [documentList.model.prototype.entityTypeName],
                  case: 'first',
                  append: '!',
                })
              )
            }
          })
          .catch((error) => {
            throw error
          })
      }
    )
  }

  static getDocumentsViaResultSetQuery(
    path = '',
    type = 'Document',
    select = '*',
    queryAppend = ' ORDER BY dc:title',
    headers = null,
    params = null
  ) {
    const defaultHeaders = {}
    const defaultParams = {}

    const _headers = Object.assign(defaultHeaders, headers)

    const properties = BaseOperations.getProperties()

    const endPointToUse = 'Repository.ResultSetQuery'
    const _params = Object.assign(defaultParams, params)

    const where = StringHelpers.isUUID(path)
      ? `ecm:parentId = '${path}'`
      : `ecm:path STARTSWITH '${StringHelpers.clean(path)}'`

    const _queryAppend = queryAppend

    const nxqlQueryParams = Object.assign(
      _params,
      {
        language: 'NXQL',
      },
      StringHelpers.queryStringToObject(
        `?query=SELECT ${select} FROM ${type} WHERE ${where} AND ecm:isVersion = 0 AND ecm:isTrashed = 0 ${_queryAppend}`,
        true
      )
    )

    return new Promise((resolve, reject) => {
      properties.client
        .operation(endPointToUse)
        .params(nxqlQueryParams)
        .execute(_headers)
        .then((docs) => {
          resolve(docs)
        })
        .catch((error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'response')) {
            error.response.json().then((jsonError) => {
              reject(StringHelpers.extractErrorMessage(jsonError))
            })
          } else {
            return reject(
              error ||
                IntlService.instance.translate({
                  key: 'operations.could_not_access_server',
                  default: 'Could not access server',
                  case: 'first',
                })
            )
          }
        })

      setTimeout(() => {
        reject('Server timeout while attempting to get documents.')
      }, TIMEOUT)
    })
  }
}
