import PropTypes from 'prop-types'

/**
 * @summary DialectHeaderData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectHeaderData({ children }) {
  const dialectPath = '/DIALECT_PATH_GOES_HERE'
  // Note: change dialectName variable to a language name on your local docker
  const dialectName = 'ÜgwÛ'
  const currentUser = { userInitials: 'TU' }
  const menuData = [
    {
      title: 'Dictionary',
      itemsData: [
        { title: 'Words', href: `${dialectPath}/words` },
        { title: 'Phrases', href: `${dialectPath}/phrases` },
        { title: 'Alphabet', href: `${dialectPath}/alphabet` },
        { title: 'Browse by Topic', href: `${dialectPath}/topics` },
      ],
    },
    {
      title: 'Learn',
      itemsData: [
        { title: 'Songs', href: `${dialectPath}/songs` },
        { title: 'Stories', href: `${dialectPath}/stories` },
        { title: 'Games', href: `${dialectPath}/games` },
      ],
    },
    {
      title: 'Resources',
      itemsData: [
        { title: 'Kids Site', href: `${dialectPath}/kids` },
        { title: 'Mobile App', href: `${dialectPath}/app` },
        { title: 'Keyboard App', href: `${dialectPath}/keyboard` },
      ],
    },
    {
      title: 'About',
      itemsData: [
        { title: 'Our Language', href: `${dialectPath}/ourlanguage` },
        { title: 'Our People', href: `/about?language=${dialectName}` },
      ],
    },
    { title: 'Kids', href: `${dialectPath}/kids` },
  ]
  return children({
    currentUser,
    menuData,
  })
}
// PROPTYPES
const { func } = PropTypes
DialectHeaderData.propTypes = {
  children: func,
}

export default DialectHeaderData
