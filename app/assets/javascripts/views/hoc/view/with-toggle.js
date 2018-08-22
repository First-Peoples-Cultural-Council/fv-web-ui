import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
import {RaisedButton, FlatButton, FontIcon} from 'material-ui';

export default function withToggle() {
    class ViewwithToggle extends Component {

        static defaultProps = {
            mobileOnly: false,
            label: 'Toggle Panel'
        }

        static propTypes = {
            mobileOnly: PropTypes.bool,
            label: PropTypes.string
        }

        constructor(props, context) {
            super(props, context);

            this.state = {
                open: false
            };
        }

        render() {

            let {mobileOnly, label} = this.props;

            return <div className={classNames('panel', 'panel-default')}>
                <div className="panel-heading">
                    {label} <FlatButton className={classNames({'visible-xs': mobileOnly})}
                                        label={(this.state.open) ? intl.trans('hide', 'Hide', 'first') : intl.trans('show', 'Show', 'first')}
                                        labelPosition="before" onTouchTap={(e) => {
                    this.setState({open: !this.state.open});
                    e.preventDefault();
                }} icon={<FontIcon
                    className="material-icons">{(this.state.open) ? 'expand_less' : 'expand_more'}</FontIcon>}
                                        style={{float: 'right', lineHeight: 1}}/>
                </div>

                <div className={classNames('panel-body', {'hidden-xs': !this.state.open && mobileOnly})}>
                    {this.props.children}
                </div>
            </div>;
        }
    }

    return ViewwithToggle;
}