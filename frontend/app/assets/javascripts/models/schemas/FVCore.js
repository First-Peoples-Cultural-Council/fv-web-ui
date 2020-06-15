import t from 'tcomb-form'

const FVCore = {
  'fv:definitions': t.list(
    t.struct({
      translation: t.String,
      language: t.String,
    })
  ),
  'fv:literal_translation': t.list(
    t.struct({
      translation: t.String,
      language: t.String,
    })
  ),
  'fv:related_pictures': t.list(t.String),
  'fv:related_videos': t.list(t.String),
  'fv:related_audio': t.list(t.String),
  'fv:related_assets': t.list(t.String),
  'fv:cultural_note': t.list(t.String),
  'fv:available_in_childrens_archive': t.Boolean,
  'fv:custom_order': t.maybe(t.String),
  'fv:reference': t.maybe(t.String),
  'fv:source': t.list(t.String),
}

export default FVCore
