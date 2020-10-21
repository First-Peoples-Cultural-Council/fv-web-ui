import * as React from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'

import FVButton from 'components/FVButton'

const { array, func } = PropTypes

class SearchFields extends React.Component {
  static propTypes = {
    items: array.isRequired,
    setResults: func.isRequired,
  }

  static defaultProps = {
    items: [],
    setResults: () => {},
  }

  constructor(props) {
    super(props)
    this.options = {
      keys: ['base', 'translation'],
      shouldSort: true,
      threshold: 0.25,
      tokenize: true,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
    }
    this.fuse = new Fuse(this.props.items, this.options)

    this.state = {
      inputValue: '',
    }
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }

  checkKey = (e) => {
    if (e.key === 'Enter') {
      this.submitSearch()
    }
  }

  submitSearch = () => {
    const { setResults } = this.props
    const { inputValue } = this.state
    const searchResults = this.fuse.search(inputValue)
    setResults(searchResults)
  }

  resetSearch = () => {
    const { setResults, items } = this.props
    this.setState({ inputValue: '' })
    setResults(items)
  }

  render() {
    const { inputValue } = this.state
    return (
      <div className="SearchDialectForm">
        <div className="SearchDialectFormPrimary">
          <input
            className={'SearchDialectFormPrimaryInput'}
            type="text"
            onChange={this.handleChange('inputValue')}
            onKeyPress={this.checkKey}
            value={inputValue}
          />

          <FVButton variant="contained" onClick={this.submitSearch} color="primary">
            Search Labels {/* need locale key*/}
          </FVButton>

          <FVButton variant="contained" onClick={this.resetSearch} style={{ marginLeft: '20px' }}>
            Reset Search {/* need locale key */}
          </FVButton>
        </div>
      </div>
    )
  }
}

export default SearchFields
