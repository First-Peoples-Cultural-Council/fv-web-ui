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
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';
import StringHelpers from 'common/StringHelpers';
import UIHelpers from 'common/UIHelpers';

import MetadataList from 'views/components/Browsing/metadata-list';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';
import Divider from 'material-ui/lib/divider';

import CircularProgress from 'material-ui/lib/circular-progress';
import IntlService from "views/services/intl";

const intl = IntlService.instance;

const GetMetaData = function (type, response) {

    let metadata = [];

    /**
     * Recorders
     */
    let recorders = [];

    {
        (selectn('contextParameters.media.recorders', response) || []).map(function (recorder, key) {
            recorders.push(<Preview expandedValue={recorder} key={key} type="FVContributor"/>);
        })
    }
    ;

    metadata.push({
        label: 'Recorder(s)',
        value: recorders
    });

    /**
     * Contributors
     */
    let contributors = [];

    {
        (selectn('contextParameters.media.sources', response) || []).map(function (contributor, key) {
            contributors.push(<Preview expandedValue={contributor} key={key} type="FVContributor"/>);
        })
    }
    ;

    metadata.push({
        label: intl.trans('contributor_s', 'Contributor(s)', 'first'),
        value: contributors
    });

    /**
     * Origin
     */
    if (selectn("contextParameters.media.origin", response)) {
        metadata.push({
            label: intl.trans('original_associated_word_phrase', 'Original Associated Word/Phrase', 'words'),
            value: selectn("contextParameters.media.origin.dc:title", response) + ' (Path: ' + selectn("contextParameters.media.origin.path", response) + ')'
        });
    }

    /**
     * Child Focused
     */
    metadata.push({
        label: intl.trans('models.child_focused', 'Child Focused', 'words'),
        value: (selectn("properties.fvm:child_focused", response)) ? intl.trans('yes', 'Yes', 'first') : intl.trans('no', 'No', 'first')
    });

    /**
     * Shared
     */
    metadata.push({
        label: intl.trans('shared', 'Shared', 'first'),
        value: (selectn("properties.fvm:shared", response)) ? intl.trans('yes', 'Yes', 'first') : intl.trans('no', 'No', 'first')
    });

    /**
     * Direct Link
     */
    if (selectn("path", response)) {

        let directLinkValue = ConfGlobal.baseWebUIURL.substring(0, ConfGlobal.baseWebUIURL.length - 1) + NavigationHelpers.generateUIDPath("explore", response, 'media');

        metadata.push({
            label: intl.trans('direct_link', 'Direct Link', 'words'),
            value: <span>
              <input type="textbox" readOnly style={{width: '100%', padding: '5px', maxWidth: '650px'}}
                     value={directLinkValue}/> <br/>
              <a href={directLinkValue}
                 target="_blank">{intl.trans('go_to_record', 'Go to Record', 'words')}</a>
              </span>
        });
    }

    /**
     * File size
     */
    metadata.push({
        label: intl.trans('size', 'Size', 'first'),
        value: StringHelpers.getReadableFileSize(selectn("properties.file:content.length", response))
    });

    /**
     * Status
     */
    metadata.push({
        label: intl.trans('status', 'Status', 'first'),
        value: selectn("state", response)
    });

    /**
     * Date created
     */
    metadata.push({
        label: intl.trans('date_created', 'Date Created', 'first'),
        value: StringHelpers.formatUTCDateString(selectn("properties.dc:created", response))
    });

    return metadata;
};


@provide
export default class Preview extends Component {

    static propTypes = {
        fetchWord: PropTypes.func.isRequired,
        computeWord: PropTypes.object.isRequired,
        fetchPhrase: PropTypes.func.isRequired,
        computePhrase: PropTypes.object.isRequired,
        fetchCategory: PropTypes.func.isRequired,
        computeCategory: PropTypes.object.isRequired,
        fetchPicture: PropTypes.func.isRequired,
        computePicture: PropTypes.object.isRequired,
        fetchAudio: PropTypes.func.isRequired,
        computeAudio: PropTypes.object.isRequired,
        fetchVideo: PropTypes.func.isRequired,
        computeVideo: PropTypes.object.isRequired,
        fetchContributor: PropTypes.func.isRequired,
        computeContributor: PropTypes.object.isRequired,
        fetchLink: PropTypes.func.isRequired,
        computeLink: PropTypes.object.isRequired,
        properties: PropTypes.object.isRequired,
        id: PropTypes.string,
        type: PropTypes.string.isRequired,
        expandedValue: PropTypes.object,
        styles: PropTypes.object,
        tagStyles: PropTypes.object,
        tagProps: PropTypes.object,
        metadataListStyles: PropTypes.object,
        minimal: PropTypes.bool,
        crop: PropTypes.bool,
        initiallyExpanded: PropTypes.bool,
    };

    static defaultProps = {
        styles: {},
        tagStyles: {},
        crop: false,
        minimal: false,
        initiallyExpanded: false
    };

    constructor(props) {
        super(props);

        // Bind methods to 'this'
        ['_handleExpandChange'].forEach((method => this[method] = this[method].bind(this)));

    }

    componentDidMount() {

        // Only fetch from server if expanded value isn't provided
        if (!this.props.expandedValue && this.props.id) {
            switch (this.props.type) {
                case 'FVWord':
                    this.props.fetchWord(this.props.id);
                    break;

                case 'FVPhrase':
                    this.props.fetchPhrase(this.props.id);
                    break;

                case 'FVCategory':
                    this.props.fetchCategory(this.props.id);
                    break;

                case 'FVPicture':
                    this.props.fetchPicture(this.props.id);
                    break;

                case 'FVAudio':
                    this.props.fetchAudio(this.props.id);
                    break;

                case 'FVVideo':
                    this.props.fetchVideo(this.props.id);
                    break;

                case 'FVContributor':
                    this.props.fetchContributor(this.props.id);
                    break;

                case 'FVLink':
                    this.props.fetchLink(this.props.id);
                    break;
            }
        }
    }

    /**
     * Request additional media info when expanded.
     */
    _handleExpandChange(id, fetchFunc, event, expanded) {
        fetchFunc(id);
    }

    render() {

        const themePalette = this.props.properties.theme.palette.rawTheme.palette;

        let handleExpandChange = () => {
        };

        let previewStyles = Object.assign({
            padding: '10px 0'
        }, this.props.styles);

        let body = <CircularProgress mode="indeterminate" size={1}/>;

        switch (this.props.type) {
            case 'FVWord':
                let word = {};
                let wordResponse;

                if (this.props.expandedValue) {
                    word.success = true;
                    wordResponse = this.props.expandedValue;
                }
                else {
                    word = ProviderHelpers.getEntry(this.props.computeWord, this.props.id);
                    wordResponse = selectn('response', word);
                }

                if (wordResponse && word.success) {

                    let image = selectn('contextParameters.word.related_pictures[0].path', wordResponse);
                    let translations = selectn('properties.fv:literal_translation', wordResponse) || selectn('properties.fv-word:definitions', wordResponse);
                    let audio = selectn('contextParameters.word.related_audio[0].path', wordResponse);

                    if (this.props.minimal) {
                        body = <div><strong>{selectn('properties.dc:title', wordResponse)}</strong></div>;
                    } else {
                        body = <div>
                            {(image) ? <Avatar src={ConfGlobal.baseURL + image} size={45} className="pull-left"
                                               style={{marginRight: '10px', marginTop: '10px'}}/> : ''}
                            <strong
                                style={{lineHeight: '200%'}}>{selectn('properties.dc:title', wordResponse)} ({selectn('properties.dc:title', wordResponse)})</strong><br/>
                            {translations.map((translation, j) => <span
                                key={j}>{translation.translation}<br/></span>)}<br/>
                            {(audio) ? <audio src={ConfGlobal.baseURL + audio} controls/> : ''}
                        </div>;
                    }
                }
                else if (word && word.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', word)}</div>;
                }

                break;

            case 'FVPhrase':
                let phrase = {};
                let phraseResponse;

                if (this.props.expandedValue) {
                    phrase.success = true;
                    phraseResponse = this.props.expandedValue;
                }
                else {
                    phrase = ProviderHelpers.getEntry(this.props.computePhrase, this.props.id);
                    phraseResponse = selectn('response', phrase);
                }

                if (phraseResponse && phrase.success) {
                    body = <div><strong>{phraseResponse.title}</strong></div>;
                }
                else if (phrase && phrase.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', phrase)}</div>;
                }

                break;

            case 'FVCategory':

                let category = {};
                let categoryResponse;

                if (this.props.expandedValue) {
                    category.success = true;
                    categoryResponse = this.props.expandedValue;
                }
                else {
                    category = ProviderHelpers.getEntry(this.props.computeCategory, this.props.id);
                    categoryResponse = selectn('response', category);
                }

                if (categoryResponse && category.success) {

                    let breadcrumb = [];

                    (selectn('contextParameters.breadcrumb.entries', categoryResponse) || []).map(function (entry, i) {
                        if (entry.type === 'FVCategory') {

                            let shared = '';

                            if (entry.path.indexOf('SharedData') !== -1)
                                shared = ' (' + intl.trans('shared', 'Shared', 'first') + ')';

                            breadcrumb.push(<span key={i}> &raquo; {entry.title} {shared}</span>);
                        }
                    });

                    body = <div><strong>{breadcrumb}</strong></div>;
                }
                else if (category && category.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', category)}</div>;
                }

                break;

            case 'FVPicture':

                let picture = {};
                let pictureResponse;
                let pictureTag = '';

                let remotePicture = ProviderHelpers.getEntry(this.props.computePicture, this.props.id || selectn('expandedValue.uid', this.props));

                if (this.props.expandedValue && !selectn('success', remotePicture)) {
                    picture.success = true;
                    pictureResponse = this.props.expandedValue;
                    handleExpandChange = this._handleExpandChange.bind(this, selectn('expandedValue.uid', this.props), this.props.fetchPicture);
                }
                else {
                    picture = remotePicture;
                    pictureResponse = selectn('response', picture);
                }

                if (pictureResponse && picture.success) {
                    pictureTag = <img style={{maxWidth: '100%', width: 'inherit', minWidth: 'inherit'}}
                                      src={UIHelpers.getThumbnail(pictureResponse, 'Medium')}
                                      alt={selectn('title', pictureResponse)}/>;

                    if (this.props.crop) {
                        pictureTag = <div style={{
                            width: '100%',
                            backgroundImage: 'url(\'' + UIHelpers.getThumbnail(pictureResponse, 'Medium') + '\')',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPositionX: '50%', ...this.props.tagStyles
                        }}></div>;
                    }

                    if (this.props.minimal) {
                        body = pictureTag;
                    }
                    else {

                        let description = (selectn('properties.dc:description', pictureResponse) || selectn('dc:description', pictureResponse));

                        body = <Card style={{boxShadow: 'none'}} initiallyExpanded={this.props.initiallyExpanded}
                                     onExpandChange={handleExpandChange}>
                            <CardMedia
                                style={{backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px'}}>
                                {(selectn('properties.file:content.data', pictureResponse) || selectn('path', pictureResponse) && selectn('path', pictureResponse).indexOf('nxfile') != -1) ? pictureTag : null}
                            </CardMedia>
                            <CardHeader
                                title={selectn('title', pictureResponse) || selectn('dc:title', pictureResponse)}
                                titleStyle={{lineHeight: 'initial', fontSize: '18px'}}
                                subtitle={(description && description != "undefined") ? intl.trans('description', 'Description', 'first') + ": " + description : ""}
                                subtitleStyle={{lineHeight: 'initial'}}
                                style={{height: 'inherit', padding: '16px 0'}}
                            />
                            <CardHeader
                                className="card-header-custom"
                                title={intl.trans('more_image_info', "MORE IMAGE INFO", 'upper')}
                                titleStyle={{lineHeight: 'initial'}}
                                titleColor={themePalette.alternateTextColor}
                                actAsExpander={true}
                                showExpandableButton={true}
                                style={{
                                    height: 'initial',
                                    backgroundColor: themePalette.primary2Color,
                                    padding: '8px',
                                    borderBottom: '4px solid ' + themePalette.primary1Color
                                }}
                            />
                            <CardText expandable={true} style={{backgroundColor: themePalette.accent4Color}}>
                                <MetadataList style={{
                                    lineHeight: 'initial',
                                    maxHeight: '100%',
                                    overflow: 'hidden', ...this.props.metadataListStyles
                                }} metadata={GetMetaData('picture', pictureResponse)}/>
                            </CardText>
                        </Card>;
                    }
                }
                else if (picture && picture.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', picture)}</div>;
                }

                break;

            case 'FVAudio':

                let audio = {};
                let audioResponse;
                let audioTag = '';

                let remoteAudio = ProviderHelpers.getEntry(this.props.computeAudio, this.props.id || selectn('expandedValue.uid', this.props));

                if (this.props.expandedValue && !selectn('success', remoteAudio)) {
                    audio.success = true;
                    audioResponse = this.props.expandedValue;
                    handleExpandChange = this._handleExpandChange.bind(this, selectn('expandedValue.uid', this.props), this.props.fetchAudio);
                }
                else {
                    audio = remoteAudio;
                    audioResponse = selectn('response', audio);
                }

                if (audioResponse && audio.success) {

                    audioTag = <audio {...this.props.tagProps} style={this.props.tagStyles}
                                      src={selectn('properties.file:content.data', audioResponse) || (ConfGlobal.baseURL + selectn('path', audioResponse))}
                                      alt={selectn('title', audioResponse)} controls />;

                    if (this.props.minimal) {
                        body = audioTag;
                    }
                    else {

                        let description = (selectn('properties.dc:description', audioResponse) || selectn('dc:description', audioResponse));

                        body = <Card style={{boxShadow: 'none'}} initiallyExpanded={this.props.initiallyExpanded}
                                     onExpandChange={handleExpandChange}>
                            <CardHeader
                                title={selectn('title', audioResponse) || selectn('dc:title', audioResponse)}
                                titleStyle={{lineHeight: 'initial', fontSize: '18px'}}
                                titleColor={themePalette.textColor}
                                subtitleColor={themePalette.textColorFaded}
                                subtitle={(description && description != "undefined") ? "Description: " + description : ""}
                                subtitleStyle={{lineHeight: 'initial'}}
                                style={{height: 'initial', padding: 0}}
                            />
                            <CardMedia
                                style={{backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px'}}>
                                {(selectn('properties.file:content.data', audioResponse) || selectn('path', audioResponse) && selectn('path', audioResponse).indexOf('nxfile') != -1) ? audioTag : null}
                            </CardMedia>
                            <CardHeader
                                className="card-header-custom"
                                title={intl.trans('more_audio_info', 'MORE AUDIO INFO', 'upper')}
                                titleStyle={{lineHeight: 'initial'}}
                                titleColor={themePalette.alternateTextColor}
                                actAsExpander={true}
                                showExpandableButton={true}
                                style={{
                                    height: 'initial',
                                    padding: 0,
                                    backgroundColor: themePalette.primary2Color,
                                    padding: '8px',
                                    borderBottom: '4px solid ' + themePalette.primary1Color
                                }}
                            />
                            <CardText expandable={true} style={{backgroundColor: themePalette.accent4Color}}>
                                <MetadataList style={{
                                    lineHeight: 'initial',
                                    maxHeight: '100%',
                                    overflow: 'hidden', ...this.props.metadataListStyles
                                }} metadata={GetMetaData('audio', audioResponse)}/>
                            </CardText>
                        </Card>;
                    }
                }
                else if (audio && audio.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', audio)}</div>;
                }

                break;

            case 'FVVideo':

                let video = {};
                let videoResponse;
                let videoTag = '';

                let remoteVideo = ProviderHelpers.getEntry(this.props.computeVideo, this.props.id || selectn('expandedValue.uid', this.props));

                if (this.props.expandedValue && !selectn('success', remoteVideo)) {
                    video.success = true;
                    videoResponse = this.props.expandedValue;
                    handleExpandChange = this._handleExpandChange.bind(this, selectn('expandedValue.uid', this.props), this.props.fetchVideo);
                }
                else {
                    video = remoteVideo;
                    videoResponse = selectn('response', video);
                }

                if (videoResponse && video.success) {

                    videoTag = <video width="100%" height="auto"
                                      src={selectn('properties.file:content.data', videoResponse) || (ConfGlobal.baseURL + selectn('path', videoResponse))}
                                      alt={selectn('title', videoResponse)} controls/>;

                    if (this.props.minimal) {
                        body = videoTag;
                    }
                    else {

                        let description = (selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse));

                        body = <Card style={{boxShadow: 'none'}} initiallyExpanded={this.props.initiallyExpanded}
                                     onExpandChange={handleExpandChange}>
                            <CardMedia
                                style={{backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px'}}>
                                {(selectn('properties.file:content.data', videoResponse) || selectn('path', videoResponse) && selectn('path', videoResponse).indexOf('nxfile') != -1) ? videoTag : null}
                            </CardMedia>
                            <CardHeader
                                title={selectn('title', videoResponse) || selectn('dc:title', videoResponse)}
                                titleStyle={{lineHeight: 'initial', fontSize: '18px'}}
                                subtitle={selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse)}
                                subtitleStyle={{lineHeight: 'initial'}}
                                style={{height: 'inherit', padding: '16px 0'}}
                            />
                            <CardHeader
                                className="card-header-custom"
                                title={intl.trans('more_video_info', 'MORE VIDEO INFO', 'upper')}
                                titleStyle={{lineHeight: 'initial'}}
                                titleColor={themePalette.alternateTextColor}
                                actAsExpander={true}
                                showExpandableButton={true}
                                style={{
                                    height: 'initial',
                                    backgroundColor: themePalette.primary2Color,
                                    padding: '8px',
                                    borderBottom: '4px solid ' + themePalette.primary1Color
                                }}
                            />
                            <CardText expandable={true} style={{backgroundColor: themePalette.accent4Color}}>
                                <MetadataList style={{
                                    lineHeight: 'initial',
                                    maxHeight: '100%',
                                    overflow: 'hidden', ...this.props.metadataListStyles
                                }} metadata={GetMetaData('video', videoResponse)}/>
                            </CardText>
                        </Card>;
                    }
                }
                else if (video && video.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', video)}</div>;
                }

                break;

            case 'FVContributor':

                let contributor = {};
                let contributorResponse;

                if (this.props.expandedValue) {
                    contributor.success = true;
                    contributorResponse = this.props.expandedValue;
                }
                else {
                    contributor = ProviderHelpers.getEntry(this.props.computeContributor, this.props.id);
                    contributorResponse = selectn('response', contributor);
                }

                if (contributorResponse && contributor.success) {
                    body = <div>
                        <span dangerouslySetInnerHTML={{__html: selectn('title', contributorResponse) || selectn('dc:title', contributorResponse)}}/>
                        <span> {selectn('properties.dc:description', contributorResponse) || selectn('dc:description', contributorResponse)}</span>
                    </div>;
                }
                else if (contributor && contributor.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', contributor)}</div>;
                }

                break;

            case 'FVLink':

                let link = {};
                let linkResponse;

                if (this.props.expandedValue) {
                    link.success = true;
                    linkResponse = this.props.expandedValue;
                }
                else {
                    link = ProviderHelpers.getEntry(this.props.computeLink, this.props.id);
                    linkResponse = selectn('response', link);
                }

                if (linkResponse && link.success) {

                    let link = selectn('properties.fvlink:url', linkResponse) || selectn('fvlink:url', linkResponse) || selectn('properties.file:content.data', linkResponse) || selectn('file:content.data', linkResponse);

                    body = <div>
                        <div><a href={link}
                                target="_blank">{selectn('title', linkResponse) || selectn('dc:title', linkResponse)}</a>
                        </div>
                        <div>{selectn('properties.dc:description', linkResponse) || selectn('dc:description', linkResponse)}</div>
                    </div>;
                }
                else if (link && link.isError) {
                    body = <div>{intl.trans('error', 'Error', 'first')}: {selectn('message', link)}</div>;
                }

                break;

            default:

                body = intl.trans('preview_option_not_available', 'Preview option not available. Please report to Administrator', 'first');

                break;
        }


        return (
            <div style={previewStyles}>
                {body}
            </div>
        );
    }
}
