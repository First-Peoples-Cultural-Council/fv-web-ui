import React from 'react'

import About from 'common/icons/About'
import Audio from 'common/icons/Audio'
import BackArrow from 'common/icons/BackArrow'
import Book from 'common/icons/Book'
import ChatBubble from 'common/icons/ChatBubble'
import Checkmark from 'common/icons/Checkmark'
import ChevronDown from 'common/icons/ChevronDown'
import ChevronLeft from 'common/icons/ChevronLeft'
import ChevronRight from 'common/icons/ChevronRight'
import Close from 'common/icons/Close'
import Copy from 'common/icons/Copy'
import Dictionary from 'common/icons/Dictionary'
import Exclamation from 'common/icons/Exclamation'
import Facebook from 'common/icons/Facebook'
import FVLogo from 'common/icons/FVLogo'
import FVShortLogo from 'common/icons/FVShortLogo'
import HamburgerMenu from 'common/icons/HamburgerMenu'
import Home from 'common/icons/Home'
import Instagram from 'common/icons/Instagram'
import Kids from 'common/icons/Kids'
import Learn from 'common/icons/Learn'
import Lessons from 'common/icons/Lessons'
import Link from 'common/icons/Link'
import LinkedIn from 'common/icons/LinkedIn'
import Login from 'common/icons/Login'
import Mail from 'common/icons/Mail'
import More from 'common/icons/More'
import MusicNote from 'common/icons/MusicNote'
import Pause from 'common/icons/Pause'
import PauseCircle from 'common/icons/PauseCircle'
import PlaceHolder from 'common/icons/PlaceHolder'
import Play from 'common/icons/Play'
import PlayCircle from 'common/icons/PlayCircle'
import Quote from 'common/icons/Quote'
import Search from 'common/icons/Search'
import Spinner from 'common/icons/Spinner'
import Resources from 'common/icons/Resources'
import TimesCircle from 'common/icons/TimesCircle'
import Twitter from 'common/icons/Twitter'
import UnfoldMore from 'common/icons/UnfoldMore'
import WebShare from 'common/icons/WebShare'
import Youtube from 'common/icons/Youtube'

// a helper function that given a string name returns an icon, if no string is supplied it will return a blank placeholder icon

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  const icons = {
    About,
    Audio,
    BackArrow,
    Book,
    ChatBubble,
    Checkmark,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Close,
    Copy,
    Dictionary,
    Exclamation,
    Facebook,
    FVLogo,
    FVShortLogo,
    HamburgerMenu,
    Home,
    Instagram,
    Kids,
    Learn,
    Lessons,
    Link,
    LinkedIn,
    Login,
    Mail,
    More,
    MusicNote,
    Pause,
    PauseCircle,
    PlaceHolder,
    Play,
    PlayCircle,
    Quote,
    Resources,
    Search,
    Spinner,
    TimesCircle,
    Twitter,
    UnfoldMore,
    WebShare,
    Youtube,
  }
  const iconFile = icons[iconName]
  const Icon = iconFile ? iconFile : PlaceHolder
  return <Icon styling={styling} />
}
export default useIcon
