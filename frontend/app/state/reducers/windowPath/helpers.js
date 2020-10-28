// Porting code from old library:
// https://github.com/loggur/provide-page/blob/6d4244e32d22ebb2b4b2a7e6ff148b9d7f134e0c/src/index.js
// "splitWindowPath - Basically windowPath.split('/'), shifted since the first item is always empty. So for example, when your windowPath is /foo/bar, this will be ['foo', 'bar']. This exists as a convenience to reduce boilerplate when rendering your routes."
export const splitPath = (path) => path.replace(/^\//, '').split('/')

// Provide-page uses canUseDOM from 'exenv'
// https://github.com/JedWatson/exenv/blob/master/index.js
export const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)
