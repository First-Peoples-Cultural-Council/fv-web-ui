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
const fallback = (cb) => setTimeout(cb, 0)
const ric = typeof requestIdleCallback === 'undefined' ? fallback : requestIdleCallback

export default (cacheSet) => ({ getState }) => (next) => (action) => {
  const oldState = getState()
  const res = next(action)
  const newState = getState()

  if (oldState.cache.updateCount !== newState.cache.updateCount) {
    ric(
      () => {
        cacheSet('cache', newState.cache)
      },
      { timeout: 500 }
    )
  }
  return res
}
