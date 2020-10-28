/* global _paq */
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

// import ConfGlobal from 'common/conf/local.js'
import selectn from 'selectn'

/*var _paq = {
  "push": function (array) {
    console.log(array);
  }
}*/

const hasAnalytics = () => {
  if (typeof _paq !== 'undefined') {
    return true
  }

  return false
}

export default {
  trackPageView(payload) {
    if (hasAnalytics()) {
      // For now track in set timeout with slight delay to capture correct page title
      setTimeout(() => {
        // Only process if piwik code available and do not track page views for search results
        if (selectn('pageurl', payload).indexOf('/search/') === -1) {
          _paq.push(['setReferrerUrl', selectn('referrer', payload)])
          _paq.push(['setCustomUrl', selectn('pageurl', payload)])
          _paq.push(['setDocumentTitle', document.title])

          // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
          _paq.push(['deleteCustomVariables', 'page'])
          _paq.push(['setGenerationTimeMs', 0])
          _paq.push(['trackPageView'])

          // make Matomo aware of newly added content
          const content = document.getElementById('pageContainer')
          _paq.push(['MediaAnalytics::scanForMedia', content])
          _paq.push(['FormAnalytics::scanForForms', content])
          _paq.push(['trackContentImpressionsWithinNode', content])
          _paq.push(['enableLinkTracking'])
        }
      }, 900)
    }
  },
  trackSiteSearch(payload) {
    if (hasAnalytics()) {
      _paq.push([
        'trackSiteSearch',
        selectn('keyword', payload),
        selectn('category', payload),
        selectn('results', payload),
      ])
    }
  },
}
