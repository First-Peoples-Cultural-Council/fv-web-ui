import DOMPurify from 'dompurify'
import selectn from 'selectn'

// Data for Cover
const dominantLanguageTitleTranslation = ({ serverResponse, defaultLanguage = 'english' }) => {
  return (selectn('properties.fvbook:title_literal_translation', serverResponse) || []).filter(function getTranslation(
    translation
  ) {
    return translation.language === defaultLanguage
  })
}

const dominantLanguageIntroductionTranslation = ({ serverResponse, defaultLanguage = 'english' }) => {
  return (selectn('properties.fvbook:introduction_literal_translation', serverResponse) || []).filter(
    function getTranslation(translation) {
      return translation.language === defaultLanguage
    }
  )
}

export const getBookData = ({ computeBookData, defaultLanguage = 'english', intl }) => {
  return {
    uid: selectn('uid', computeBookData),
    type: selectn('properties.fvbook:type', computeBookData) || '',
    title: DOMPurify.sanitize(selectn('title', computeBookData)),
    titleTranslation: DOMPurify.sanitize(
      selectn('[0].translation', dominantLanguageTitleTranslation({ serverResponse: computeBookData, defaultLanguage }))
    ),
    authors: (selectn('contextParameters.book.authors', computeBookData) || []).map((author) => {
      return selectn('dc:title', author)
    }),
    introduction: {
      label: intl.trans('introduction', 'Introduction', 'first'),
      content: selectn('properties.fvbook:introduction', computeBookData) || '',
    },
    introductionTranslation: {
      label: intl.searchAndReplace(defaultLanguage),
      content:
        selectn(
          '[0].translation',
          dominantLanguageIntroductionTranslation({ serverResponse: computeBookData, defaultLanguage })
        ) || '',
    },
  }
}

export const getBookAudioVideo = ({ data, type, baseUrl }) => {
  const mediaArray = []
  data.forEach((doc, key) => {
    const extractedData = {
      original: `${baseUrl}${doc.path}` || 'assets/images/cover.png',
      thumbnail: selectn('views[0].url', doc) || 'assets/images/cover.png',
      description: doc['dc:description'],
      key: key,
      uid: doc.uid,
      object: doc,
      type: type,
    }
    mediaArray.push(extractedData)
  })
  return mediaArray
}

export const getBookPictures = ({ data }) => {
  const pictures = []
  data.forEach((picture, key) => {
    const pic = {
      original: selectn('views[4].url', picture) || 'assets/images/cover.png',
      thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
      description: picture['dc:description'],
      key: key,
      id: picture.uid,
      object: picture,
      type: 'FVPicture',
    }
    pictures.push(pic)
  })
  return pictures
}
