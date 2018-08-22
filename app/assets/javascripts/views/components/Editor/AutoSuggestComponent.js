import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import Autosuggest from 'react-autosuggest';

import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import LinearProgress from 'material-ui/lib/linear-progress';
import IntlService from "views/services/intl";

const theme = {
    container: 'autosuggest dropdown',
    containerOpen: 'dropdown open',
    input: 'form-control',
    suggestionsContainer: 'dropdown-menu',
    suggestion: '',
    suggestionFocused: 'active'
};

let suggestionThrottle;

const intl = IntlService.instance;

@provide
export default class AutoSuggestComponent extends Component {
    static propTypes = {
        fetchSharedAudios: PropTypes.func.isRequired,
        computeSharedAudios: PropTypes.object.isRequired,
        fetchSharedWords: PropTypes.func.isRequired,
        computeSharedWords: PropTypes.object.isRequired,
        fetchSharedPhrases: PropTypes.func.isRequired,
        computeSharedPhrases: PropTypes.object.isRequired,
        fetchSharedCategories: PropTypes.func.isRequired,
        computeSharedCategories: PropTypes.object.isRequired,
        fetchSharedContributors: PropTypes.func.isRequired,
        computeSharedContributors: PropTypes.object.isRequired,
        fetchSharedLinks: PropTypes.func.isRequired,
        computeSharedLinks: PropTypes.object.isRequired,
        dialect: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        provider: PropTypes.object,
        locals: PropTypes.object
    };

    static contextTypes = {
        muiTheme: PropTypes.object
    };

    shouldRenderSuggestions(value) {
        return value.trim().length > 2;
    }

    getSuggestionValue(suggestion) {
        this.props.onChange(
            event, suggestion
        );

        return suggestion.title;
    }

    renderSuggestion(suggestion) {
        switch (this.props.type) {
            case 'FVWord':
                return (
                    <a href='javascript:void(0);'>{suggestion.title} {(suggestion.properties['fv-word:part_of_speech']) ? '(' + suggestion.properties['fv-word:part_of_speech'] + ')' : ''}</a>);
                break;

            case 'FVContributor':
                return (
                    <a href='javascript:void(0);'>{suggestion.title} {(suggestion.properties['dc:description']) ? '(' + suggestion.properties['dc:description'] + ')' : ''}</a>);
                break;

            case 'FVCategory':

                let breadcrumb = [];

                selectn('contextParameters.breadcrumb.entries', suggestion).map(function (entry, i) {
                    if (entry.type === 'FVCategory') {
                        let shared = '';

                        if (entry.path.indexOf('SharedData') !== -1)
                            shared = ' (' + intl.trans('shared', 'Shared', 'first') + ')';

                        breadcrumb.push(<span key={i}> &raquo; {entry.title} {shared}</span>);
                    }
                });

                return (<a href='javascript:void(0);'>{breadcrumb}</a>);
                break;

            default:
                return (<a href='javascript:void(0);'>{suggestion.title}</a>);
                break;
        }
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: '',
            suggestions: [],
            isLoading: false,
            selectObj: null
        };

        this.onChange = this.onChange.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.value && newProps.value != this.state.value) {
            this.setState({
                value: newProps.value
            });
        }
    }

    loadSuggestions(value) {
        this.setState({isLoading: true});

        if (suggestionThrottle) {
            clearTimeout(suggestionThrottle);
        }

        suggestionThrottle = setTimeout(function () {
            switch (this.props.type) {
                case 'FVAudio':
                    this.props.fetchSharedAudios('all_shared_audio', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
                    break;
                case 'FVWord':
                    this.props.fetchSharedWords('featured_word_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
                    break;
                case 'FVPhrase':
                    this.props.fetchSharedPhrases('dialect_phrase_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
                    break;
                case 'FVCategory':
                    this.props.fetchSharedCategories(this.props.provider.name, 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.path + '/' + this.props.provider.folder, {'X-NXenrichers.document': 'breadcrumb'});
                    break;
                case 'FVContributor':
                    this.props.fetchSharedContributors('contributor_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
                    break;
                case 'FVLink':
                    this.props.fetchSharedLinks('link_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
                    break;
            }
        }.bind(this), 750);
    }

    onChange(event, {newValue, method}) {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsFetchRequested({value}) {
        this.loadSuggestions(value);
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }


    getComputeType() {
        switch (this.props.type) {
            case 'FVAudio':
                return this.props.computeSharedAudios;
                break;

            case 'FVWord':
                return this.props.computeSharedWords;
                break;

            case 'FVPhrase':
                return this.props.computeSharedPhrases;
                break;

            case 'FVCategory':
                return this.props.computeSharedCategories;
                break;

            case 'FVContributor':
                return this.props.computeSharedContributors;
                break;

            case 'FVLink':
                return this.props.computeSharedLinks;
                break;
        }
    }

    render() {

        const {value, isLoading} = this.state;
        const inputProps = {
            'placeholder': intl.trans('views.components.editor.start_typing_for_suggestions', "Start typing for suggestions...", 'first'),
            'value': value,
            'onChange': this.onChange
        };

        const status = (this.getComputeType().isFetching) ? intl.trans('loading', 'Loading', 'first') : intl.trans('ready', 'Ready', 'first');

        return (
            <div className="row">
                <div className="col-xs-12">

                    <Autosuggest
                        ref="suggestion_widget"
                        theme={theme}
                        suggestions={this.getComputeType().response.entries || []}
                        shouldRenderSuggestions={this.shouldRenderSuggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}/>

                </div>

                <div className="col-xs-12">
                    <LinearProgress mode="indeterminate"
                                    className={classNames({'hidden': !this.getComputeType().isFetching})}/>
                </div>

            </div>
        );
    }
}
