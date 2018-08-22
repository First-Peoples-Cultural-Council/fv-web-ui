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
import selectn from 'selectn';

import Preview from 'views/components/Editor/Preview';
import IntlService from "views/services/intl";

/**
 * Metadata list
 */
export default class MetadataList extends Component {

    static propTypes = {
        metadata: PropTypes.array.isRequired,
        style: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {

        const {metadata, style} = this.props;

        return <ul style={{overflow: 'scroll', listStyleType: 'none', padding: 0, maxHeight: '200px', ...style}}>

            {metadata.map(function (item, key) {

                let value = selectn("value", item);

                if ((value && !Array.isArray(value)) || (Array.isArray(value) && value.length > 0)) {
                    return <li key={key} style={{paddingBottom: '5px'}}>
                        <strong>{IntlService.instance.searchAndReplace(selectn("label", item))}:</strong><br/>{value}
                        <hr style={{margin: '5px 0'}}/>
                    </li>;
                }
            })}

        </ul>;
    }
}
