import t from 'tcomb-form'
import IntlService from 'common/services/IntlService'

const intl = IntlService.instance

function makeOptional(schema) {
  return Object.keys(schema).reduce((p, c) => ({ ...p, ...{ [c]: t.maybe(schema[c]) } }), {})
}

const Roles = t.enums({
  Anything: intl.trans('any_role', 'Any Role', 'words'),
  Record: intl.trans('recorder', 'Recorder', 'first'),
  Approve: intl.trans('approver', 'Approver', 'first'),
  Manage: intl.trans('admin', 'Admin', 'first'),
  Member: intl.trans('member', 'Member', 'first'),
})

const ResourceTypes = t.enums({
  FVPicture: intl.trans('pictures', 'Pictures', 'first'),
  FVAudio: intl.trans('audio', 'Audio', 'first'),
  FVVideo: intl.trans('video', 'Videos', 'first'),
})

const BookTypes = t.enums({
  song: intl.trans('song_book', 'Song Book', 'first'),
  story: intl.trans('story_book', 'Story Book', 'first'),
})

const ReportItemTypes = t.enums({
  words: intl.trans('words', 'Words', 'first'),
  phrases: intl.trans('phrases', 'Phrases', 'first'),
  songs: intl.trans('songs', 'Songs', 'first'),
  stories: intl.trans('stories', 'Stories', 'first'),
})

const MaxMB = t.refinement(t.Number, (n) => {
  return n <= 2000
})

const ResourcesFields = {
  'properties.dc:title': t.String,
  'properties.type': ResourceTypes,
  'common:size': MaxMB,
  'picture:info.height': t.Number,
  'picture:info.width': t.Number,
  'dc:contributors': t.String,
  'fvm:child_focused': t.Boolean,
  'fvm:origin': t.Boolean,
  'fvm:shared': t.Boolean,
}

const ResourcesSelectorFields = Object.assign({}, ResourcesFields, {
  shared_fv: t.Boolean,
  shared_dialects: t.Boolean,
})

delete ResourcesSelectorFields['properties.type']
delete ResourcesSelectorFields['fvm:shared']
delete ResourcesSelectorFields['fvm:origin']

const filterFields = {
  Default: {
    'properties.dc:title': t.String,
  },
  Portals: makeOptional({
    'contextParameters.ancestry.dialect.dc:title': t.String,
    'contextParameters.portal.roles': Roles,
  }),
  ResourcesSelector: makeOptional(ResourcesSelectorFields),
  Resources: makeOptional(ResourcesFields),
  Books: makeOptional({
    'properties.dc:title': t.String,
    'properties.fvbook:type': BookTypes,
  }),
  User: makeOptional({
    searchTerm: t.String,
    group: t.String,
  }),
  Reports: makeOptional({
    name: t.String,
    type: ReportItemTypes,
  }),
  Search: {
    searchTerm: t.String,
    documentTypes: t.maybe(
      t.list(
        t.enums({
          FVWord: intl.trans('words', 'Words', 'first'),
          FVPhrase: intl.trans('phrases', 'Phrases', 'first'),
          FVPortal: intl.trans('dialects', 'Dialects', 'first'),
          FVBook: intl.trans('song_story_books', 'Song/Story Books', 'words'),
        })
      )
    ),
  },
}

export default filterFields
