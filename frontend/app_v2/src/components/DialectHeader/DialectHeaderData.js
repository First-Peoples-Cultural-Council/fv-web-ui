import { useContext, useEffect } from 'react'
import useGetSections from 'common/useGetSections'
import useUserGet from 'common/useUserGet'
import AppStateContext from 'common/AppStateContext'
/**
 * @summary DialectHeaderData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectHeaderData() {
  const { menu } = useContext(AppStateContext)
  const { machine, send } = menu
  const { context } = machine
  const { openMenu } = context
  // TODO: INVESTIGATE WHY logoUrl DOESN'T UPDATE!
  const { title /*, logoUrl*/ } = useGetSections()
  const { firstName, lastName, userName = '', isWorkspaceOn } = useUserGet()

  const onWorkspaceModeClick = () => {
    send('CLICK_TOGGLE', { value: !isWorkspaceOn })
  }
  const onMenuClick = (menuId) => {
    send('OPEN', { menuId })
  }

  const onKeyPress = ({ code, menuId }) => {
    const keyCode = code.toLowerCase()
    if (keyCode === 'escape') {
      send('CLOSE')
    }
    if (menuId && keyCode === 'enter') {
      onMenuClick(menuId)
    }
  }

  const onClickOutside = (event, menuId) => {
    if (openMenu && openMenu !== menuId) {
      send('CLOSE')
    }
  }

  useEffect(() => {
    if (openMenu) {
      document.addEventListener('mousedown', onClickOutside)
    } else {
      document.removeEventListener('mousedown', onClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [openMenu])
  const currentUser = {
    userInitials: firstName || lastName ? firstName?.charAt(0) + lastName?.charAt(0) : userName.charAt(0),
    isWorkspaceOn,
  }

  const menuData = [
    {
      title: 'Dictionary',
      id: 'dictionary',
      itemsData: [
        { title: 'Words', href: `/${title}/words` },
        { title: 'Phrases', href: `/${title}/phrases` },
        { title: 'Alphabet', href: `/${title}/alphabet` },
        { title: 'Browse by Topic', href: `/${title}/topics` },
      ],
    },
    {
      title: 'Learn',
      id: 'learn',
      itemsData: [
        { title: 'Songs', href: `/${title}/songs` },
        { title: 'Stories', href: `/${title}/stories` },
        { title: 'Games', href: `/${title}/games` },
      ],
    },
    {
      title: 'Resources',
      id: 'resources',
      itemsData: [
        { title: 'Kids Site', href: `/${title}/kids` },
        { title: 'Mobile App', href: `/${title}/app` },
        { title: 'Keyboard App', href: `/${title}/keyboard` },
      ],
    },
    {
      title: 'About',
      id: 'about',
      itemsData: [
        { title: 'Our Language', href: `/${title}/ourlanguage` },
        { title: 'Our People', href: `/${title}/about` },
      ],
    },
    { title: 'Kids', id: 'kids', href: `/${title}/kids` },
  ]

  return {
    currentUser,
    isWorkspaceOn,
    menuData,
    onClickOutside,
    onKeyPress,
    onMenuClick,
    onWorkspaceModeClick,
    openMenu,
    title,
  }
}

export default DialectHeaderData
