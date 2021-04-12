import t from 'tcomb-form'

import Dublincore from 'common/schemas/Dublincore'
import FVCore from 'common/schemas/FVCore'
import FVMedia from 'common/schemas/FVMedia'

// Very basic email validation
const Email = t.subtype(t.String, (email) => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return reg.test(email)
})

const AgeRanges = t.enums.of(
  '6-10 11-15 16-20 21-25 26-30 31-35 36-40 41-45 46-50 51-55 56-60 61-65 66-70 71-75 76-80 81-85 86-90 91-95 96-100 100+'
)

const fields = {
  FVWord: Object.assign({}, Dublincore, FVCore, {
    'fv-word:categories': t.list(t.String),
    'fv-word:pronunciation': t.maybe(t.String),
    'fv-word:related_phrases': t.list(t.String),
    'fv-word:part_of_speech': t.maybe(t.String),
    'fv-word:available_in_games': t.Boolean,
    'fv-word:acknowledgement': t.maybe(t.String),
    'fv:related_audio': t.list(t.maybe(t.String)),
    'fv:general_note': t.maybe(t.String),
    'fv:related_assets': t.list(t.maybe(t.String)),
    'fv:related_pictures': t.list(t.maybe(t.String)),
    'fv:related_videos': t.list(t.maybe(t.String)),
  }),
  FVPhrase: Object.assign({}, Dublincore, FVCore, {
    'fv:literal_translation': t.maybe(t.String),
    'fv-phrase:phrase_books': t.list(t.String),
    'fv-phrase:acknowledgement': t.maybe(t.String),
    'fv:general_note': t.maybe(t.String),
    'fv:related_audio': t.list(t.maybe(t.String)),
    'fv:related_pictures': t.list(t.maybe(t.String)),
    'fv:related_videos': t.list(t.maybe(t.String)),
  }),
  FVAudio: Object.assign({}, Dublincore, FVMedia),
  FVPicture: Object.assign({}, Dublincore, FVMedia),
  FVVideo: Object.assign({}, Dublincore, FVMedia),
  FVBook: Object.assign({}, Dublincore, FVCore, {
    'fv:definitions': t.maybe(t.String),
    'fv:literal_translation': t.maybe(t.String),
    'fvbook:title_literal_translation': t.list(
      t.struct({
        translation: t.String,
        language: t.String,
      })
    ),
    'fvbook:introduction': t.maybe(t.String),
    'fvbook:introduction_literal_translation': t.maybe(
      t.list(
        t.struct({
          translation: t.String,
          language: t.String,
        })
      )
    ),
    'fvbook:author': t.list(t.String),
    'fvbook:type': t.String,
    'fv:related_audio': t.list(t.maybe(t.String)),
    'fv:related_pictures': t.list(t.maybe(t.String)),
    'fv:related_videos': t.list(t.maybe(t.String)),
  }),
  FVBookEntry: Object.assign({}, Dublincore, FVCore, {
    'fv:definitions': t.maybe(t.String),
    'fv:available_in_childrens_archive': t.maybe(t.String),
    'fv:literal_translation': t.maybe(
      t.list(
        t.struct({
          translation: t.String,
          language: t.String,
        })
      )
    ),
    'fvbookentry:dominant_language_text': t.list(
      t.struct({
        translation: t.String,
        language: t.String,
      })
    ),
    'fv:related_audio': t.list(t.maybe(t.String)),
    'fv:related_pictures': t.list(t.maybe(t.String)),
    'fv:related_videos': t.list(t.maybe(t.String)),
  }),
  FVPortal: {
    'fv-portal:greeting': t.String,
    'fv-portal:featured_audio': t.maybe(t.String),
    'fv-portal:about': t.String,
    'fv-portal:news': t.maybe(t.String),
    'fv-portal:background_top_image': t.String,
    'fv-portal:logo': t.String,
    'fv-portal:featured_words': t.list(t.String),
    'fv-portal:related_links': t.list(t.String),
  },
  FVGallery: Object.assign({}, Dublincore, {
    'fv:related_pictures': t.list(t.String),
  }),
  FVPhraseBook: Object.assign({}, Dublincore, {
    'fvcategory:image': t.maybe(t.String),
  }),
  FVCategory: Object.assign({}, Dublincore, {
    'fvcategory:parent_category': t.maybe(t.String),
    'fvcategory:image': t.maybe(t.String),
  }),
  FVContributor: Object.assign({}, Dublincore),
  FVDialect: Object.assign({}, Dublincore, {
    'fvdialect:about_our_language': t.String,
    'fvdialect:country': t.String,
    'fvdialect:dominant_language': t.String,
    'fvdialect:region': t.String,
    'fvdialect:keyboards': t.list(t.String),
    'fvdialect:language_resources': t.list(t.String),
    'fvdialect:contact_information': t.String,
  }),
  FVCharacter: Object.assign(
    {},
    {
      'dc:title': t.String,
      'fvcharacter:upper_case_character': t.maybe(t.String),
      'fvcharacter:alphabet_order': t.maybe(t.Number),
      'fvcharacter:related_words': t.list(t.String),
      'fv:related_audio': t.list(t.maybe(t.String)),
      'fv:related_videos': t.list(t.String),
    }
  ),
  FVUser: {
    'userinfo:firstName': t.String,
    'userinfo:lastName': t.String,
    'userinfo:email': Email,
    'fvuserinfo:requestedSpace': t.String,
    'fvuserinfo:role': t.String,
    'fvuserinfo:ageGroup': t.maybe(AgeRanges),
    'fvuserinfo:phone': t.maybe(t.String),
    'fvuserinfo:comment': t.maybe(t.String),
    'fvuserinfo:community_member': t.maybe(t.Boolean),
    'fvuserinfo:language_team_member': t.maybe(t.Boolean),
  },
  FVUserJoin: {
    'fvuserinfo:requestedSpace': t.String,
    'fvuserinfo:role': t.String,
    'fvuserinfo:comment': t.maybe(t.String),
    'fvuserinfo:community_member': t.maybe(t.Boolean),
    'fvuserinfo:language_team_member': t.maybe(t.Boolean),
  },
  FVLink: Object.assign({}, Dublincore, {
    'dc:description': t.maybe(t.String),
    'fvlink:url': t.maybe(t.String) /*,
    'file:content': t.maybe(t.form.File)*/,
  }),
  FVLabel: Object.assign(
    {},
    {
      'fv:related_audio': t.list(t.maybe(t.String)),
    }
  ),
}

export default fields

// Sample usage with tcomb
// const FVPortal = t.struct(selectn('FVPortal', fields));
