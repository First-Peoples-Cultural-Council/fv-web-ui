import {
  WIDGET_CONTACT,
  WIDGET_HERO,
  WIDGET_HERO_SEARCH,
  WIDGET_SCHEDULE,
  WIDGET_LIST,
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_SONG,
  // WIDGET_LIST_MIXED,
  WIDGET_LIST_GENERIC,
  WIDGET_WELCOME,
} from 'common/constants'

function homeAdaptor(response) {
  const { properties, uid } = response
  const widgetsActive = properties?.['widgets:active'] || []
  const widgets = widgetsActive.map((widget) => {
    const content = widget['widget:content'] || []
    const settings = widget['settings:settings'] || []
    const type = widget?.['widget:type']
    /*
     * Hero Widget
     */
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
    /*
     * Contact Widget
     */
    if (type === 'ContactWidget') {
      let contactEmail = ''
      let links = []
      let contactText = ''
      settings.forEach(function assignValues({ category, key, value }) {
        if (category === 'general' && key === 'contact_email') {
          contactEmail = value
        }
        if (category === 'general' && key === 'social_links') {
          links = value
        }
        if (category === 'general' && key === 'contact_text') {
          contactText = value
        }
        return
      })
      return {
        type: WIDGET_CONTACT,
        uid: widget.uid,
        title: widget['dc:title'],
        dialectId: widget['widget:dialect'],
        contactEmail: contactEmail,
        links: links,
        contactText: contactText,
      }
    }
    /*
     * Schedule Widget - e.g. Word of the Day
     */
    if (type === 'ScheduleWidget') {
      let hasShare = false
      settings.forEach(function assignValues({ category, key, value }) {
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
        title: widget['dc:title'],
        type: WIDGET_SCHEDULE,
        url,
      }
    }
    /*
     * List Widget - e.g. Topics
     */
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
      const _content = content.map(
        ({ audio: audioObj, count, heading, id, image: imageObj, subheading, type: contentType }) => {
          let image
          if (imageObj) {
            image = imageObj.path
          }
          let audio
          if (audioObj) {
            audio = audioObj.path
          }
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
              id,
              heading,
              image,
              listCount: count,
              url: `phrase/${id}`,
            }
          }
          if (contentType === 'FVBook') {
            return {
              type: WIDGET_LIST_STORY,
              id,
              heading,
              subheading,
              image,
              url: `story/${id}`,
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
            url: undefined, // TODO ?
          }
        }
      )
      return {
        type: WIDGET_LIST,
        uid: widget.uid,
        languageUid: properties['widget:dialect'],
        title: widget['dc:title'],
        listUid: listId,
        content: _content,
      }
    }
    /*
     * Contact Widget
     */
    if (type === 'WelcomeWidget') {
      let welcomeText = ''
      let welcomeAudio
      settings.forEach(function assignValues({ category, key, value }) {
        if (category === 'general' && key === 'welcome_text') {
          welcomeText = value
        }
        if (category === 'general' && key === 'welcome_audio') {
          welcomeAudio = value
        }
        return
      })
      return {
        type: WIDGET_WELCOME,
        uid: widget.uid,
        title: widget['dc:title'],
        dialectId: widget['widget:dialect'],
        heading: welcomeText,
        audio: welcomeAudio,
      }
    }
    return widget
  })
  return {
    uid,
    pageTitle: properties?.['dc:title'],
    widgets,
  }
}

export default homeAdaptor
