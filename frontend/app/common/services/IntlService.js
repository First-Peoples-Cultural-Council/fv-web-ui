// TODO: remove eslint-disable
/* eslint-disable */
import selectn from 'selectn'
import { vsprintf } from 'sprintf-js'
import cache from './MemoizationCache'

String.prototype.toUpperCaseWords = function() {
  return this.replace(/\w+/g, function(a) {
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
  })
}

String.prototype.toUpperCaseFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}

export default class IntlService {
  static $instance

  static get instance() {
    if (IntlService.$instance === null || IntlService.$instance === undefined) {
      IntlService.$instance = new IntlService()
    }

    return IntlService.$instance
  }

  localString = 'en'
  useEnglishAsFallback = true
  prefixFallbacks = true
  fallbackPrefix = ''
  fallbackSuffix = ''
  notFoundPrefix = ''
  notFoundSuffix = ''
  tagsRegex = /(<[^>]+>)(.*)(<\/[^>]+>)/i
  _localeLists = {}
  _fallbackLocale = ''

  constructor(startingLocales, locale, fallbackLocale) {
    this.localeString = locale
    this._fallbackLocale = fallbackLocale
    Object.assign(this._localeLists, startingLocales)

    // Fallback for code that can't access the redux store
    if (IntlService.$instance) {
      IntlService.$instance.localeString = locale
      IntlService.$instance._fallbackLocale = fallbackLocale
      Object.assign(this._localeLists, IntlService.$instance.startingLocales)
    } else {
      IntlService.$instance = this
    }
  }

  getLocaleFromNavigator() {
    if (navigator !== null && navigator !== undefined) {
      const ls = navigator.language
      if (ls[0] !== null && ls[0] !== undefined) {
        if (ls[0].search('en') >= 0) {
          return 'en'
        } else if (ls[1].search('fr') >= 0) {
          return 'fr'
        } else if (ls[1].search('sp') >= 0) {
          return 'sp'
        }
      }
    }
    return null
  }

  getLocaleFromSessionStorage() {
    if (localStorage !== null && localStorage !== undefined) {
      if (localStorage.hasOwnProperty('intl-service-locale')) {
        return localStorage.getItem('intl-service-locale')
      }
    }
    return null
  }

  setLocalStorageLocale(locale) {
    if (localStorage !== null && localStorage !== undefined) {
      localStorage.setItem('intl-service-locale', locale || 'en')
    }
    return this
  }

  fvLabelTrans(key, defaultStr, strCase, params, prepend, append, locale) {
    return this.translate(
      {
        key: key,
        default: defaultStr || '',
        params: params || [],
        case: strCase || null,
        locale: locale || this.localeString,
        prepend: prepend || '',
        append: append || '',
      },
      true
    )
  }

  trans(key, defaultStr, strCase, params, prepend, append, locale) {
    return this.translate({
      key: key,
      default: defaultStr || '',
      params: params || [],
      case: strCase || null,
      locale: locale || this.localeString,
      prepend: prepend || '',
      append: append || '',
    })
  }

  translateObject(obj) {
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
      return obj
    }
    const translatedObj = {}
    for (const key in obj) {
      const item = obj[key]
      if (item === null || item === undefined) {
        translatedObj[key] = null
      } else if (typeof item === 'string') {
        translatedObj[key] = this.searchAndReplace(item, { case: 'first' })
      } else if (typeof item === 'object') {
        translatedObj[key] = this.translateObject(item)
      }
    }
    return translatedObj
  }

  translate(translateData, returnTranslationInfo) {
    const postProcessResult = function(result, _translateData) {
      if (result !== null) {
        const charCase = _translateData.case || null
        const params = _translateData.params || []

        // lets handle any string replacements
        // if theres something to put in
        if (result.search('%s') >= 0) {
          result = vsprintf(result, params)
        }

        if (charCase !== null) {
          if (charCase === 'upper') {
            result = (result + '').toUpperCase()
          } else if (charCase === 'lower') {
            result = (result + '').toLowerCase()
          } else if (charCase === 'words') {
            result = (result + '').toLowerCase().toUpperCaseWords()
          } else if (charCase === 'first') {
            result = (result + '').toLowerCase().toUpperCaseFirst()
          }
        }

        result = (result + '').replace('&amp;', '&')
        result = (result + '').replace('&AMP;', '&')

        const postProcessSwaps = function(_result) {
          const swapMatches = (_result + '').match(/\$\{([a-zA-Z0-9\.\_]+)\}/g)
          if (swapMatches !== null && swapMatches.length > 0) {
            for (const idx in swapMatches) {
              const match = swapMatches[idx]
              const matchKey = swapMatches[idx].substr(2, swapMatches[idx].length - 3)
              const matchTranslated = self.translate({
                key: matchKey.toLowerCase(),
                default: null,
                case: _translateData.case || null,
              })

              if (matchTranslated !== null && matchTranslated !== undefined && (match + '').length > 0) {
                _result = _result.replace(match, matchTranslated)
              }
            }
          }

          return _result
        }

        _translateData.prepend = _translateData.prepend || ''
        _translateData.append = _translateData.append || ''

        result = _translateData.prepend + postProcessSwaps(result) + _translateData.append
      }

      return result
    }

    const processReturn = (result) => {
      if (returnTranslationInfo) {
        return [result, usedFallback, actualUsedKey]
      } else {
        return result
      }
    }

    if (typeof translateData === 'string') {
      translateData = { key: translateData, default: translateData }
    }

    let translateDataKey = translateData.key || null

    if (Array.isArray(translateDataKey)) {
      translateDataKey = translateDataKey.join('.')
    }

    let usedFallback = false
    let actualUsedKey = translateDataKey

    const self = this

    if (translateDataKey !== null) {
      let res = null
      // if it's a simple string, lets first check general
      if (((translateDataKey + '').match(/\./g) || []).length === 0) {
        // single entry, let's check general first
        res = selectn((translateData.locale || this.localeString) + '.general.' + translateDataKey, this._localeLists)
        actualUsedKey = 'general.' + translateDataKey
      }

      if (res === null || res === undefined) {
        res = selectn((translateData.locale || this.localeString) + '.' + translateDataKey, this._localeLists)
      }

      if (res !== undefined) {
        return processReturn(postProcessResult(res, translateData))
      }
    }

    if (this._fallbackLocale && (translateData.locale || this.localeString) !== this._fallbackLocale) {
      translateData.locale = this._fallbackLocale
      usedFallback = true
      return processReturn(this.fallbackPrefix + this.translate(translateData) + this.fallbackSuffix)
    }

    return processReturn(postProcessResult(translateData.default || null, translateData))
  }

  getLocale(locale) {
    if (this._localeLists[locale] !== undefined) {
      return this._localeLists[locale]
    }

    return null
  }

  get locale() {
    return this.localeString
  }

  set locale(locale) {
    this.localeString = locale
    this.setLocalStorageLocale(locale)
  }

  setLocale(locale) {
    this.localeString = locale
  }

  searchAndReplace(string, translateData) {
    // no point in searching for nothing
    if (string === null || string === undefined || string === '' || (string + '').length === 0) {
      return ''
    }

    const cacheName = 'searchAndReplace'
    const cacheKey = `${string}:${translateData}`

    if (cache.contains(cacheName, cacheKey)) {
      return cache.get(cacheName, cacheKey)
    }

    // lets check for tags
    if (this.tagsRegex.test(string)) {
      return this.searchAndReplaceWithTags(string, translateData)
    }

    translateData = Object.assign(
      {
        key: null,
        default: null,
        params: [],
        locale: this.localeString,
      },
      translateData || {}
    )

    const originalString = string + ''

    const keyData = this.locateEnglishKey(string)
    if (keyData !== null && keyData !== undefined) {
      translateData.params = translateData.params.concat(keyData.params || [])
      translateData = Object.assign(translateData, keyData)
      translateData.default = null
      const translatedString = this.translate(translateData)
      if (translatedString !== null && translateData !== undefined) {
        cache.put(cacheName, cacheKey, translatedString)
        return translatedString
      }
    }

    const notFoundResult = this.notFoundPrefix + originalString + this.notFoundSuffix
    cache.put(cacheName, cacheKey, notFoundResult)
    return notFoundResult
  }

  searchAndReplaceWithTags(string, translateData) {
    // no point in searching for nothing
    if (string === null || string === undefined || string === '' || (string + '').length === 0) {
      return ''
    }

    const cacheName = 'searchAndReplaceWithTags'
    const cacheKey = `${string}:${translateData}`

    if (cache.contains(cacheName, cacheKey)) {
      return cache.get(cacheName, cacheKey)
    }

    // make sure there are tags
    if (!this.tagsRegex.test(string)) {
      return this.searchAndReplace(string, translateData)
    }

    const originalString = string + ''
    translateData = Object.assign(
      {
        key: null,
        default: null,
        params: [],
        locale: this.localeString,
      },
      translateData || {}
    )

    const tags = { start: '', end: '' }
    const pieces = this.tagsRegex.exec(originalString)

    if (pieces.length > 3) {
      tags.start = pieces[1]
      tags.end = pieces[3]
      const taglessString = pieces[2]
      const taglessKeyData = this.locateEnglishKey(taglessString)

      if (taglessKeyData !== null && taglessKeyData !== undefined) {
        const taglessResult = this.translate(Object.assign(translateData, taglessKeyData, { default: null }))
        if (taglessResult !== null && taglessResult !== undefined && (taglessResult + '').toLowerCase() !== 'null') {
          // we found something
          const result = tags.start + taglessResult + tags.end
          cache.put(cacheName, cacheKey, result)
          return result
        }
      }

      // still nothing, lets check with tags
      const keyData = this.locateEnglishKey(originalString)
      if (keyData !== null && keyData !== undefined) {
        const result = this.translate(Object.assign(translateData, keyData, { default: null }))
        if (result !== null && result !== undefined && (result + '').toLowerCase() !== 'null') {
          cache.put(cacheName, cacheKey, result)
          return result
        }
      }
    }

    const notFoundResult = this.notFoundPrefix + originalString + this.notFoundSuffix
    cache.put(cacheName, cacheKey, notFoundResult)
    return notFoundResult
  }

  locateAndReplace(string, translateData) {
    return this.searchAndReplace(string, translateData)
  }

  locateEnglishKey(string, baseKey, searchRegex) {
    const cacheName = 'locateEnglishKey'
    const cacheKey = `${string}:${baseKey}:${searchRegex}`

    if (cache.contains(cacheName, cacheKey)) {
      return cache.get(cacheName, cacheKey)
    }

    baseKey = baseKey || 'en'
    const searchData = selectn(baseKey, this._localeLists)
    if (searchData !== null && typeof searchData === 'object') {
      for (const key in searchData) {
        const res = this.locateEnglishKey(string, baseKey + '.' + key, searchRegex)
        if (res !== null && res !== undefined) {
          cache.put(cacheName, cacheKey, res)
          return res
        }
      }
    } else if (searchData !== null) {
      const hasRegex = (searchData + '').search('%s') >= 0
      if (!searchRegex && !hasRegex) {
        // normal string comparison
        if (this.normalizeString(string) == this.normalizeString(searchData)) {
          const result = {
            key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
            params: [],
          }
          cache.put(cacheName, cacheKey, result)
          return result
        }
      } else if (searchRegex && hasRegex) {
        // search the regular expression
        const regex = new RegExp((searchData + '').replace(/%s/g, '(.*)'), 'i')
        if (regex.test(string + '')) {
          const pieces = regex.exec(string + '')
          const params = []
          for (let i = 0; i < ((searchData + '').match(/%s/g) || []).length; i++) {
            if (pieces[i + 1] !== null && pieces[i + 1] !== undefined) {
              params.push(pieces[i + 1])
            }
          }
          const result = {
            key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
            params: params || [],
          }
          cache.put(cacheName, cacheKey, result)
          return result
        }
      }
    }

    // try regex IF on base
    if (!searchRegex && baseKey === 'en') {
      // nothing found in regular strings, lets try regex
      return this.locateEnglishKey(string, 'en', true)
    }

    cache.put(cacheName, cacheKey, null)
    return null
  }

  locateEnglishKey2(string, baseKey) {
    const cacheName = 'locateEnglishKey2'
    const cacheKey = `${string}:${baseKey}`

    if (cache.contains(cacheName, cacheKey)) {
      return cache.get(cacheName, cacheKey)
    }

    baseKey = baseKey || 'en'
    const searchData = selectn(baseKey, this._localeLists)
    if (searchData !== null && typeof searchData === 'object') {
      if (searchData.general !== null && typeof searchData.general === 'object') {
        // lets loop through general first
        for (const key in searchData.general) {
          const res = this.locateEnglishKey(string, baseKey + '.general.' + key)
          if (res !== null && res !== undefined) {
            cache.put(cacheName, cacheKey, res)
            return res
          }
        }
      }
      // we still have more to look through
      for (const key in searchData) {
        const res = this.locateEnglishKey(string, baseKey + '.' + key)
        if (res !== null && res !== undefined) {
          cache.put(cacheName, cacheKey, res)
          return res
        }
      }
    } else if (searchData !== null) {
      if (this.normalizeString(string) == this.normalizeString(searchData)) {
        const result = {
          key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
          params: [],
        }
        cache.put(cacheName, cacheKey, result)
        return result
      }
      // OK, so there may not have been a match on those strings BUT
      // what about matching against %s strings?
      // lets compare the lowercase versions, IF the %s is present in the string
      if ((searchData + '').search('%s') >= 0) {
        const regex = new RegExp(searchData.replace(/%s/g, '(.*)'), 'i')
        if (regex.test(string + '')) {
          const pieces = regex.exec(string + '')
          const params = []
          for (let i = 0; i < ((searchData + '').match(/%s/g) || []).length; i++) {
            if (pieces[i + 1] !== null && pieces[i + 1] !== undefined) {
              params.push(pieces[i + 1])
            }
          }
          const result = {
            key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
            params: params || [],
          }
          cache.put(cacheName, cacheKey, result)
          return result
        }
      }
    }

    cache.put(cacheName, cacheKey, null)
    return null
  }

  normalizeString(string) {
    return (string + '').replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
  }

  addLocaleDictionary(path, list) {
    this._localeLists[path] = list
  }
}
// TODO: remove eslint-disable
/* eslint-enable */
