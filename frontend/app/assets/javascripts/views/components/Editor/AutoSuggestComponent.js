import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchSharedAudios } from 'providers/redux/reducers/fvAudio'
import { fetchSharedContributors } from 'providers/redux/reducers/fvContributor'
import { fetchSharedLinks } from 'providers/redux/reducers/fvLink'
import { fetchSharedPhrases } from 'providers/redux/reducers/fvPhrase'
import { fetchSharedWords } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'
import Autosuggest from 'react-autosuggest'

import LinearProgress from '@material-ui/core/LinearProgress'
import CategoriesDataLayer from 'views/pages/explore/dialect/learn/words/categoriesDataLayer'
const AutoSuggestTheme = {
  container: 'autosuggest dropdown',
  containerOpen: 'dropdown open',
  input: 'form-control',
  suggestionsContainer: 'dropdown-menu',
  suggestion: '',
  suggestionFocused: 'active',
}

let suggestionThrottle

const { func, object, string } = PropTypes

export class AutoSuggestComponent extends Component {
  static propTypes = {
    dialect: object.isRequired,
    locals: object,
    onChange: func.isRequired,
    provider: object,
    type: string.isRequired,
    value: string.isRequired,
    // REDUX: reducers/state
    computeSharedAudios: object.isRequired,
    computeSharedContributors: object.isRequired,
    computeSharedLinks: object.isRequired,
    computeSharedPhrases: object.isRequired,
    computeSharedWords: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchSharedAudios: func.isRequired,
    fetchSharedContributors: func.isRequired,
    fetchSharedLinks: func.isRequired,
    fetchSharedPhrases: func.isRequired,
    fetchSharedWords: func.isRequired,
  }

  shouldRenderSuggestions(value) {
    return value.trim().length > 2
  }

  getSuggestionValue(suggestion) {
    this.props.onChange(event, suggestion)

    return suggestion.title
  }

  renderSuggestion(suggestion) {
    switch (this.props.type) {
      case 'FVWord':
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {suggestion.title}{' '}
            {suggestion.properties['fv-word:part_of_speech']
              ? '(' + suggestion.properties['fv-word:part_of_speech'] + ')'
              : ''}
          </a>
        )

      case 'FVContributor':
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {suggestion.title}{' '}
            {suggestion.properties['dc:description'] ? '(' + suggestion.properties['dc:description'] + ')' : ''}
          </a>
        )

      case 'FVCategory': {
        const breadcrumb = []

        selectn('contextParameters.breadcrumb.entries', suggestion).map((entry, i) => {
          if (entry.type === 'FVCategory') {
            let shared = ''

            if (entry.path.indexOf('SharedData') !== -1)
              shared = ' (' + this.props.intl.trans('shared', 'Shared', 'first') + ')'

            breadcrumb.push(
              <span key={i}>
                {' '}
                &raquo; {entry.title} {shared}
              </span>
            )
          }
        })

        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {breadcrumb}
          </a>
        )
      }
      default:
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {suggestion.title}
          </a>
        )
    }
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      selectObj: null,
    }
    this.suggestionWidget = React.createRef()

    this.onChange = this.onChange.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value != this.state.value) {
      this.setState({
        value: newProps.value,
      })
    }
  }

  loadSuggestions(value) {
    this.setState({ isLoading: true })

    if (suggestionThrottle) {
      clearTimeout(suggestionThrottle)
    }

    suggestionThrottle = setTimeout(
      function suggestionThrottleTimeout() {
        switch (this.props.type) {
          case 'FVAudio':
            this.props.fetchSharedAudios(
              'all_shared_audio',
              {},
              {
                currentPageIndex: 0,
                pageSize: 15,
                queryParams: [value, this.props.dialect.uid],
              }
            )
            break
          case 'FVWord':
            this.props.fetchSharedWords(
              'featured_word_suggestion',
              {},
              {
                currentPageIndex: 0,
                pageSize: 15,
                queryParams: [value, this.props.dialect.uid],
              }
            )
            break
          case 'FVPhrase':
            this.props.fetchSharedPhrases(
              'dialect_phrase_suggestion',
              {},
              {
                currentPageIndex: 0,
                pageSize: 15,
                queryParams: [value, this.props.dialect.uid],
              }
            )
            break
          case 'FVCategory':
            // TODO: NEED TO SUBMIT ENTERED 'value' TO DATALAYER FOR QUERY, at present autosuggest is just listing all categories
            break
          case 'FVContributor':
            this.props.fetchSharedContributors(
              'contributor_suggestion',
              {},
              {
                currentPageIndex: 0,
                pageSize: 15,
                queryParams: [value, this.props.dialect.uid],
              }
            )
            break
          case 'FVLink':
            this.props.fetchSharedLinks(
              'link_suggestion',
              {},
              {
                currentPageIndex: 0,
                pageSize: 15,
                queryParams: [value, this.props.dialect.uid],
              }
            )
            break
          default: // NOTE: do nothing
        }
      }.bind(this),
      750
    )
  }

  onChange(event, { newValue /*, method */ }) {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested({ value }) {
    this.loadSuggestions(value)
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    })
  }

  getComputeType() {
    switch (this.props.type) {
      case 'FVAudio':
        return this.props.computeSharedAudios

      case 'FVWord':
        return this.props.computeSharedWords

      case 'FVPhrase':
        return this.props.computeSharedPhrases

      case 'FVCategory':
        // Handled by switch statement inside render
        break

      case 'FVContributor':
        return this.props.computeSharedContributors

      case 'FVLink':
        return this.props.computeSharedLinks
      default: // NOTE: do nothing
    }
  }

  render() {
    const { value /*, isLoading */ } = this.state
    const inputProps = {
      placeholder: this.props.intl.trans(
        'views.components.editor.start_typing_for_suggestions',
        'Start typing for suggestions...',
        'first'
      ),
      value: value,
      onChange: this.onChange,
    }

    switch (this.props.type) {
      case 'FVCategory':
        return (
          <CategoriesDataLayer value={this.props.value}>
            {({ categoriesData }) => {
              return (
                <div className="row">
                  <div className="col-xs-12">
                    <Autosuggest
                      ref={this.suggestionWidget}
                      theme={AutoSuggestTheme}
                      suggestions={categoriesData}
                      shouldRenderSuggestions={this.shouldRenderSuggestions}
                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                      getSuggestionValue={this.getSuggestionValue}
                      renderSuggestion={this.renderSuggestion}
                      inputProps={inputProps}
                    />
                  </div>
                </div>
              )
            }}
          </CategoriesDataLayer>
        )

      default:
        return (
          <div className="row">
            <div className="col-xs-12">
              <Autosuggest
                ref={this.suggestionWidget}
                theme={AutoSuggestTheme}
                suggestions={this.getComputeType().response.entries || []}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
            </div>
            <div className="col-xs-12">
              <LinearProgress
                variant="indeterminate"
                className={classNames({ hidden: !this.getComputeType().isFetching })}
              />
            </div>
          </div>
        )
    }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvAudio, fvContributor, fvLink, fvPhrase, fvWord, locale } = state

  const { computeSharedAudios } = fvAudio
  const { computeSharedContributors } = fvContributor
  const { computeSharedLinks } = fvLink
  const { computeSharedPhrases } = fvPhrase
  const { computeSharedWords } = fvWord
  const { intlService } = locale

  return {
    computeSharedAudios,
    computeSharedContributors,
    computeSharedLinks,
    computeSharedPhrases,
    computeSharedWords,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchSharedAudios,
  fetchSharedContributors,
  fetchSharedLinks,
  fetchSharedPhrases,
  fetchSharedWords,
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoSuggestComponent)
