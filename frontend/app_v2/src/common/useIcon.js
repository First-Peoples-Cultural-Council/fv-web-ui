import React from 'react'

import AboutIcon from 'common/icons/AboutIcon'
import AudioIcon from 'common/icons/AudioIcon'
import ChevronDownIcon from 'common/icons/ChevronDownIcon'
import ChevronLeftIcon from 'common/icons/ChevronLeftIcon'
import ChevronRightIcon from 'common/icons/ChevronRightIcon'
import CloseIcon from 'common/icons/CloseIcon'
import DictionaryIcon from 'common/icons/DictionaryIcon'
import FacebookIcon from 'common/icons/FacebookIcon'
import HamburgerMenuIcon from 'common/icons/HamburgerMenuIcon'
import KidsIcon from 'common/icons/KidsIcon'
import LearnIcon from 'common/icons/LearnIcon'
import LinkedInIcon from 'common/icons/LinkedInIcon'
import LoginIcon from 'common/icons/LoginIcon'
import Logo from 'common/icons/Logo'
import MailIcon from 'common/icons/MailIcon'
import PlaceHolderIcon from 'common/icons/PlaceHolderIcon'
import ResourcesIcon from 'common/icons/ResourcesIcon'
import TwitterIcon from 'common/icons/TwitterIcon'
import WebShareIcon from 'common/icons/WebShareIcon'

// a helper function that given a string name returns an icon, if no string is supplied it will return a blank placeholder icon

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  switch (iconName) {
    case 'About':
      return <AboutIcon styling={styling} />
    case 'Audio':
      return <AudioIcon styling={styling} />
    case 'Dictionary':
      return <DictionaryIcon styling={styling} />
    case 'ChevronDown':
      return <ChevronDownIcon styling={styling} />
    case 'ChevronLeft':
      return <ChevronLeftIcon styling={styling} />
    case 'ChevronRight':
      return <ChevronRightIcon styling={styling} />
    case 'Close':
      return <CloseIcon styling={styling} />
    case 'Facebook':
      return <FacebookIcon styling={styling} />
    case 'HamburgerMenu':
      return <HamburgerMenuIcon styling={styling} />
    case 'Kids':
      return <KidsIcon styling={styling} />
    case 'Learn':
      return <LearnIcon styling={styling} />
    case 'LinkedIn':
      return <LinkedInIcon styling={styling} />
    case 'Login':
      return <LoginIcon styling={styling} />
    case 'Logo':
      return <Logo styling={styling} />
    case 'Mail':
      return <MailIcon styling={styling} />
    case 'Resources':
      return <ResourcesIcon styling={styling} />
    case 'Twitter':
      return <TwitterIcon styling={styling} />
    case 'WebShare':
      return <WebShareIcon styling={styling} />
    default:
      return <PlaceHolderIcon styling={styling} />
  }
}
export default useIcon
