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

import DOMPurify from 'dompurify';

import ConfGlobal from 'conf/local.json';

import Paper from 'material-ui/lib/paper';

import Preview from 'views/components/Editor/Preview';
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel';

import {Introduction} from '../list-view';

import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import ActionLaunch from 'material-ui/lib/svg-icons/action/launch';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const defaultInnerStyle = {padding: '15px', margin: '15px 0', minHeight: '420px', overflowX: 'auto'};
const defaultCoverStyle = {padding: '15px', margin: '15px 0'};

class MediaThumbnail extends Component {
    render() {
        const photoMediaPanel = <MediaPanel minimal={true} label="" type="FVPicture" items={this.props.photos}/>;
        const videoMediaPanel = <MediaPanel minimal={true} label="" type="FVVideo" items={this.props.videos}/>;

        if (this.props.photos.length > 0 && this.props.videos.length > 0) {
            return <Tabs style={{marginTop: '15px'}}>
                <Tab label="Photo(s)">{photoMediaPanel}</Tab>
                <Tab label="Video(s)">{videoMediaPanel}</Tab>
            </Tabs>;
        } else if (this.props.photos.length > 0) {
            return photoMediaPanel;
        } else if (this.props.videos.length > 0) {
            return videoMediaPanel;
        }

        return null;
    }
}

class Cover extends Component {
    render() {

        const DEFAULT_LANGUAGE = this.props.defaultLanguage;

        const dominant_language_title_translation = (selectn('properties.fvbook:title_literal_translation', this.props.entry) || []).filter(function (translation) {
            return translation.language == DEFAULT_LANGUAGE;
        });

        return <div className="row">

            <div className="col-xs-12">

                <div
                    className={classNames('col-xs-12', 'col-md-3', {'hidden': this.props.videos.length == 0 && this.props.photos.length == 0})}>
                    <MediaThumbnail videos={this.props.videos} photos={this.props.photos}/>
                </div>

                <div className="col-xs-12 col-md-9">
                    <header style={{marginBottom: '10px'}}>
                        <h1 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(selectn('title', this.props.entry))}}></h1>
                        <h2 style={{fontSize: '1.3em'}}
                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(selectn('[0].translation', dominant_language_title_translation))}}></h2>
                        <subheader>{(selectn('contextParameters.book.authors', this.props.entry) || []).map(function (author, i) {
                            return <span className={classNames('label', 'label-default')}
                                         key={i}>{selectn('dc:title', author)}</span>;
                        })}
                        </subheader>
                    </header>

                    <div>
                        <Introduction item={this.props.entry} defaultLanguage={this.props.defaultLanguage}
                                      style={{height: '16vh', padding: '5px'}}/>
                        {this.props.audios}
                    </div>
                </div>
            </div>

            <div className="col-xs-12">
                <div className={classNames('col-xs-12', 'text-right')}>
                    {(this.props.openBookAction && this.props.pageCount > 0) ?
                        <RaisedButton style={{marginRight: '10px'}} primary={true} label="Open Book"
                                      onTouchTap={this.props.openBookAction} icon={<ActionLaunch/>}/> : ''}
                </div>
            </div>

        </div>;
    }
}

class Page extends Component {

    render() {

        const DEFAULT_LANGUAGE = this.props.defaultLanguage;

        // Audio
        let audios = [];

        (selectn('contextParameters.book.related_audio', this.props.entry) || []).map(function (audio, key) {
            audios.push(<Preview minimal={true} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio"/>);
        })

        return <div>

            <div className="row">

                <div
                    className={classNames('col-xs-12', 'col-md-3', {'hidden': this.props.videos.length == 0 && this.props.photos.length == 0})}
                    style={{marginBottom: '10px', textAlign: 'center'}}>
                    <MediaThumbnail videos={this.props.videos} photos={this.props.photos}/>
                </div>

                <div className="col-xs-12 col-md-9">
                    <div className={classNames('col-xs-6')}>
                        <div
                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(selectn('properties.dc:title', this.props.entry))}}></div>
                        {audios}
                    </div>
                    <div className={classNames('col-xs-6')} style={{borderLeft: '1px solid #e1e1e1'}}>
                        {(selectn('properties.fvbookentry:dominant_language_text', this.props.entry) || []).map(function (translation, i) {
                            if (translation.language == DEFAULT_LANGUAGE) {
                                return <div key={i}
                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(translation.translation)}}></div>;
                            }
                        })}
                    </div>
                    <div className={classNames('col-xs-12')} style={{marginTop: '15px'}}>
                        {(selectn('properties.fv:literal_translation', this.props.entry) || []).map(function (translation, i) {
                            if (translation.language == DEFAULT_LANGUAGE) {
                                return <span
                                    key={i}><strong>{intl.trans('literal_translation', 'Literal Translation', 'first')}</strong>: <span
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(translation.translation)}}></span></span>;
                            }
                        })}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className={classNames('col-xs-12', 'text-right')}>
                    {(this.props.editAction) ? <RaisedButton label={intl.trans('edit', 'Edit', 'first')}
                                                             onTouchTap={this.props.editAction.bind(this, this.props.entry)}/> : ''}
                    <div className="pull-right">{this.props.appendEntryControls}</div>
                </div>
            </div>

        </div>;
    }
}

export default class View extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {

        // Photos
        let photos = [];
        let photosThumbnails = [];

        (selectn('contextParameters.book.related_pictures', this.props.entry) || []).map(function (picture, key) {
            let image = {
                original: selectn('views[2].url', picture),
                thumbnail: (selectn('views[0].url', picture) || '/assets/images/cover.png'),
                description: picture['dc:description'],
                key: key,
                id: picture.uid,
                object: picture
            };
            photos.push(image);
            photosThumbnails.push(<img key={picture.uid}
                                       src={(selectn('views[0].url', picture) || '/assets/images/cover.png')}
                                       alt={selectn('title', picture)} style={{margin: '15px', maxWidth: '150px'}}/>);
        })

        // Videos
        let videos = [];
        let videoThumbnails = [];

        (selectn('contextParameters.book.related_videos', this.props.entry) || []).map(function (video, key) {
            let vid = {
                original: ConfGlobal.baseURL + video.path,
                thumbnail: (selectn('views[0].url', video) || '/assets/images/cover.png'),
                description: video['dc:description'],
                key: key,
                id: video.uid,
                object: video
            };
            videos.push(vid);
            videoThumbnails.push(<video key={video.uid} src={ConfGlobal.baseURL + video.path} controls
                                        style={{margin: '15px', maxWidth: '150px'}}/>);
        })

        // Audio
        let audios = [];

        (selectn('contextParameters.book.related_audio', this.props.entry) || []).map(function (audio, key) {
            audios.push(<Preview minimal={true} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio"/>);
        })

        const media = {
            photos: photos,
            videos: videos,
            audios: audios
        }

        let appliedStyle = (this.props.cover) ? Object.assign(defaultCoverStyle, this.props.innerStyle) : Object.assign(defaultInnerStyle, this.props.innerStyle);

        return <div className="row" style={{marginBottom: '20px'}}>

            <div className="col-xs-12">

                <Paper style={appliedStyle} zDepth={2}>
                    {(this.props.cover) ? <Cover {...this.props} {...media} /> : <Page {...this.props} {...media} />}
                </Paper>
            </div>
        </div>;
    }
}
