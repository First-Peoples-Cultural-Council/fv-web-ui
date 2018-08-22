import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';

export default class TextHeader extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {

        const primary1Color = selectn('theme.palette.baseTheme.palette.primary1Color', this.props.properties);
        const sectionHrStyle = {backgroundColor: primary1Color, width: '94px', height: '4px', margin: '0'};

        return (
            <div>
                <hr style={sectionHrStyle}/>
                {(() => {

                    switch (this.props.tag) {
                        case 'h2':
                            return <h2
                                style={{margin: '15px 0 15px 0'}}>{this.props.title} {this.props.appendToTitle}</h2>;
                            break;

                        default:
                            return <h1 style={{
                                fontWeight: 500,
                                margin: '15px 0 15px 0'
                            }}>{this.props.title} {this.props.appendToTitle}</h1>;
                            break;
                    }

                })()}

            </div>
        );
    }
}