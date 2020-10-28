// import selectn from 'selectn'
import en from 'common/locale/locale.en.json'
import fr from 'common/locale/locale.fr.json'
import sp from 'common/locale/locale.sp.json'
// import { sprintf, vsprintf } from 'sprintf-js'
import IntlService from 'common/services/IntlService'
/* eslint-disable */
String.prototype.toUpperCaseWords = function() {
  return this.replace(/\w+/g, function(a) {
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
  })
}

String.prototype.toUpperCaseFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
/* eslint-enable */
export default class LocaleChecker {
  locales = {}

  constructor() {
    this.locales.en = en
    this.locales.fr = fr
    this.locales.sp = sp
  }

  test() {
    this.testLoop(this.locales.en, this.locales.fr, this.locales.sp, null)
  }

  testLoop(enJson, frJson, spJson, baseKey) {
    // eslint-disable-next-line
    console.group('Key: ' + baseKey)
    for (const key in enJson) {
      const enValue = enJson[key]
      const frValue = frJson[key]
      const spValue = spJson[key]
      const newBaseKey = baseKey === null ? key : baseKey + '.' + key
      // eslint-disable-next-line
      console.debug(newBaseKey)
      if (enValue !== null && typeof enValue === 'object') {
        // console.debug(newBaseKey, enValue, frValue, spValue);
        this.testLoop(enValue, frValue, spValue, newBaseKey)
      } else {
        // console.info(newBaseKey, enValue, frValue, spValue);
        const options = {
          key: newBaseKey,
          locale: 'en',
          default: 'NOT FOUND',
        }
        // eslint-disable-next-line
        console.info('ENGLISH', IntlService.instance.translate(options))
        // eslint-disable-next-line
        console.info('FRENCH:', IntlService.instance.translate(Object.assign(options, { locale: 'fr' })))
        // eslint-disable-next-line
        console.info('SPANISH', IntlService.instance.translate(Object.assign(options, { locale: 'sp' })))
      }
    }
    // eslint-disable-next-line
    console.groupEnd()
  }
}
