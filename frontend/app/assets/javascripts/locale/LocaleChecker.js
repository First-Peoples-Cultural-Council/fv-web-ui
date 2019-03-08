import selectn from 'selectn';
import en from 'views/../locale/locale.en.json';
import fr from 'views/../locale/locale.fr.json';
import sp from 'views/../locale/locale.sp.json';
import {sprintf, vsprintf} from 'sprintf-js';
import IntlService from 'views/services/intl';

String.prototype.toUpperCaseWords = function () {
    return this.replace(/\w+/g, function (a) {
        return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
    })
}

String.prototype.toUpperCaseFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
export default class LocaleChecker {
    locales = {};

    constructor() {
        this.locales.en = en;
        this.locales.fr = fr;
        this.locales.sp = sp;
    }

    test() {
        this.testLoop(this.locales.en, this.locales.fr, this.locales.sp, null);
    }

    testLoop(enJson, frJson, spJson, baseKey) {
        console.group('Key: ' + baseKey);
        for (var key in enJson) {
            var enValue = enJson[key];
            var frValue = frJson[key];
            var spValue = spJson[key];
            var newBaseKey = baseKey === null ? key : baseKey + '.' + key;
            console.debug(newBaseKey);
            if (enValue !== null && typeof enValue === 'object') {
                // console.debug(newBaseKey, enValue, frValue, spValue);
                this.testLoop(enValue, frValue, spValue, newBaseKey);
            } else {
                // console.info(newBaseKey, enValue, frValue, spValue);
                var options = {
                    key: newBaseKey,
                    locale: 'en',
                    default: 'NOT FOUND',
                };
                console.info('ENGLISH', IntlService.instance.translate(options));
                console.info('FRENCH:', IntlService.instance.translate(Object.assign(options, {locale: 'fr'})));
                console.info('SPANISH', IntlService.instance.translate(Object.assign(options, {locale: 'sp'})));
            }
        }
        console.groupEnd();
    }
}