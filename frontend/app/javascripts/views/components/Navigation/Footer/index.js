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
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavigationHelpers from 'common/NavigationHelpers'
import '!style-loader!css-loader!./Footer.css'
import Link from 'views/components/Link'
import FVLabel from '../../FVLabel/index'
export default class Footer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <>
        <footer className={classNames('Footer', this.props.className)}>
          <div className="container-fluid">
            <div className="row">
              <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1', 'Footer__group', 'PrintHide')}>
                <p className="Footer__caption">An initiative of</p>
                <a href="http://www.fpcc.ca/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="assets/images/logo-fpcc-white.png"
                    alt="First Peoples' Cultural Council"
                    className={classNames('pull-left')}
                  />
                </a>
              </div>

              <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1', 'Footer__group')}>
                <p className="PrintHide">
                  <Link href={NavigationHelpers.generateStaticURL('/content/disclaimer/')}>
                    <FVLabel transKey="general.disclaimer" defaultStr="Disclaimer" transform="first" />
                  </Link>
                  {' | '}
                  <Link href={NavigationHelpers.generateStaticURL('/content/conditions/')}>
                    <FVLabel
                      transKey="views.components.navigation.conditions_of_use"
                      defaultStr="Conditions of Use"
                      transform="first"
                    />
                  </Link>
                  {' | '}
                  <a href="https://support.firstvoices.com/servicedesk/customer/portal/1">
                    <FVLabel transKey="general.help" defaultStr="Help" transform="first" />
                  </a>
                  {' | '}
                  <a href="http://fpcf.ca/donate-now/">
                    <FVLabel transKey="general.donate" defaultStr="Donate" transform="first" />
                  </a>
                </p>
                <p>
                  <FVLabel transKey="general.phone" defaultStr="Phone" transform="first" /> : +1-250-882-8919 ·{' '}
                  <FVLabel transKey="general.email" defaultStr="Email" transform="first" /> : support@fpcc.ca
                </p>
                <p>
                  &copy; 2000-
                  {new Date().getFullYear()} FirstVoices
                </p>
              </div>
            </div>
          </div>
        </footer>

        <div className="Footer__disclaimerGroup">
          &copy;{' '}
          <FVLabel
            transKey="views.components.navigation.copyright_copy"
            defaultStr={
              'This database is protected by copyright laws and is owned by the First Peoples’ ' +
              'Cultural Foundation. All materials on this site are protected by copyright laws and are ' +
              'owned by the individual Indigenous language communities who created the archival ' +
              'content. Language and multimedia data available on this site is intended for private, ' +
              'non-commercial use by individuals. Any commercial use of the language data or multimedia ' +
              'data in whole or in part, directly or indirectly, is specifically forbidden except with ' +
              'the prior written authority of the owner of the copyright'
            }
          />
        </div>
      </>
    )
  }
}
