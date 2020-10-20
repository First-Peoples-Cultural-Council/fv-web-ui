/* globals ENV_CONTEXT_PATH, ENV_WEB_URL, ENV_NUXEO_URL */
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

import ConfGlobal from 'common/conf/local.js'

/**
 * Returns the context path (as an array) from local.js, or empty array.
 */
const ContextPath = () => {
  if (ENV_CONTEXT_PATH !== null && typeof ENV_CONTEXT_PATH !== 'undefined') {
    return ENV_CONTEXT_PATH
  } else if (!ConfGlobal.contextPath || ConfGlobal.contextPath.length === 0) {
    return ''
  }

  return ConfGlobal.contextPath
}

export default {
  getContextPath: () => {
    return ContextPath()
  },
  getBaseWebUIURL: () => {
    if (ENV_WEB_URL !== null && typeof ENV_WEB_URL !== 'undefined') {
      return ENV_WEB_URL
    }
    return (
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '') +
      ContextPath()
    )
  },
  getBaseURL: () => {
    if (ENV_NUXEO_URL !== null && typeof ENV_NUXEO_URL !== 'undefined') {
      return ENV_NUXEO_URL
    }
    return (
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '') +
      '/nuxeo/'
    )
  },
}
