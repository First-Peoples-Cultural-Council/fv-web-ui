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
import PropTypes from 'prop-types';

import React, { Component } from 'react';

import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import TextHeader from 'views/components/Document/Typography/text-header';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Sidebar for learning page
 */
export default class ToolbarNavigation extends Component {

    static propTypes = {
        dialect: PropTypes.object.isRequired,
        properties: PropTypes.object.isRequired,
        isSection: PropTypes.bool.isRequired,
    };

    constructor(props, context) {
        super(props, context);

        [].forEach((method => this[method] = this[method].bind(this)));
    }

    render() {

        let {dialect, properties, isSection} = this.props;

        return <div className="row">

            <div className={classNames('col-xs-12')}>
                {(() => {
                    if (selectn('response.contextParameters.dialect.language_resources.length', dialect.compute) > 0 || !isSection) {
                        return <AuthorizationFilter
                            filter={{permission: 'Write', entity: selectn('response', dialect.compute)}}
                            renderPartial={true}>
                            <div>
                                <TextHeader title={intl.trans('language_resources', 'Language Resources', 'upper')}
                                            tag="h2" properties={properties}/>
                                <EditableComponentHelper
                                    isSection={isSection}
                                    computeEntity={dialect.compute}
                                    updateEntity={dialect.update}
                                    showPreview={true}
                                    previewType="FVLink"
                                    property="fvdialect:language_resources"
                                    sectionProperty="contextParameters.dialect.language_resources"
                                    entity={selectn('response', dialect.compute)}/>
                            </div>
                        </AuthorizationFilter>;
                    }
                })()}
            </div>

            <div className={classNames('col-xs-12')}>
                {(() => {
                    if (selectn('response.contextParameters.dialect.keyboards.length', dialect.compute) > 0 || !isSection) {
                        return <AuthorizationFilter
                            filter={{permission: 'Write', entity: selectn('response', dialect.compute)}}
                            renderPartial={true}>
                            <div>
                                <TextHeader title={intl.trans('our_keyboards', "OUR KEYBOARDS", 'upper')} tag="h2"
                                            properties={properties}/>
                                <EditableComponentHelper
                                    isSection={isSection}
                                    computeEntity={dialect.compute}
                                    updateEntity={dialect.update}
                                    showPreview={true}
                                    previewType="FVLink"
                                    property="fvdialect:keyboards"
                                    sectionProperty="contextParameters.dialect.keyboards"
                                    entity={selectn('response', dialect.compute)}/>
                            </div>
                        </AuthorizationFilter>;
                    }
                })()}
            </div>

            <div className={classNames('col-xs-12')}>
                {(() => {
                    if (selectn('response.properties.fvdialect:contact_information', dialect.compute) || !isSection) {
                        return <AuthorizationFilter
                            filter={{permission: 'Write', entity: selectn('response', dialect.compute)}}
                            renderPartial={true}>
                            <div>
                                <TextHeader title={intl.trans('contact_information', "CONTACT INFORMATION", 'upper')}
                                            tag="h2" properties={properties}/>
                                <EditableComponentHelper isSection={isSection} computeEntity={dialect.compute}
                                                         updateEntity={dialect.update}
                                                         property="fvdialect:contact_information"
                                                         entity={selectn('response', dialect.compute)}/>
                            </div>
                        </AuthorizationFilter>;
                    }
                })()}

            </div>

        </div>;
    };
}