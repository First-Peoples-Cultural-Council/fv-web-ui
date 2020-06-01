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
import { useEffect } from 'react'

import Immutable from 'immutable'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import selectn from 'selectn'

import useIntl from './dataSource/useIntl'
import usePage from './dataSource/usePage'
import useProperties from './dataSource/useProperties'
import useUserStartpage from './dataSource/useUserStartpage'
import useWindowPath from './dataSource/useWindowPath'

function HomeData(props) {
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
  // If user is accessing /home directly, do not redirect.
  if (windowPath.indexOf('/home') === -1 && startPage) {
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
    primary1Color: '#eaeaea', // TODO: theme.palette.primary1Color
    primary2Color: '#eaeaea', // TODO: theme.palette.primary2Color
    accessButtons,
    pushWindowPath,
    intl,
  })
}

// TODO: MAT-UI v4.10.0 has a hook
// https://material-ui.com/styles/advanced/#accessing-the-theme-in-a-component
// import { useTheme } from '@material-ui/core/styles'
// function DeepChild() {
//   const theme = useTheme();
//   return <span>{`spacing ${theme.spacing}`}</span>;
// }

export default HomeData
