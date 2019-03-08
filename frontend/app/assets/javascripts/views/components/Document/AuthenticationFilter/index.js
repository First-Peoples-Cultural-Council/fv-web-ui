import React, {Component, PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import selectn from 'selectn';

export default class AuthenticationFilter extends Component {

    static propTypes = {
        children: PropTypes.node,
        login: PropTypes.object.isRequired,
        routeParams: PropTypes.object,
        anon: PropTypes.bool,
        sections: PropTypes.bool
    };

    static defaultProps = {
        hideFromSections: false,
        anon: false
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            children,
            login,
            anon,
            hideFromSections,
            routeParams,
            containerStyle,
            ...other
        } = this.props;

        let isSection = (selectn('area', routeParams) == 'sections');

        const comonentToRender = <div style={containerStyle}>{children}</div>;

        // If anonymous allowed, render
        if (anon) {
            return comonentToRender;
        } else {

            // Logged in user.
            if (login.success && login.isConnected) {

                // Hide from sections for logged in user as well.
                if (hideFromSections && isSection) {
                    return null;
                }

                return comonentToRender;
            }

            return null;
        }
    }
}