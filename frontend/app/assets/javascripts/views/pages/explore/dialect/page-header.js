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

import classNames from 'classnames';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;

/**
 * Header for dialect pages
 */
export default class PageHeader extends Component {

    static propTypes = {
        portalLogo: PropTypes.string,
        dialectName: PropTypes.string,
        title: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {

        const {title, portalLogo, dialectName} = this.props;

        return <div className="page-header" style={{minHeight: '100px', marginTop: '10px'}}>
            {(portalLogo) ? <img className="pull-left" style={{maxHeight: '100px', marginRight: '45px'}}
                                 src={ConfGlobal.baseURL + portalLogo}/> : ''}
            <h1 style={{fontSize: "2em"}}>{dialectName} {intl.searchAndReplace(title)}</h1>
            {/*<div>
                <span className={classNames('label', 'label-primary')}><strong>543</strong> Words</span> <span className={classNames('label', 'label-primary')}><strong>143</strong> Phrases</span> <span className={classNames('label', 'label-primary')}><strong>243</strong> Songs</span> <span className={classNames('label', 'label-primary')}><strong>43</strong> Stories</span> 
              </div>*/}
        </div>;
    }
}
