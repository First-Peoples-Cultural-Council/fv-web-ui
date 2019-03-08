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
import classNames from 'classnames';
import selectn from 'selectn';

import DOMPurify from 'dompurify';

import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';

import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import IntlService from "views/services/intl";

const defaultStyle = {marginBottom: '20px'};

export default class CardView extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showIntro: false
        };
    }

    intl = IntlService.instance;

    render() {

        // If action is not defined
        let action;

        if (this.props.hasOwnProperty('action') && typeof this.props.action === "function") {
            action = this.props.action;
        } else {
            action = () => {
            };
        }

        let coverImage = null;

        if (this.props.contextParamsKey) {
            coverImage = selectn('contextParameters.' + this.props.contextParamsKey + '.related_pictures[0].views[2]', this.props.item);
        }

        coverImage = coverImage || {url: '/assets/images/cover.png'};

        let introduction = (this.props.introduction) ? React.cloneElement(this.props.introduction, {...this.props}) : '';

        return <div style={Object.assign(defaultStyle, this.props.style)} key={this.props.item.uid}
                    className={classNames('col-xs-12', 'col-md-' + Math.ceil(12 / this.props.cols))}>
            <Card style={{minHeight: '260px'}}>

                <CardMedia overlay={<CardTitle title={<span>{this.intl.searchAndReplace(this.props.item.title)}</span>}
                                               subtitle={this.intl.searchAndReplace(selectn('properties.dc:description', this.props.item))}/>}>

                    <div style={{
                        backgroundSize: (selectn('width', coverImage) > 200) ? '100%' : 'cover',
                        minWidth: 'inherit',
                        width: '100%',
                        height: '180px',
                        textAlign: 'center',
                        backgroundImage: 'url(\'' + selectn('url', coverImage) + '?inline=true\')'
                    }}>
                    </div>

                    <div style={{
                        position: 'absolute',
                        zIndex: (this.state.showIntro) ? 2 : -1,
                        top: '10px',
                        left: '10px',
                        width: '95%',
                        minWidth: 'auto',
                        padding: 0,
                        backgroundColor: '#fff',
                        height: '100%',
                        border: '1px solid #777777',
                        borderRadius: '0 0 10px 10px'
                    }}>

                        <IconButton iconClassName="material-icons"
                                    style={{position: 'absolute', right: 0, zIndex: 1000}}
                                    onTouchTap={() => this.setState({showIntro: false})}>clear</IconButton>

                        {this.intl.searchAndReplace(introduction)}

                    </div>
                </CardMedia>

                <CardText style={{padding: '4px'}}>

                    <FlatButton
                        onTouchTap={this.props.action.bind(this, this.props.item)}
                        primary={true} label={this.intl.translate({
                        key: 'views.pages.dialect.learn.songs_stories.continue_to_entry',
                        default: 'Continue to Entry',
                        case: 'words'
                    })}/>

                    {(() => {
                        if (introduction) {

                            return <IconButton iconClassName="material-icons" style={{
                                verticalAlign: '-5px',
                                padding: '5px',
                                width: 'auto',
                                height: 'auto',
                                'float': 'right'
                            }} tooltipPosition="top-left"
                                               onTouchTap={() => this.setState({showIntro: !this.state.showIntro})}
                                               touch={true}>flip_to_front</IconButton>;
                        }
                    })()}

                </CardText>

            </Card>
        </div>;
    }
}