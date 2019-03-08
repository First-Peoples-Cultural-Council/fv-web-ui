import selectn from 'selectn';
import en from 'views/../locale/locale.en.json';
import fr from 'views/../locale/locale.fr.json';
import sp from 'views/../locale/locale.sp.json';
import {sprintf, vsprintf} from 'sprintf-js';

String.prototype.toUpperCaseWords = function () {
    return this.replace(/\w+/g, function (a) {
        return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
    })
}

String.prototype.toUpperCaseFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
export default class IntlService {
    static $instance;
    static locales = {};

    static get instance() {
        if (IntlService.$instance === null || IntlService.$instance === undefined) {
            IntlService.$instance = new IntlService();
        }

        return IntlService.$instance;
    }

    localString = 'en';
    useEnglishAsFallback = true;
    prefixFallbacks = true;
    fallbackPrefix = '';
    fallbackSuffix = '';
    notFoundPrefix = '';
    notFoundSuffix = '';
    tagsRegex = /(<[^>]+>)(.*)(<\/[^>]+>)/i;

    constructor() {
        var localStorageLocale = this.getLocaleFromSessionStorage();
        if (localStorageLocale === null) {
            var navigatorLocale = this.getLocaleFromNavigator();
            if (navigatorLocale !== null) {
                this.localeString = navigatorLocale || 'en';
            }
        } else {
            this.localeString = localStorageLocale || 'en';
        }
        this.loadLocales();
    }

    getLocaleFromNavigator() {
        if (navigator !== null && navigator !== undefined) {
            var ls = navigator.language;
            if (ls[0] !== null && ls[0] !== undefined) {
                if (ls[0].search('en') >= 0) {
                    return 'en';
                } else if (ls[1].search('fr') >= 0) {
                    return 'fr';
                } else if (ls[1].search('sp') >= 0) {
                    return 'sp';
                }
            }
        }
        return null;
    }

    getLocaleFromSessionStorage() {
        if (localStorage !== null && localStorage !== undefined) {
            if (localStorage.hasOwnProperty('intl-service-locale')) {
                return localStorage.getItem('intl-service-locale');
            }
        }
        return null;
    }

    setLocalStorageLocale(locale) {
        if (localStorage !== null && localStorage !== undefined) {
            localStorage.setItem('intl-service-locale', locale || 'en');
        }
        return this;
    }

    trans(key, defaultStr, strCase, params, prepend, append, locale) {
        return this.translate({
            key: key,
            default: defaultStr || '',
            params: params || [],
            case: strCase || null,
            locale: locale || this.localeString,
            prepend: prepend || '',
            append: append || ''
        });
    }

    translateObject(obj) {
        if (typeof obj !== 'object' || obj === null || obj === undefined) {
            return obj;
        }
        var translatedObj = {};
        for (var key in obj) {
            var item = obj[key];
            if (item === null || item === undefined) {
                translatedObj[key] = null;
            } else if (typeof item === 'string') {
                translatedObj[key] = this.searchAndReplace(item, {case: 'first'})
            } else if (typeof item === 'object') {
                translatedObj[key] = this.translateObject(item);
            }
        }
        return translatedObj;
    }

    translate(translateData) {

        if (typeof translateData === 'string') {
            translateData = {key: translateData, default: translateData};
        }

        let key = translateData.key || null;
        if (Array.isArray(key)) {
            key = key.join('.');
        }
        let self = this;
        let postProcessResult = function (result, translateData) {
            if (result !== null) {
                var charCase = translateData.case || null;
                var params = translateData.params || [];

                // lets handle any string replacements
                // if theres something to put in
                if (result.search('%s') >= 0) {
                    result = vsprintf(result, params);
                }

                if (charCase !== null) {
                    if (charCase === 'upper') {
                        result = (result + '').toUpperCase();
                    } else if (charCase === 'lower') {
                        result = (result + '').toLowerCase();
                    } else if (charCase === 'words') {
                        result = ((result + '').toLowerCase()).toUpperCaseWords();
                    } else if (charCase === 'first') {
                        result = ((result + '').toLowerCase()).toUpperCaseFirst();
                    }
                }

                result = (result + '').replace('&amp;', '&');
                result = (result + '').replace('&AMP;', '&');

                let postProcessSwaps = function (result) {
                    var swapMatches = (result + '').match(/\$\{([a-zA-Z0-9\.\_]+)\}/g);
                    if (swapMatches !== null && swapMatches.length > 0) {
                        for (var idx in swapMatches) {
                            var match = swapMatches[idx],
                                matchKey = swapMatches[idx].substr(2, swapMatches[idx].length - 3),
                                matchTranslated = self.translate({
                                    key: matchKey.toLowerCase(),
                                    default: null,
                                    case: translateData.case || null
                                });

                            if (matchTranslated !== null && matchTranslated !== undefined && (match + '').length > 0) {
                                result = result.replace(match, matchTranslated);
                            }
                        }
                    }

                    return result;
                }

                translateData.prepend = translateData.prepend || '';
                translateData.append = translateData.append || '';

                result = translateData.prepend + postProcessSwaps(result) + translateData.append;
            }

            return result;
        };

        if (key !== null) {
            var res = null;
            // if it's a simple string, lets first check general
            if (((key + '').match(/\./g) || []).length === 0) {
                // single entry, let's check general first
                res = selectn((translateData.locale || this.localeString) + '.general.' + key, IntlService.locales);
            }

            if (res === null || res === undefined) {
                res = selectn((translateData.locale || this.localeString) + '.' + key, IntlService.locales);
            }

            if (res !== undefined) {
                return postProcessResult(res, translateData);
            }
        }

        if (this.useEnglishAsFallback && (translateData.locale || this.localeString) !== 'en') {
            translateData.locale = 'en';
            return this.fallbackPrefix + this.translate(translateData) + this.fallbackSuffix;
        }

        //console.warn('INTL>>Translation not found', translateData);
        return postProcessResult(translateData.default || null, translateData);
    }

    getLocale(locale) {
        if (IntlService.locales[locale] !== undefined) {
            return IntlService.locales[locale];
        }

        return null;
    }

    get locale() {
        return this.localeString;
    }

    set locale(locale) {
        this.localeString = locale;
        this.setLocalStorageLocale(locale);
    }

    setLocale(locale) {
        this.localeString = locale;
    }

    searchAndReplace(string, translateData) {
        // no point in searching for nothing
        if (string === null || string === undefined || string === '' || (string + '').length === 0) {
            return '';
        }

        // lets check for tags
        if (this.tagsRegex.test(string)) {
            return this.searchAndReplaceWithTags(string, translateData);
        }

        translateData = Object.assign({
            key: null,
            default: null,
            params: [],
            locale: this.localeString
        }, translateData || {});

        var originalString = (string + '');

        var keyData = this.locateEnglishKey(string);
        if (keyData !== null && keyData !== undefined) {
            translateData.params = translateData.params.concat(keyData.params || []);
            translateData = Object.assign(translateData, keyData);
            translateData.default = null;
            var translatedString = this.translate(translateData);
            if (translatedString !== null && translateData !== undefined) {
                return translatedString;
            }

        }

        //console.debug('Not found', originalString);
        return this.notFoundPrefix + originalString + this.notFoundSuffix;
    }

    searchAndReplaceWithTags(string, translateData) {
        // no point in searching for nothing
        if (string === null || string === undefined || string === '' || (string + '').length === 0) {
            return '';
        }

        // make sure there are tags
        if (!this.tagsRegex.test(string)) {
            return this.searchAndReplace(string, translateData);
        }

        var originalString = (string + '');
        translateData = Object.assign({
            key: null,
            default: null,
            params: [],
            locale: this.localeString
        }, translateData || {});

        var tags = {start: '', end: ''},
            pieces = this.tagsRegex.exec(originalString);

        if (pieces.length > 3) {
            tags.start = pieces[1];
            tags.end = pieces[3];
            var taglessString = pieces[2],
                taglessKeyData = this.locateEnglishKey(taglessString);

            if (taglessKeyData !== null && taglessKeyData !== undefined) {
                var taglessResult = this.translate(Object.assign(translateData, taglessKeyData, {default: null}));
                if (taglessResult !== null
                    && taglessResult !== undefined && (taglessResult + '').toLowerCase() !== 'null') {
                    // we found something
                    return tags.start + taglessResult + tags.end;
                }
            }

            // still nothing, lets check with tags
            var keyData = this.locateEnglishKey(originalString);
            if (keyData !== null && keyData !== undefined) {
                var result = this.translate(Object.assign(translateData, keyData, {default: null}));
                if (result !== null && result !== undefined && (result + '').toLowerCase() !== 'null') {
                    return result;
                }
            }
        }

        //console.debug('Not found', originalString);
        return this.notFoundPrefix + originalString + this.notFoundSuffix;
    }

    locateAndReplace(string, translateData) {
        return this.searchAndReplace(string, translateData);
    }

    locateEnglishKey(string, baseKey, regex) {
        baseKey = baseKey || 'en';
        regex = regex === true;
        // regex = false;
        var searchData = selectn(baseKey, IntlService.locales);
        if (searchData !== null && typeof searchData === 'object') {
            for (var key in searchData) {
                var res = this.locateEnglishKey(string, baseKey + '.' + key, regex);
                if (res !== null && res !== undefined) {
                    return res;
                }
            }
        } else if (searchData !== null) {
            var hasRegex = (searchData + '').search('%s') >= 0;
            if (!regex && !hasRegex) {
                // normal string comparison
                if (this.normalizeString(string) == this.normalizeString(searchData)) {
                    return {
                        key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
                        params: []
                    };
                }
            } else if (regex && hasRegex) {
                // search the regular expression
                var regex = new RegExp((searchData + '').replace(/%s/g, '(.*)'), 'i');
                if (regex.test((string + ''))) {
                    var pieces = regex.exec((string + '')),
                        params = [];
                    for (var i = 0; i < ((searchData + '').match(/%s/g) || []).length; i++) {
                        if (pieces[i + 1] !== null && pieces[i + 1] !== undefined) {
                            params.push(pieces[i + 1]);
                        }
                    }
                    return {
                        key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
                        params: params || []
                    };
                }
            }
        }

        // try regex IF on base
        if (!regex && baseKey === 'en') {
            // nothing found in regular strings, lets try regex
            return this.locateEnglishKey(string, 'en', true);
        }

        return null;
    }

    locateEnglishKey2(string, baseKey) {
        baseKey = baseKey || 'en';
        var searchData = selectn(baseKey, IntlService.locales);
        if (searchData !== null && typeof searchData === 'object') {
            if (searchData.general !== null && typeof searchData.general === 'object') {
                // lets loop through general first
                for (var key in searchData.general) {
                    var res = this.locateEnglishKey(string, baseKey + '.general');
                    if (res !== null && res !== undefined) {
                        return res;
                    }
                }
            }
            // we still have more to look through
            for (var key in searchData) {
                var res = this.locateEnglishKey(string, baseKey + '.' + key);
                if (res !== null && res !== undefined) {
                    return res;
                }
            }
        } else if (searchData !== null) {
            if (this.normalizeString(string) == this.normalizeString(searchData)) {
                return {
                    key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
                    params: []
                }
            } else {
                // OK, so there may not have been a match on those strings BUT
                // what about matching against %s strings?
                // lets compare the lowercase versions, IF the %s is present in the string
                if ((searchData + '').search('%s') >= 0) {
                    var regex = new RegExp((searchData).replace(/%s/g, '(.*)'), 'i');
                    if (regex.test((string + ''))) {
                        var pieces = regex.exec((string + '')),
                            params = [];
                        for (var i = 0; i < ((searchData + '').match(/%s/g) || []).length; i++) {
                            if (pieces[i + 1] !== null && pieces[i + 1] !== undefined) {
                                params.push(pieces[i + 1]);
                            }
                        }
                        return {
                            key: baseKey === 'en' ? null : baseKey.replace('en.', ''),
                            params: params || []
                        };
                    }
                }
            }
        }
        return null;
    }

    normalizeString(string) {
        return ((string + '').replace(/[^a-zA-Z0-9 ]/g, '')).toLowerCase();
    }

    loadLocales(force) {
        if (typeof IntlService.locales['en'] != 'object') {
            IntlService.locales['en'] = en;
        }
        if (typeof IntlService.locales['fr'] != 'object') {
            IntlService.locales['fr'] = fr;
        }
        if (typeof IntlService.locales['sp'] != 'object') {
            IntlService.locales['sp'] = sp;
        }
    }
}