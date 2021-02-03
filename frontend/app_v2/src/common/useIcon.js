import React from 'react'

import AboutIcon from 'common/icons/AboutIcon'
import Book from 'common/icons/Book'
import ChatBubble from 'common/icons/ChatBubble'
import ChevronDownIcon from 'common/icons/ChevronDownIcon'
import ChevronLeftIcon from 'common/icons/ChevronLeftIcon'
import ChevronRightIcon from 'common/icons/ChevronRightIcon'
import CloseIcon from 'common/icons/CloseIcon'
import DictionaryIcon from 'common/icons/DictionaryIcon'
import HamburgerMenuIcon from 'common/icons/HamburgerMenuIcon'
import KidsIcon from 'common/icons/KidsIcon'
import LearnIcon from 'common/icons/LearnIcon'
import Lessons from 'common/icons/Lessons'
import LoginIcon from 'common/icons/LoginIcon'
import Logo from 'common/icons/Logo'
import MusicNote from 'common/icons/MusicNote'
import PlaceHolderIcon from 'common/icons/PlaceHolderIcon'
import Quote from 'common/icons/Quote'
import ResourcesIcon from 'common/icons/ResourcesIcon'
import PlayCircle from 'common/icons/PlayCircle'
import PauseCircle from 'common/icons/PauseCircle'
import TimesCircle from 'common/icons/TimesCircle'

// a helper function that given a string name returns an icon, if no string is supplied it will return a blank placeholder icon

function useIcon(iconName, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-8'
  const icons = {
    About: AboutIcon,
    Book,
    ChatBubble,
    ChevronDown: ChevronDownIcon,
    ChevronLeft: ChevronLeftIcon,
    ChevronRight: ChevronRightIcon,
    Close: CloseIcon,
    Dictionary: DictionaryIcon,
    HamburgerMenu: HamburgerMenuIcon,
    Kids: KidsIcon,
    Learn: LearnIcon,
    Lessons,
    Login: LoginIcon,
    Logo,
    MusicNote,
    Quote,
    Resources: ResourcesIcon,
    PlayCircle,
    PauseCircle,
    TimesCircle,
  }
  const iconFile = icons[iconName]
  const Icon = iconFile ? iconFile : PlaceHolderIcon
  return <Icon styling={styling} />
}
export default useIcon
