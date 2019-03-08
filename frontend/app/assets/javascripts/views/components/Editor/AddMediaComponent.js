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
import t from 'tcomb-form';
import classNames from 'classnames';

import SelectSuggestFactory from 'views/components/Editor/fields/selectSuggest';

import ProviderHelpers from 'common/ProviderHelpers';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

import {
    Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
    Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
    Tabs, Tab,
    Dialog
} from 'material-ui';
import IntlService from "views/services/intl";

const intl = IntlService.instance;
// TODO: Cleanup class
@provide
export default class AddMediaComponent extends Component {

    static propTypes = {
        createAudio: PropTypes.func.isRequired,
        computeAudio: PropTypes.object.isRequired,
        createPicture: PropTypes.func.isRequired,
        computePicture: PropTypes.object.isRequired,
        createVideo: PropTypes.func.isRequired,
        computeVideo: PropTypes.object.isRequired,
        dialect: PropTypes.object.isRequired,
        onComplete: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    };

    getDefaultValues() {
        label: intl.trans('views.components.editor.upload_media', "Upload Media", 'words')
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    _handleSelectElement(value) {
        this.props.onComplete(value);
    }

    constructor(props) {
        super(props);

        this._change = this._change.bind(this);
        this._save = this._save.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this._handleSelectElement = this._handleSelectElement.bind(this);

        this.state = {
            typeError: '',
            uploading: false,
            open: false,
            pathOrId: null
        };
    }

    _change(value) {
        this.setState({value});
    }

    _save(e) {

        e.preventDefault();

        this.setState({'uploading': true});

        let formValue = this.refs['form_media'].getValue();

        // If validation passed
        if (formValue) {

            let file;
            let fd = new FormData();

            for (let k in formValue) {
                let v = formValue[k];
                if (t.form.File.is(v)) {
                    fd.append(k, v, v.name);
                    file = v;
                } else {
                    fd.append(k, v);
                }
            }

            if (file) {

                let properties = {};

                for (let key in formValue) {
                    if (formValue.hasOwnProperty(key) && key && key != 'file') {
                        if (formValue[key] && formValue[key] != '') {
                            //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
                            properties[key] = formValue[key];
                        }
                    }
                }

                let timestamp = Date.now();
                let ResourcesPath = this.props.dialect.path + '/Resources';

                let docParams = {
                    type: this.props.type,
                    name: formValue['dc:title'],
                    properties: Object.assign(properties, (selectn('otherContext.parentId', this.props.dialect)) ? {'fvm:origin': selectn('otherContext.parentId', this.props.dialect)} : {})
                };

                switch (this.props.type) {

                    case 'FVAudio':
                        if (file.type.indexOf('audio') === 0) {
                            this.props.createAudio(ResourcesPath, docParams, file, timestamp);
                            this.setState({typeError: ''});
                        } else {
                            this.setState({
                                typeError: <div className={classNames('alert', 'alert-warning')}
                                                role="alert">{intl.searchAndReplace('You tried to upload a file of type ' + file.type + ' when an audio file was expected')}</div>
                            });
                        }
                        break;

                    case 'FVPicture':
                        if (file.type.indexOf('image') === 0) {
                            this.props.createPicture(ResourcesPath, docParams, file, timestamp);
                            this.setState({typeError: ''});
                        } else {
                            this.setState({
                                typeError: <div className={classNames('alert', 'alert-warning')}
                                                role="alert">{intl.searchAndReplace('You tried to upload a file of type ' + file.type + ' when an image file was expected')}</div>
                            });
                        }
                        break;

                    case 'FVVideo':
                        if (file.type.indexOf('video') === 0) {
                            this.props.createVideo(ResourcesPath, docParams, file, timestamp);
                            this.setState({typeError: ''});
                        } else {
                            this.setState({
                                typeError: <div className={classNames('alert', 'alert-warning')}
                                                role="alert">{intl.searchAndReplace('You tried to upload a file of type ' + file.type + ' when an video file was expected')}</div>
                            });
                        }
                        break;

                }

                this.setState({
                    pathOrId: this.props.dialect.path + '/Resources/' + formValue['dc:title'] + '.' + timestamp
                })
            }
        }
    }

    render() {

        let computeCreate;
        let uploadText = "";
        let form = "";
        let fileTypeLabel = intl.trans('file', 'File', 'first');

        const actions = [
            <FlatButton
                label={intl.trans('cancel', 'Cancel', 'first')}
                secondary={true}
                onTouchTap={this.handleClose}/>
        ];

        switch (this.props.type) {
            case 'FVAudio':
                computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId);
                fileTypeLabel = intl.trans('audio', 'Audio', 'first');
                break;

            case 'FVPicture':
                computeCreate = ProviderHelpers.getEntry(this.props.computePicture, this.state.pathOrId);
                fileTypeLabel = intl.trans('picture', 'Picture', 'first');
                break;

            case 'FVVideo':
                computeCreate = ProviderHelpers.getEntry(this.props.computeVideo, this.state.pathOrId);
                fileTypeLabel = intl.trans('video', 'Video', 'first');
                break;
        }

        //if (this.state.schema != undefined){
        form = <form onSubmit={this._save} id="myForm" encType="multipart/form-data">
            <t.form.Form
                ref="form_media"
                options={selectn("FVResource", options)}
                type={t.struct(selectn(this.props.type, fields))}
                value={this.state.value}
                context={this.props.dialect}
                onChange={this._change}/>
            <button type="submit"
                    className={classNames('btn', 'btn-primary')}>{intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')}</button>
        </form>;
        //}

        if (computeCreate && computeCreate.isFetching) {
            uploadText =
                <div className={classNames('alert', 'alert-info')}
                     role="alert">{intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}</div>
        }

        if (computeCreate && computeCreate.success) {
            uploadText = <div className={classNames('alert', 'alert-success')} role="success">Upload successful!</div>
            actions.push(<FlatButton
                label={intl.trans('insert_into_entry', 'Insert into Entry', 'first')}
                primary={true}
                onTouchTap={this._handleSelectElement.bind(this, computeCreate.response)}/>);
            form = "";
        }

        return (
            <div style={{display: 'inline'}}>
                <RaisedButton label={this.props.label} onTouchTap={this.handleOpen}/>
                <Dialog
                    title={intl.trans('views.components.editor.create_new_x_in_the_x_dialect',
                        "Create New " + fileTypeLabel + " in the " + selectn('properties.dc:title', this.props.dialect) + " dialect.",
                        'first', [fileTypeLabel, selectn('properties.dc:title', this.props.dialect)])}
                    actions={actions}
                    modal={true}
                    autoScrollBodyContent={true}
                    open={this.state.open}>
                    <div className="form-horizontal">
                        {this.state.typeError}
                        {uploadText}
                        {form}
                    </div>
                </Dialog>
            </div>
        );
    }
}
