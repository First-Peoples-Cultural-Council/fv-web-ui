/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component, PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Views
import RaisedButton from 'material-ui/lib/raised-button';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Create word entry
 */
@provide
export default class PageDialectWordsCreate extends Component {

    static propTypes = {
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        createWord: PropTypes.func.isRequired,
        computeWord: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            formValue: null,
            wordPath: null
        };

        // Bind methods to 'this'
        ['_onRequestSaveForm'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentWord, nextWord;

        if (this.state.wordPath != null) {
            currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);
            nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this.state.wordPath);
        }

        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }

        // 'Redirect' on success
        if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
            NavigationHelpers.navigate(NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextWord), 'words'), nextProps.replaceWindowPath, true);
        }
    }

    shouldComponentUpdate(newProps, newState) {

        switch (true) {
            case (newProps.windowPath != this.props.windowPath):
                return true;
                break;

            case (newProps.computeDialect2 != this.props.computeDialect2):
                return true;
                break;

            case (newProps.computeWord != this.props.computeWord):
                return true;
                break;
        }

        return false;
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_word_create"].getValue();

        //let properties = '';
        let properties = {};

        for (let key in formValue) {
            if (formValue.hasOwnProperty(key) && key) {
                if (formValue[key] && formValue[key] != '') {
                    //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
                    properties[key] = formValue[key];
                }
            }
        }

        this.setState({
            formValue: properties
        })

        // Passed validation
        if (formValue) {
            let now = Date.now();
            this.props.createWord(this.props.routeParams.dialect_path + '/Dictionary', {
                type: 'FVWord',
                name: now.toString(),
                properties: properties
            }, null, now);

            this.setState({
                wordPath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now
            });

        } else {
            //let firstError = this.refs["form_word_create"].validate().firstError();
            window.scrollTo(0, 0);
        }

    }

    render() {

        let FVWordOptions = Object.assign({}, selectn("FVWord", options));

        const computeEntities = Immutable.fromJS([{
            'id': this.state.wordPath,
            'entity': this.props.computeWord
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        // Set default value on form
        if (selectn("fields.fv:definitions.item.fields.language.attrs", FVWordOptions) && selectn('response.properties.fvdialect:dominant_language', computeDialect2)) {
            FVWordOptions['fields']['fv:definitions']['item']['fields']['language']['attrs']['defaultValue'] = selectn('response.properties.fvdialect:dominant_language', computeDialect2);
        }

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <h1>{intl.trans('views.pages.explore.dialect.learn.words.add_new_word_to_x', 'Add New Word to ' + selectn('response.title', computeDialect2), null, [selectn('response.title', computeDialect2)])}</h1>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm}>
                        <t.form.Form
                            ref="form_word_create"
                            type={t.struct(selectn("FVWord", fields))}
                            context={selectn('response', computeDialect2)}
                            value={this.state.formValue}
                            options={FVWordOptions}/>
                        <div className="form-group">
                            <button type="submit"
                                    className="btn btn-primary">{intl.trans('save', 'Save', 'first')}</button>
                        </div>
                    </form>

                </div>

            </div>

        </PromiseWrapper>;
    }
}