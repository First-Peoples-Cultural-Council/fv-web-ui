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
  const { userLanguages } = useRegistrations()
  const links = userLanguages.map(({ id, title, path }) => {
    const _links = [
      {
        url: `/explore${path}/categories`,
        text: 'Categories',
        transKey: 'views.pages.explore.dialect.nav_categories',
        transform: 'words',
      },
      {
        url: `/explore${path}/media`,
        text: 'Media browser',
        transKey: 'views.pages.explore.dialect.media_browser',
        transform: 'words',
      },
      {
        url: `/explore${path}/phrasebooks`,
        text: 'Phrase books',
        transKey: 'views.pages.explore.dialect.nav_phrase_books',
        transform: 'words',
      },
    ]
    if (id) {
      _links.push({
        url: `/tasks/users/${id}`,
        text: 'Registration requests',
      })
    }

    _links.push({
      url: `/explore${path}/reports`,
      text: 'Reports',
      transKey: 'reports',
      transform: 'first',
    })

    return {
      title,
      links: _links,
    }
  })
  const childrenData = {
    links,
  }
  return children(childrenData)
}
// PROPTYPES
const { func } = PropTypes
WidgetLinksData.propTypes = {
  children: func,
}

export default WidgetLinksData
