import React from 'react'

import About from 'common/icons/AboutIcon'
import Audio from 'common/icons/AudioIcon'
import Book from 'common/icons/Book'
import ChatBubble from 'common/icons/ChatBubble'
import ChevronDown from 'common/icons/ChevronDownIcon'
import ChevronLeft from 'common/icons/ChevronLeftIcon'
import ChevronRight from 'common/icons/ChevronRightIcon'
import Close from 'common/icons/CloseIcon'
import Dictionary from 'common/icons/DictionaryIcon'
import Facebook from 'common/icons/FacebookIcon'
import HamburgerMenu from 'common/icons/HamburgerMenuIcon'
import Kids from 'common/icons/KidsIcon'
import Learn from 'common/icons/LearnIcon'
import Lessons from 'common/icons/Lessons'
import LinkedIn from 'common/icons/LinkedInIcon'
import Login from 'common/icons/LoginIcon'
import Logo from 'common/icons/Logo'
import Mail from 'common/icons/MailIcon'
import MusicNote from 'common/icons/MusicNote'
import PauseCircle from 'common/icons/PauseCircle'
import PlaceHolder from 'common/icons/PlaceHolderIcon'
import PlayCircle from 'common/icons/PlayCircle'
import Quote from 'common/icons/Quote'
import Search from 'common/icons/Search'
import Resources from 'common/icons/ResourcesIcon'
import TimesCircle from 'common/icons/TimesCircle'
import Twitter from 'common/icons/TwitterIcon'
import WebShare from 'common/icons/WebShareIcon'

// a helper function that given a string name returns an icon, if no string is supplied it will return a blank placeholder icon

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  const icons = {
    About,
    Audio,
    Book,
    ChatBubble,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Close,
    Dictionary,
    Facebook,
    HamburgerMenu,
    Kids,
    Learn,
    Lessons,
    LinkedIn,
    Login,
    Logo,
    Mail,
    MusicNote,
    PauseCircle,
    PlaceHolder,
    PlayCircle,
    Quote,
    Resources,
    Search,
    TimesCircle,
    Twitter,
    WebShare,
  }
  const iconFile = icons[iconName]
  const Icon = iconFile ? iconFile : PlaceHolder
  return <Icon styling={styling} />
}
export default useIcon
