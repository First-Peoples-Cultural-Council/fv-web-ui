class MemoizationCache {
  _caches = {}
  _timeoutHandle = null

  constructor() {
    this.loadFromSessionStorage()
  }

  get(cacheName, key) {
    return this._caches[cacheName][key]
  }

  contains(cacheName, key) {
    if (Object.prototype.hasOwnProperty.call(this._caches, cacheName)) {
      return Object.prototype.hasOwnProperty.call(this._caches[cacheName], key)
    }
    return false
  }

  put(cacheName, key, value) {
    if (!Object.prototype.hasOwnProperty.call(this._caches, cacheName)) {
      this._caches[cacheName] = {}
    }
    this._caches[cacheName][key] = value

    //debounce calls to saveCache because it is expensive and only the last one matters
    if (this._timeoutHandle !== null) {
      clearTimeout(this._timeoutHandle)
    }
    this._timeoutHandle = setTimeout(
      function saveIt() {
        this.saveCacheToSessionStorage()
      }.bind(this),
      3000
    )
  }

  // invalidate the cache. It may be necessary to call this when editing translations so that
  // changes are reflected immediately
  clear() {
    this._caches = {}
    sessionStorage.removeItem('memoCache')
  }

  saveCacheToSessionStorage() {
    sessionStorage.setItem('memoCache', JSON.stringify(this._caches))
  }

  loadFromSessionStorage() {
    const savedCache = sessionStorage.getItem('memoCache')
    if (savedCache !== null) {
      this._caches = JSON.parse(savedCache)
    }
  }
}

const cache = new MemoizationCache()
export default cache
