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
import React from 'react';

import classNames from 'classnames';

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import LeftNav from 'material-ui/lib/left-nav';
import AppBar from 'material-ui/lib/app-bar';
import IntlService from "views/services/intl";

export default class Footer extends React.Component {
    intl = IntlService.instance;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div>
                <footer className={classNames('footer', this.props.className)}>
                    <div className="container-fluid">
                        <div className="row">

                            <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1')}
                                 style={{paddingTop: '20px'}}>
                                <img src="/assets/images/logo-fpcc-white.png" alt="FirstVoices Logo"
                                     className={classNames('pull-left')}/>
                            </div>

                            <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1', 'body')}
                                 style={{paddingTop: '20px', fontWeight: 100}}>
                                <p><a href="/content/disclaimer/">{this.intl.translate({
                                    key: 'general.disclaimer',
                                    default: 'Disclaimer',
                                    case: 'first'
                                })}</a> | <a
                                    href="/content/conditions/">{this.intl.translate({
                                    key: 'views.components.navigation.conditions_of_use',
                                    default: 'Conditions of Use',
                                    case: 'first'
                                })}</a> | <a href="https://firstvoices.atlassian.net/servicedesk/customer/portal/1/create/16">{this.intl.translate({
                                    key: 'general.feedback',
                                    default: 'Feedback',
                                    case: 'first'
                                })}</a> | <a
                                    href="http://fpcf.ca/donate-now/">{this.intl.translate({
                                    key: 'general.donate',
                                    default: 'Donate',
                                    case: 'first'
                                })}</a></p>
                                <p>{this.intl.translate({
                                    key: 'general.phone',
                                    default: 'Phone',
                                    case: 'first'
                                })} : +1-250-652-5952 · {this.intl.translate({
                                    key: 'general.email',
                                    default: 'Email',
                                    case: 'first'
                                })} : support@fpcc.ca</p>
                                <p>&copy; 2000-{new Date().getFullYear()} FirstVoices</p>
                            </div>

                        </div>
                    </div>
                </footer>

                <div className="container-fluid" style={{backgroundColor: '#0d6c80', borderTop: '1px solid #1c788c'}}>
                    <div className="row">
                        <div className={classNames('col-xs-12')}>
                            <p style={{
                                fontSize: '10px',
                                lineHeight: '130%',
                                marginTop: '10px',
                                color: '#4191a5'
                            }}>&copy; {this.intl.translate({
                                key: 'views.components.navigation.copyright_copy',
                                default: 'This database is protected by copyright laws and is owned by the First Peoples’ ' +
                                'Cultural Foundation. All materials on this site are protected by copyright laws and are ' +
                                'owned by the individual Indigenous language communities who created the archival ' +
                                'content. Language and multimedia data available on this site is intended for private, ' +
                                'non-commercial use by individuals. Any commercial use of the language data or multimedia ' +
                                'data in whole or in part, directly or indirectly, is specifically forbidden except with ' +
                                'the prior written authority of the owner of the copyright'
                            })}.</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}