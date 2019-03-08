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
import IntlService from "views/services/intl";

const intl = IntlService.instance;

/**
 * Reset your password page
 */
export default class ForgotPassword extends Component {

    static propTypes = {};

    constructor(props, context) {
        super(props, context);
    }

    render() {

        return <div>

            <h1>{intl.trans('forgot_password', 'Forgot your password', 'first')}</h1>

            <p>{intl.trans('views.pages.users.forgot.forgot_copy',
                'If you forgot your password enter your email address in the form below to begin the process of resetting it.')}</p>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-12', 'col-md-5')}>
                    <iframe src={ConfGlobal.baseURL + "site/resetPassword"} width="100%" style={{minHeight: '350px'}}
                            frameBorder="0"/>
                </div>

            </div>

        </div>;
    }
}