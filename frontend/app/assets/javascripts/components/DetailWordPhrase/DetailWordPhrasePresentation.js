import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import Preview from 'views/components/Editor/Preview'
import FVLabel from 'views/components/FVLabel/index'
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel'
import NavigationHelpers from 'common/NavigationHelpers'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'

/**
 * @summary DetailWordPhrasePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailWordPhrasePresentation({
  acknowledgement,
  audio,
  categories,
  culturalNotes,
  definitions,
  dialectClassName,
  docType,
  literalTranslations,
  metadata,
  partOfSpeech,
  photos,
  phrases,
  pronunciation,
  properties,
  pushWindowPath,
  relatedAssets,
  relatedToAssets,
  siteTheme,
  title,
  videos,
}) {
  // Thanks: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby
  const _groupBy = (arrOfObj, property = 'language') => {
    const _arrOfObj = [...arrOfObj]
    // eslint-disable-next-line
    return _arrOfObj.reduce((r, v, i, a, k = v[property]) => ((r[k] || (r[k] = [])).push(v), r), {})
  }
  const _getAcknowledgement = (_acknowledgement) => {
    if (_acknowledgement && _acknowledgement !== '') {
      return (
        <div className="DialectViewWordPhraseContentItem">
          <h4 className="DialectViewWordPhraseContentItemTitle">
            <FVLabel transKey="acknowledgement" defaultStr="Acknowledgement" transform="first" />
          </h4>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div>{_acknowledgement}</div>
          </div>
        </div>
      )
    }
    return null
  }
  const _getAudio = (audioData) => {
    const audioPreviews = audioData.map((_audio) => {
      return (
        <Preview
          key={selectn('uid', _audio)}
          expandedValue={_audio}
          optimal
          type="FVAudio"
          styles={{ padding: 0, display: 'inline' }}
        />
      )
    })
    return audioPreviews.length > 0 ? (
      <div data-testid="DialectViewWordPhraseAudio" className="DialectViewWordPhraseAudio">
        {audioPreviews}
      </div>
    ) : null
  }

  const _getCategories = (cats) => {
    const transKey = docType === 'FVPhrase' ? 'phrase books' : 'categories'
    const defaultStr = docType === 'FVPhrase' ? 'Phrase books' : 'Categories'
    const _categories = cats.map((category, key) => {
      return <li key={key}>{selectn('dc:title', category)}</li>
    })
    return _categories.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCategory">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey={transKey} defaultStr={defaultStr} transform="first" />
        </h4>
        <ul>{_categories}</ul>
      </div>
    ) : null
  }

  const _getCulturalNotes = (cultNotes) => {
    const _culturalNotes = cultNotes.map((culturalNote, key) => {
      return <div key={key}>{culturalNote}</div>
    })
    return _culturalNotes.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCulturalNote">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.cultural_notes"
            defaultStr="Cultural Notes"
            transform="first"
          />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{_culturalNotes}</div>
      </div>
    ) : null
  }

  const _getDefinitions = (defs) => {
    let _definitions = []
    if (defs) {
      const groupedDefinitions = _groupBy(defs)

      for (const property in groupedDefinitions) {
        if (groupedDefinitions.hasOwnProperty(property)) {
          const definition = groupedDefinitions[property]
          _definitions = definition.map((entry, index) => {
            return (
              <div key={index} className="DialectViewWordPhraseDefinitionSet">
                <h4 className="DialectViewWordPhraseDefinitionLanguage">{entry.language}</h4>
                <p className="DialectViewWordPhraseDefinitionEntry">{entry.translation}</p>
              </div>
            )
          })
        }
      }
    }
    return _definitions.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseDefinition">
        <div className="DialectViewWordPhraseContentItemGroup">{_definitions}</div>
      </div>
    ) : null
  }

  const _getLiteralTranslations = (litTrans) => {
    let _literalTranslations = []
    if (litTrans) {
      const groupedLiteralTranslations = _groupBy(litTrans)

      for (const property in groupedLiteralTranslations) {
        if (groupedLiteralTranslations.hasOwnProperty(property)) {
          const literalTranslation = groupedLiteralTranslations[property]
          _literalTranslations = literalTranslation.map((entry, index) => {
            return (
              <div key={index} className="DialectViewWordPhraseLiteralTranslationSet">
                <h4 className="DialectViewWordPhraseLiteralTranslationLanguage">{entry.language}</h4>
                <p className="DialectViewWordPhraseLiteralTranslationEntry">{entry.translation}</p>
              </div>
            )
          })
        }
      }
    }
    return _literalTranslations.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseLiteralTranslation">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.literal_translations"
            defaultStr="Literal Translations"
            transform="first"
          />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{_literalTranslations}</div>
      </div>
    ) : null
  }

  const _getMetadata = (data) => {
    if (data) {
      return <MetadataPanel properties={properties} computeEntity={data} />
    }
    return null
  }

  const _getPartOfSpeech = (_partOfSpeech) => {
    return _partOfSpeech ? (
      <div className="DialectViewWordPhraseContentItem">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="part_of_speech" defaultStr="Part of Speech" transform="first" />
        </h4>
        <div className="DialectViewWordPhraseContentItemGroup">
          <div>{_partOfSpeech}</div>
        </div>
      </div>
    ) : null
  }

  const _getPhotos = (photosData) => {
    const _photos = photosData.map((picture, key) => {
      return {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
    })

    return _photos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhoto">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="photo_s" defaultStr="PHOTO(S)" transform="first" />
        </h4>
        <div className="row media-panel media-panel-FVPicture">
          <div className="col-xs-12">
            {_photos.map((photo) => (
              <Preview key={photo.id} expandedValue={photo.object} type="FVPicture" />
            ))}
          </div>
        </div>
      </div>
    ) : null
  }

  const _getPhrases = (phrasesData) => {
    const _phrases = phrasesData.map((phrase, key) => {
      const phraseDefinitions = selectn('fv:definitions', phrase)
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')
      const phraseLink = (
        <a
          key={selectn('uid', phrase)}
          href={hrefPath}
          onClick={(e) => {
            e.preventDefault()
            NavigationHelpers.navigate(hrefPath, pushWindowPath, false)
          }}
        >
          {selectn('dc:title', phrase)}
        </a>
      )

      if (phraseDefinitions.length === 0) {
        return <p key={key}>{phraseLink}</p>
      }
      return (
        <div key={key}>
          <p>
            {phraseLink}
            {phraseDefinitions.map((groupValue, innerKey) => {
              return (
                <span key={innerKey} className="DialectViewRelatedPhrasesDefinition">
                  {groupValue.translation}
                </span>
              )
            })}
          </p>
        </div>
      )
    })
    return _phrases.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="related_phrases" defaultStr="Related Phrases" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{_phrases}</div>
      </div>
    ) : null
  }

  const _getRelations = (assetData) => {
    return assetData.map((asset) => {
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, asset, 'words')
      return (
        <a key={selectn('uid', asset)} href={hrefPath}>
          <li>{selectn('dc:title', asset)}</li>
        </a>
      )
    })
  }

  const _getRelatedAssets = (relatedAssetsData) => {
    const assets = _getRelations(relatedAssetsData)
    return assets.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          {/* When change from Related Words -> Related Assets change label below */}
          <FVLabel transKey="related_assets" defaultStr="Related Words" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">
          <ul>{assets}</ul>
        </div>
      </div>
    ) : null
  }

  const _getRelatedToAssets = (relatedToAssetData) => {
    const assets = _getRelations(relatedToAssetData)
    return assets.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="related_by_assets" defaultStr="See Also" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">
          <ul>{assets}</ul>
        </div>
      </div>
    ) : null
  }

  const _getPronounciation = (pronunciationData) => {
    if (pronunciationData && pronunciationData !== '') {
      return (
        <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePronounciation">
          <h3 className="DialectViewWordPhraseContentItemTitle">
            <FVLabel transKey="pronunciation" defaultStr="Pronunciation" transform="first" />
          </h3>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div className={dialectClassName}>{pronunciationData}</div>
          </div>
        </div>
      )
    }
    return null
  }

  const _getVideos = (videosData) => {
    const _videos = videosData.map((video, key) => {
      return {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
    })
    return _videos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseVideo">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="video_s" defaultStr="VIDEO(S)" transform="first" />
        </h4>
        <div className="row media-panel media-panel-FVVideo">
          <div className="col-xs-12">
            {_videos.map((video) => (
              <Preview key={video.id} expandedValue={video.object} type="FVVideo" />
            ))}
          </div>
        </div>
      </div>
    ) : null
  }

  return (
    <div className="DialectViewWordPhrase" id="contentMain">
      <div className="DialectViewWordPhraseGroup">
        <div className="DialectViewWordPhraseContentPrimary">
          <div className="DialectViewWordPhraseTitleAudio">
            <h2 className={`DialectViewWordPhraseTitle ${dialectClassName}`}>
              {title} {_getAudio(audio)}
            </h2>
          </div>
          {_getDefinitions(definitions)}
          {_getPhrases(phrases)}
          {_getCulturalNotes(culturalNotes)}
          {_getLiteralTranslations(literalTranslations)}
          {_getPronounciation(pronunciation)}
          {_getRelatedAssets(relatedAssets)}
          {_getRelatedToAssets(relatedToAssets)}
        </div>

        <aside className="DialectViewWordPhraseContentSecondary">
          {_getPhotos(photos)}
          {_getVideos(videos)}
          {_getCategories(categories)}
          {_getPartOfSpeech(partOfSpeech)}
          {_getAcknowledgement(acknowledgement)}

          {/* METADATA PANEL */}
          {_getMetadata(metadata)}
        </aside>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, func, object, string } = PropTypes
DetailWordPhrasePresentation.propTypes = {
  acknowledgement: string,
  audio: array,
  categories: array,
  culturalNotes: array,
  definitions: array,
  dialectClassName: string,
  docType: string,
  literalTranslations: array,
  metadata: object,
  partOfSpeech: string,
  photos: array,
  phrases: array,
  pronunciation: string,
  properties: object.isRequired,
  pushWindowPath: func,
  relatedAssets: array,
  relatedToAssets: array,
  siteTheme: string,
  title: string,
  videos: array,
}

DetailWordPhrasePresentation.defaultProps = {
  dialectClassName: '',
  audio: [],
  categories: [],
  culturalNotes: [],
  definitions: [],
  docType: '',
  literalTranslations: [],
  photos: [],
  phrases: [],
  pushWindowPath: () => {},
  relatedAssets: [],
  relatedToAssets: [],
  siteTheme: 'explore',
  videos: [],
}

export default DetailWordPhrasePresentation
