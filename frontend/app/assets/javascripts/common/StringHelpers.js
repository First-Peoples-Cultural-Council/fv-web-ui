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
import IntlService from 'views/services/intl'

export const CLEAN_NXQL = 'NXQL'
export const CLEAN_FULLTEXT = 'fulltext'
export const CLEAN_ID = 'CLEAN_ID'

export default {
  clean: (str, mode = CLEAN_NXQL) => {
    let _str

    if (!str) return str

    if (mode === CLEAN_NXQL) {
      // Escape single quotes and URL decode
      _str = decodeURIComponent(str.replace(/'/g, "\\'"))

      // Escape '&' operator
      _str = _str.replace(/&/g, '%26')
    }

    if (mode === CLEAN_FULLTEXT) {
      // Escape single quotes and URL decode
      _str = str.replace(/'/g, "\\'")

      // Replace colon
      _str = _str.replace(/:/g, '\\:')

      // Escape double quotes
      _str = _str.replace(/"/g, '\\"')

      // Remove parentheses
      _str = _str.replace(/[()]/g, '')

      // Escape single quotes and URL decode
      _str = _str.replace(/!/g, '\\!')

      // Escape colon
      _str = decodeURIComponent(_str)
    }

    if (mode === CLEAN_ID) {
      // Swap : to -
      _str = str.replace(/:/g, '-')
      // Swap [] to empty string
      _str = _str.replace(/[[\]]/g, '')
    }

    return _str
  },
  extractErrorMessage: (jsonError) => {
    let errorMessage = jsonError.message

    if (jsonError.message !== null && jsonError.message.indexOf(': ') !== -1) {
      errorMessage = jsonError.message.split(': ')[1]
      errorMessage =
        IntlService.instance.translate({
          key: 'error',
          default: 'Error',
          append: ': ',
        }) + IntlService.instance.searchAndReplace(errorMessage)
    }

    return errorMessage
  },
  getReadableFileSize: (size) => {
    const e = (Math.log(size) / Math.log(1e3)) | 0 // TODO: Confirm use of `Bitwise OR`
    return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B'
  },
  toTitleCase: (string) => {
    return string[0].toUpperCase() + string.substring(1)
  },
  randomIntBetween: (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min)
  },
  formatUTCDateString: (dateString) => {
    let dayDesc
    const d = new Date(dateString)
    // let m = [
    //     intl.trans('jan', 'Jan', 'first'),
    //     intl.trans('feb', 'Feb', 'first'),
    //     intl.trans('mar', 'Mar', 'first'),
    //     intl.trans('apr', 'Apr', 'first'),
    //     intl.trans('may', 'May', 'first'),
    //     intl.trans('jun', 'Jun', 'first'),
    //     intl.trans('jul', 'Jul', 'first'),
    //     intl.trans('aug', 'Aug', 'first'),
    //     intl.trans('sept', 'Sep', 'first'),
    //     intl.trans('oct', 'Oct', 'first'),
    //     intl.trans('nov', 'Nov', 'first'),
    //     intl.trans('dec', 'Dec', 'first')
    // ];
    // @todo translate using the above?
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    switch (d.getDate().toString()[d.getDate().toString().length - 1]) {
      case '1':
        dayDesc = 'st'
        break

      case '2':
        dayDesc = 'nd'
        break

      case '3':
        dayDesc = 'rd'
        break

      default:
        dayDesc = 'th'
    }

    return (
      m[d.getMonth()] +
      ' ' +
      d.getDate() +
      dayDesc +
      ', ' +
      d.getFullYear() +
      ' @ ' +
      ('0' + d.getUTCHours()).slice(-2) +
      ':' +
      ('0' + d.getUTCMinutes()).slice(-2)
    )
  },
  formatLocalDateString: (dateString) => {
    const d = new Date(dateString)
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let hours = d.getHours()
    let minutes = d.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    const strTime = hours + ':' + minutes + ' ' + ampm

    return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + strTime
  },
  isUUID: (str) => {
    if (!str) {
      return false
    }

    return str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  },
  queryStringToObject: (str, skipDecode = false) => {
    const _str = str.substring(str.indexOf('?') + 1).split('&')
    const params = {}
    let pair
    const d = skipDecode ? (s) => s : decodeURIComponent
    for (let i = _str.length - 1; i >= 0; i--) {
      pair = _str[i].split(/=(.+)/)
      params[d(pair[0])] = d(pair[1] || '')
    }

    return params
  },
}
