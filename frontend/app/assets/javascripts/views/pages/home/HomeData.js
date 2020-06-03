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
import { useEffect, useState } from 'react'
import { withTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Immutable from 'immutable'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import selectn from 'selectn'

import useIntl from 'DataSource/useIntl'
import usePage from 'DataSource/usePage'
import useProperties from 'DataSource/useProperties'
import useUserStartpage from 'DataSource/useUserStartpage'
import useWindowPath from 'DataSource/useWindowPath'

function HomeData(props) {
  const [isUnmounting, setIsUnmounting] = useState(false)
  const { intl } = useIntl()
  const { computePage, queryPage } = usePage()
  const { properties } = useProperties()
  const { computeUserStartpage, fetchUserStartpage } = useUserStartpage()
  const { windowPath, pushWindowPath } = useWindowPath()

  const pagePath = `/${properties.domain}/sections/Site/Resources/`

  useEffect(() => {
    queryPage(pagePath, " AND fvpage:url LIKE '/home/'" + '&sortOrder=ASC' + '&sortBy=dc:title')

    // Get user start page
    fetchUserStartpage('currentUser', {
      defaultHome: false,
    })
  }, [])

  const _computeUserStartpage = ProviderHelpers.getEntry(computeUserStartpage, 'currentUser')
  const startPage = selectn('response.value', _computeUserStartpage)
  // Redirect to start page (but not when accessing /home directly)
  if (isUnmounting === false && windowPath.indexOf('/home') === -1 && startPage) {
    window.location = startPage
  }

  // Access Buttons
  const accessButtonsEntries = selectn('response.entries', _computeUserStartpage) || []
  const accessButtons = accessButtonsEntries.map((dialect) => {
    return {
      url: NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'),
      text: `Access ${selectn('properties.dc:title', dialect)}`,
    }
  })
  if (accessButtons.length === 0) {
    accessButtons.push({
      url: NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'),
    })
  }

  // Sections
  const _computePage = ProviderHelpers.getEntry(computePage, `/${properties.domain}/sections/Site/Resources/`)
  const page = selectn('response.entries[0].properties', _computePage)
  const sections = (selectn('fvpage:blocks', page) || []).map((block) => {
    const { area, title, text, summary, file } = block
    return {
      area,
      file,
      summary,
      text,
      title,
    }
  })

  return props.children({
    accessButtonClickHandler: (url) => {
      setIsUnmounting(true)
      NavigationHelpers.navigate(url, pushWindowPath, true)
    },
    sections,
    properties,
    computeEntities: Immutable.fromJS([
      {
        id: pagePath,
        entity: computePage,
      },
      {
        id: 'currentUser',
        entity: computeUserStartpage,
      },
    ]),
    primary1Color: selectn('theme.palette.primary1Color', props),
    primary2Color: selectn('theme.palette.primary2Color', props),
    accessButtons,
    intl,
  })
}

// PropTypes
const { object } = PropTypes
HomeData.propTypes = {
  theme: object,
}

export default withTheme()(HomeData)
