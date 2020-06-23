import PropTypes from 'prop-types'

/**
 * @summary ListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListData({ children }) {
  return children({
    columns: [
      { title: 'Adı', field: 'name' },
      { title: 'Soyadı', field: 'surname' },
      { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
      { title: 'Doğum Yeri', field: 'birthCity', lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' } },
    ],
    data: [{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }],
    title: 'Demo Title',
  })
}
// PROPTYPES
const { func } = PropTypes
ListData.propTypes = {
  children: func,
}

export default ListData
