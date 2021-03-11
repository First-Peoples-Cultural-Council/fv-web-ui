import { useContext, useEffect } from 'react'
import useGetSections from 'common/useGetSections'
import useUserGet from 'common/useUserGet'
import useWorkspaceToggle from 'common/useWorkspaceToggle'
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

  const { title } = useGetSections()
  const { value: workspaceToggleValue, set } = useWorkspaceToggle()
  const { firstName, lastName, userName = '' } = useUserGet()

  const onWorkspaceModeClick = () => {
    set(!workspaceToggleValue)
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
    firstName,
    userName,
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
    menuData,
    onClickOutside,
    onKeyPress,
    onMenuClick,
    onWorkspaceModeClick,
    openMenu,
    title,
    workspaceToggleValue,
  }
}

export default DialectHeaderData
