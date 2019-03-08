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
import selectn from 'selectn';
import classNames from 'classnames';

import ConfGlobal from 'conf/local.json';
import IntlService from "views/services/intl";

export default class IntroCardView extends Component {

    static propTypes = {
        primary1Color: PropTypes.string.isRequired,
        primary2Color: PropTypes.string.isRequired,
        block: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {

        let imgTag = '';
        let imgFile = selectn('file.data', this.props.block);

        if (imgFile) {
            imgTag = <img style={{width: '100%', borderBottom: '3px solid #fff'}}
                          src={selectn('file.data', this.props.block)} alt={selectn('title', this.props.block)}/>;
        }

        return <div style={{
            maxHeight: '275px',
            maxWidth: '292px',
            padding: '0',
            backgroundColor: this.props.primary1Color,
            color: '#ffffff'
        }}>
            {imgTag}
            <h2 style={{
                paddingLeft: '12px',
                color: '#ffffff',
                marginTop: '10px',
                fontWeight: 500
            }}>{IntlService.instance.searchAndReplace(selectn('title', this.props.block))}</h2>
            <p className={classNames('body')} style={{padding: '0 0 10px 12px', color: '#ffffff'}}
               dangerouslySetInnerHTML={{__html: selectn('summary', this.props.block)}}></p>
            <div style={{
                backgroundColor: this.props.primary2Color,
                padding: '5px 6px',
                position: 'absolute',
                top: '46%',
                left: '6px',
                fontSize: '0.9em'
            }}>{IntlService.instance.translate({key: 'read_more', default: 'READ MORE', case: 'upper', append: ' +'})}
            </div>
        </div>;
    }
}