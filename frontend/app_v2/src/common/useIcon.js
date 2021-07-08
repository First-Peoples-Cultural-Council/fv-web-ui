import React from 'react'

import About from 'common/icons/About'
import Alphabet from 'common/icons/Alphabet'
import Audio from 'common/icons/Audio'
import BackArrow from 'common/icons/BackArrow'
import Categories from 'common/icons/Categories'
import Checkmark from 'common/icons/Checkmark'
import ChevronDown from 'common/icons/ChevronDown'
import ChevronLeft from 'common/icons/ChevronLeft'
import ChevronRight from 'common/icons/ChevronRight'
import ChevronUp from 'common/icons/ChevronUp'
import ChevronUpDown from 'common/icons/ChevronUpDown'
import Close from 'common/icons/Close'
import Copy from 'common/icons/Copy'
import Dictionary from 'common/icons/Dictionary'
import Exclamation from 'common/icons/Exclamation'
import Facebook from 'common/icons/Facebook'
import FVLogo from 'common/icons/FVLogo'
import FVShortLogo from 'common/icons/FVShortLogo'
import ForwardArrow from 'common/icons/ForwardArrow'
import Grid from 'common/icons/Grid'
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
import Pause from 'common/icons/Pause'
import PauseCircle from 'common/icons/PauseCircle'
import PlaceHolder from 'common/icons/PlaceHolder'
import Play from 'common/icons/Play'
import PlayCircle from 'common/icons/PlayCircle'
import Search from 'common/icons/Search'
import Spinner from 'common/icons/Spinner'
import Resources from 'common/icons/Resources'
import TimesCircle from 'common/icons/TimesCircle'
import Twitter from 'common/icons/Twitter'
import UnfoldMore from 'common/icons/UnfoldMore'
import WebShare from 'common/icons/WebShare'
import Youtube from 'common/icons/Youtube'

import Phrase from 'common/icons/Phrase'
import Song from 'common/icons/Song'
import Story from 'common/icons/Story'
import Word from 'common/icons/Word'

// a helper function that given a string name returns an icon, if no string is supplied it will return a blank placeholder icon

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  const icons = {
    About,
    Alphabet,
    Audio,
    BackArrow,
    Categories,
    Checkmark,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronUpDown,
    Close,
    Copy,
    Dictionary,
    Exclamation,
    Facebook,
    FVLogo,
    FVShortLogo,
    ForwardArrow,
    Grid,
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
    Pause,
    PauseCircle,
    Phrase,
    PlaceHolder,
    Play,
    PlayCircle,
    Resources,
    Search,
    Song,
    Spinner,
    Story,
    TimesCircle,
    Twitter,
    UnfoldMore,
    WebShare,
    Word,
    Youtube,
  }
  const iconFile = icons[iconName]
  const Icon = iconFile ? iconFile : PlaceHolder
  return <Icon styling={styling} />
}
export default useIcon
