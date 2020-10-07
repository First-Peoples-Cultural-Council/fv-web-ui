import PropTypes from 'prop-types'

import useRegistrations from 'DataSource/useRegistrations'
/**
 * @summary WidgetLinksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {function} props.children Render prop
 * @param {object} props.columnRender Object of functions to render cell data. Concession to maintain separation of concerns.
 *
 * @returns {object} Data for WidgetLinksPresentation
 */
function WidgetLinksData({ children }) {
  const { dialectId, dialectTitle, dialectPath } = useRegistrations()
  // /explore/FV/Workspaces/Data/Test/Test/ǎiǓǏi/media
  const childrenData = {
    links: [
      {
        url: `/tasks/users/${dialectId}`,
        text: `View registration requests to join ${dialectTitle}`,
      },
      {
        url: `/explore${dialectPath}/reports`,
        text: 'Reports',
        transKey: 'reports',
        transform: 'first',
      },
      {
        url: `/explore${dialectPath}/media`,
        text: 'Media browser',
        transKey: 'views.pages.explore.dialect.media_browser',
        transform: 'words',
      },
      {
        url: `/explore${dialectPath}/phrasebooks`,
        text: 'Phrase books',
        transKey: 'views.pages.explore.dialect.nav_phrase_books',
        transform: 'words',
      },
      {
        url: `/explore${dialectPath}/categories`,
        text: 'Categories',
        transKey: 'views.pages.explore.dialect.nav_categories',
        transform: 'words',
      },
    ],
  }
  return children(childrenData)
}
// PROPTYPES
const { func } = PropTypes
WidgetLinksData.propTypes = {
  children: func,
}

export default WidgetLinksData
