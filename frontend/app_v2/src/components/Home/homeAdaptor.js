import {
  WIDGET_HERO,
  WIDGET_HERO_SEARCH,
  WIDGET_SCHEDULE,
  WIDGET_LIST,
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  // WIDGET_LIST_SONG,
  // WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  WIDGET_LIST_GENERIC,
} from 'common/constants'

function homeAdaptor(response) {
  const { properties, uid } = response
  const widgetsActive = properties['widgets:active'] || []
  const widgets = widgetsActive.map((widget) => {
    const content = widget['widget:content'] || []
    const settings = widget['settings:settings'] || []
    const type = widget?.['widget:type']
    if (type === 'HeroWidget') {
      const searchSettings = settings.find(({ category, key }) => {
        return category === 'presentation' && key === 'search'
      })
      const hasSearch = searchSettings ? searchSettings.value : false
      const img = {}
      content.find(({ image }) => {
        if (image) {
          // console.log(image)
          // Or could use original image:
          // views[0].url
          // views[0].height
          // views[0].width
          img.title = image['dc:title']
          img.url = image.path
          // break out of loop
          return true
        }
        return false
      })

      return {
        type: WIDGET_HERO,
        uid: widget.uid,
        background: img.url,
        // foreground: 'TODO', // TODO: get from api.getSections
        // foregroundIcon: 'TODO', // TODO: get from api.getSections
        variant: hasSearch ? WIDGET_HERO_SEARCH : undefined,
      }
    }
    if (type === 'ScheduleWidget') {
      let hasShare = false
      settings.every(({ category, key, value }) => {
        if (category === 'presentation' && key === 'share') {
          hasShare = value
        }
      })
      let audio
      let heading
      let subheading
      let url
      content.every(
        ({
          id: contentId,
          audio: contentAudio,
          title: contentHeading,
          subtitle: contentSubheading,
          type: contentType,
        }) => {
          if (contentAudio) {
            audio = contentAudio.path
          }
          if (contentHeading) {
            heading = contentHeading
          }
          if (contentSubheading) {
            subheading = contentSubheading
          }
          if (contentId && contentType) {
            if (contentType === 'FVWord') {
              url = `word/${contentId}`
            }
          }
        }
      )

      return {
        audio,
        hasShare,
        heading,
        subheading,
        title: widget.title,
        type: WIDGET_SCHEDULE,
        url,
      }
    }

    if (type === 'ListWidget') {
      let listId
      settings.some(({ category, key, value }) => {
        if (category === 'general' && key === 'list_id') {
          listId = value
          // break out of loop
          return true
        }
        return false
      })
      const _content = content.map(({ audio, count, heading, id, image, subheading, title, type: contentType }) => {
        if (contentType === 'FVWord') {
          return {
            type: WIDGET_LIST_WORD,
            id, // TODO: DROP?
            audio,
            heading,
            image,
            subheading,
            url: `word/${id}`,
          }
        }
        if (contentType === 'PhraseBook') {
          return {
            type: WIDGET_LIST_PHRASE,
            id, // TODO: DROP?
            heading: title,
            image,
            listCount: count,
            url: `phrases/${id}`,
          }
        }
        return {
          type: WIDGET_LIST_GENERIC,
          id,
          audio,
          contentType,
          heading,
          image,
          listCount: count,
          listType: undefined,
          subheading,
          title,
          url: undefined, // TODO ?
        }
      })
      return {
        type: WIDGET_LIST,
        uid: widget.uid,
        languageUid: properties['widget:dialect'],
        title: widget['dc:title'],
        listUid: listId,
        content: _content,
      }
    }
    return widget
  })
  return {
    uid,
    pageTitle: properties['dc:title'],
    widgets,
  }
}

export default homeAdaptor
