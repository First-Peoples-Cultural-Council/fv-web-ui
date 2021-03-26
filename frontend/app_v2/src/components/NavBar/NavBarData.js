import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useGetSite from 'common/useGetSite'
import useGetUser from 'common/useGetUser'
import useWorkspaceToggle from 'common/useWorkspaceToggle'
import AppStateContext from 'common/AppStateContext'
/**
 * @summary NavBarData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function NavBarData() {
  const { menu } = useContext(AppStateContext)
  const { sitename } = useParams()
  const { machine, send } = menu
  const { context } = machine
  const { openMenu } = context

  const { title } = useGetSite()
  const { value: workspaceToggleValue, set } = useWorkspaceToggle()
  const { firstName, lastName, username } = useGetUser()

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
    userInitials:
      firstName || lastName ? (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '') : username?.charAt(0) || '',
    firstName,
    username,
  }

  const menuData = [
    {
      title: 'Dictionary',
      id: 'dictionary',
      itemsData: [
        { title: 'Words', href: `/${sitename}/words` },
        { title: 'Phrases', href: `/${sitename}/phrases` },
        { title: 'Alphabet', href: `/${sitename}/alphabet` },
        { title: 'Categories', href: `/${sitename}/categories` },
      ],
    },
    {
      title: 'Learn',
      id: 'learn',
      itemsData: [
        { title: 'Songs', href: `/${sitename}/songs` },
        { title: 'Stories', href: `/${sitename}/stories` },
        { title: 'Games', href: `/${sitename}/games` },
      ],
    },
    {
      title: 'Resources',
      id: 'resources',
      itemsData: [
        { title: 'Mobile App', href: `/${sitename}/app` },
        { title: 'Keyboard App', href: `/${sitename}/keyboard` },
      ],
    },
    {
      title: 'About',
      id: 'about',
      itemsData: [
        { title: 'Our Language', href: `/${sitename}/ourlanguage` },
        { title: 'Our People', href: `/${sitename}/about` },
      ],
    },
    { title: 'Kids', id: 'kids', href: `/${sitename}/kids` },
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

export default NavBarData
