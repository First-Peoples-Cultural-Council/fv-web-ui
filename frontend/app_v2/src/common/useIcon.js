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
import Facebook from 'common/icons/Facebook'
import HamburgerMenu from 'common/icons/HamburgerMenuIcon'
import Instagram from 'common/icons/Instagram'
import Kids from 'common/icons/KidsIcon'
import Learn from 'common/icons/LearnIcon'
import Lessons from 'common/icons/Lessons'
import Link from 'common/icons/Link'
import LinkedIn from 'common/icons/LinkedIn'
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
import Twitter from 'common/icons/Twitter'
import WebShare from 'common/icons/WebShare'
import Youtube from 'common/icons/Youtube'

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
    Instagram,
    Kids,
    Learn,
    Lessons,
    Link,
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
    Youtube,
  }
  const iconFile = icons[iconName]
  const Icon = iconFile ? iconFile : PlaceHolder
  return <Icon styling={styling} />
}
export default useIcon
