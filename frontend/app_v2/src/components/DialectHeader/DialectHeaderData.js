import useGetSections from 'common/useGetSections'

/**
 * @summary DialectHeaderData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectHeaderData() {
  const { title } = useGetSections()

  const currentUser = { userInitials: 'TU' }
  const menuData = [
    {
      title: 'Dictionary',
      itemsData: [
        { title: 'Words', href: `/${title}/words` },
        { title: 'Phrases', href: `/${title}/phrases` },
        { title: 'Alphabet', href: `/${title}/alphabet` },
        { title: 'Browse by Topic', href: `/${title}/topics` },
      ],
    },
    {
      title: 'Learn',
      itemsData: [
        { title: 'Songs', href: `/${title}/songs` },
        { title: 'Stories', href: `/${title}/stories` },
        { title: 'Games', href: `/${title}/games` },
      ],
    },
    {
      title: 'Resources',
      itemsData: [
        { title: 'Kids Site', href: `/${title}/kids` },
        { title: 'Mobile App', href: `/${title}/app` },
        { title: 'Keyboard App', href: `/${title}/keyboard` },
      ],
    },
    {
      title: 'About',
      itemsData: [
        { title: 'Our Language', href: `/${title}/ourlanguage` },
        { title: 'Our People', href: `/${title}/about` },
      ],
    },
    { title: 'Kids', href: `/${title}/kids` },
  ]
  return {
    title,
    currentUser,
    menuData,
  }
}

export default DialectHeaderData
