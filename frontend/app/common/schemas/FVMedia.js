import t from 'tcomb-form'

const FVMedia = {
  file: t.form.File,
  'fvm:shared': t.Boolean,
  'fvm:child_focused': t.Boolean,
  'fvm:recorder': t.list(t.String),
  'fvm:source': t.list(t.String),
}

export default FVMedia
