import React from 'react'

import AboutIcon from 'common/icons/AboutIcon'
import ChevronDownIcon from 'common/icons/ChevronDownIcon'
import ChevronRightIcon from 'common/icons/ChevronRightIcon'
import CloseIcon from 'common/icons/CloseIcon'
import DictionaryIcon from 'common/icons/DictionaryIcon'
import HamburgerMenuIcon from 'common/icons/HamburgerMenuIcon'
import KidsIcon from 'common/icons/KidsIcon'
import LearnIcon from 'common/icons/LearnIcon'
import LoginIcon from 'common/icons/LoginIcon'
import Logo from 'common/icons/Logo'
import ResourcesIcon from 'common/icons/ResourcesIcon'

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  switch (iconName) {
    case 'About':
      return <AboutIcon styling={styling} />
    case 'Dictionary':
      return <DictionaryIcon styling={styling} />
    case 'ChevronDown':
      return <ChevronDownIcon styling={styling} />
    case 'ChevronRight':
      return <ChevronRightIcon styling={styling} />
    case 'Close':
      return <CloseIcon styling={styling} />
    case 'HamburgerMenu':
      return <HamburgerMenuIcon styling={styling} />
    case 'Kids':
      return <KidsIcon styling={styling} />
    case 'Learn':
      return <LearnIcon styling={styling} />
    case 'Login':
      return <LoginIcon styling={styling} />
    case 'Logo':
      return <Logo styling={styling} />
    case 'Resources':
      return <ResourcesIcon styling={styling} />
    default:
      return null
  }
}
export default useIcon
