import useGetSections from 'common/useGetSections'
import useUserGet from 'common/useUserGet'
import api from 'services/api'
/**
 * @summary DialectHeaderData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectHeaderData() {
  // TODO: INVESTIGATE WHY logoUrl DOESN'T UPDATE!
  const { title /*, logoUrl*/ } = useGetSections()
  const { firstName, lastName, userName = '', isWorkspaceOn } = useUserGet()

  const onWorkspaceModeClick = () => {
    const { isLoading, error, data } = api.postWorkspaceSetting(!isWorkspaceOn)
    // TODO: REMOVE CONSOLE LOG
    // eslint-disable-next-line
    console.log('onclick debug', { isLoading, error, data })
  }

  const currentUser = {
    userInitials: firstName || lastName ? `${firstName}${lastName}` : userName.charAt(0),
    isWorkspaceOn,
  }

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
    onWorkspaceModeClick,
  }
}

export default DialectHeaderData
