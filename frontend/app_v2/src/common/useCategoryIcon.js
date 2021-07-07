import React from 'react'

import Animals from 'common/categoryIcons/BearPaw'
import Body from 'common/categoryIcons/Ear'
import Colours from 'common/categoryIcons/PaintPalette'
import Events from 'common/categoryIcons/Moon'
import Food from 'common/categoryIcons/Berries'
import Relations from 'common/categoryIcons/Family'
import Activities from 'common/categoryIcons/Walking'
import Nature from 'common/categoryIcons/Forest'
import Numbers from 'common/categoryIcons/Hash'
import Plants from 'common/categoryIcons/Seedling'
import Spirit from 'common/categoryIcons/Feather'
import Question from 'common/categoryIcons/QuestionMark'

import Default from 'common/icons/Categories'

// a helper function that given a string name returns an icon, if no string is supplied it will return a default icon

const recognisedCategories = {
  Animals: Animals,
  Amphibians: Animals,
  Birds: Animals,
  Fish: Animals,
  Insects: Animals,
  Mammals: Animals,
  Reptiles: Animals,
  Shellfish: Animals,
  Spiders: Animals,
  Body: Body,
  'Bodily Afflictions/Health': Body,
  'Body Parts': Body,
  'Senses    Speech and Language': Body,
  Colours: Colours,
  Events: Events,
  Activities: Activities,
  Motion: Events,
  'States    Thinking/Feeling': Events,
  Time: Events,
  Food: Food,
  'Gathering and Making': Activities,
  'Human Relations': Relations,
  'Kinship Terms': Relations,
  'Human Things/Activities': Activities,
  Buildings: Default,
  Clothing: Default,
  Dwelling: Default,
  'Employment/Work': Activities,
  'Fishing/Hunting': Activities,
  Government: Activities,
  'Making Cultural Objects': Activities,
  'Tools/Implements': Activities,
  Trade: Activities,
  Sports: Activities,
  Transportation: Activities,
  'Nature / Environment': Nature,
  Landscape: Nature,
  'Natural Resources': Nature,
  'Place Names': Nature,
  'Place/Location': Nature,
  Seasons: Nature,
  Weather: Nature,
  Numbers: Numbers,
  Plants: Plants,
  Ferns: Plants,
  Flowers: Plants,
  'Food Plants': Plants,
  Fungi: Plants,
  Grasses: Plants,
  Lichens: Plants,
  'Medicine Plants': Plants,
  Shrubs: Plants,
  Trees: Plants,
  Vegetables: Plants,
  Prepositions: Default,
  'Question Words': Question,
  Spirit: Spirit,
  'Spiritual Beliefs': Spirit,
}

function useIcon(categoryTitle, iconStyling) {
  const styling = iconStyling ? iconStyling : 'fill-current h-12 w-12'
  const iconFile = recognisedCategories[categoryTitle]
  const Icon = iconFile ? iconFile : Default
  return <Icon styling={styling} />
}
export default useIcon
