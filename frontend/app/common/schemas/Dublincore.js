import t from 'tcomb-form'

const Dublincore = {
  'dc:title': t.String,
  'dc:description': t.maybe(t.String),
}

export default Dublincore
