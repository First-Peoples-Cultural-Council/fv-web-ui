import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import PageDialectPhrasesCreate from 'views/pages/explore/dialect/learn/phrases/create';
import PageDialectCategoryCreate from 'views/pages/explore/dialect/category/create';
import PageDialectContributorsCreate from 'views/pages/explore/dialect/contributors/create';
import PageDialectPhraseBooksCreate from 'views/pages/explore/dialect/phrasebooks/create';
import PageDialectLinksCreate from 'views/pages/explore/dialect/links/create';

import PageDialectLinksEdit from 'views/pages/explore/dialect/links/edit';
import PageDialectContributorEdit from 'views/pages/explore/dialect/contributors/edit';
import PageDialectPhraseBooksEdit from 'views/pages/explore/dialect/phrasebooks/edit';
import IntlService from "views/services/intl";

const intl = IntlService.instance;

export default class DialogCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        // Bind methods to 'this'
        ['_onDocumentCreated'].forEach((method => this[method] = this[method].bind(this)));
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    shouldComponentUpdate(newProps, newState) {

        if (newState != this.state)
            return true;

        return false;
    }

    _onDocumentCreated(document) {
        if (document) {
            this.setState({open: false});
            this.props.onChange(event, document);
        }
    }

    render() {
        let createForm = "";
        let createNewButtonLabel = "";
        switch (this.props.fieldAttributes.type) {
            case "FVPhrase":
                createForm =
                    <PageDialectPhrasesCreate embedded={true} routeParams={{dialect_path: this.props.context.path}}
                                              onDocumentCreated={this._onDocumentCreated}/>;
                createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.create_new_phrase', 'Create New Phrase', 'words');
                break;

            case "FVCategory":
                if (this.props.fieldAttributes.page_provider.folder == "Phrase Books") {
                    createForm =
                        <PageDialectPhraseBooksCreate embedded={true} onDocumentCreated={this._onDocumentCreated}/>;
                    createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.create_new_phrase_book', 'Create New Phrase Book', 'words');

                    if (this.props.value) {
                        createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.edit_phrase_book', 'Edit Phrase Book', 'words');
                        createForm = <PageDialectPhraseBooksEdit dialect={this.props.context} routeParams={{
                            dialect_path: this.props.context.path,
                            theme: 'explore'
                        }} value={this.props.value} embedded={true} onDocumentCreated={this._onDocumentCreated}
                                                                 cancelMethod={this.handleClose}/>;
                    }
                }
                else if (this.props.fieldAttributes.page_provider.folder == "Categories") {
                    createForm =
                        <PageDialectCategoryCreate embedded={true} onDocumentCreated={this._onDocumentCreated}/>;
                    createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.create_new_category', 'Create New Category', 'words');
                }
                break;

            case "FVContributor":
                createForm =
                    <PageDialectContributorsCreate embedded={true} onDocumentCreated={this._onDocumentCreated}/>;
                createNewButtonLabel = intl.trans('views.components.dialog_create_form.create_new_contributor', 'Create New Contributor', 'words');

                if (this.props.value) {
                    createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.edit_contributor', 'Edit Contributor', 'words');
                    createForm = <PageDialectContributorEdit dialect={this.props.context} routeParams={{
                        dialect_path: this.props.context.path,
                        theme: 'explore'
                    }} value={this.props.value} embedded={true} onDocumentCreated={this._onDocumentCreated}
                                                             cancelMethod={this.handleClose}/>;
                }
                break;

            case "FVLink":
                createForm = <PageDialectLinksCreate embedded={true} onDocumentCreated={this._onDocumentCreated}/>;
                createNewButtonLabel = (this.props.value || this.props.expandedValue) ? intl.trans('views.components.dialog_create_form.edit_link', 'Edit Link', 'words') : intl.trans('views.pages.explore.dialect.phrases.edit_link', 'Edit Link', 'words');

                if (this.props.value) {
                    createNewButtonLabel = intl.trans('views.components.dialog_create_form.edit_link', 'Edit Link', 'words');
                    createForm = <PageDialectLinksEdit dialect={this.props.context} routeParams={{
                        dialect_path: this.props.context.path,
                        theme: 'explore'
                    }} value={this.props.value} embedded={true} onDocumentCreated={this._onDocumentCreated}
                                                       cancelMethod={this.handleClose}/>;
                }
                break;
        }

        // Show Create New button, unless otherwise specified
        let createNewButton = "";
        if (!this.props.fieldAttributes.disableCreateNewButton || this.props.fieldAttributes.disableCreateNewButton === false) {
            createNewButton = <RaisedButton label={createNewButtonLabel} onTouchTap={this.handleOpen}/>;
        }

        const actions = [
            <FlatButton
                label={intl.trans('cancel', 'Cancel', 'first')}
                secondary={true}
                onTouchTap={this.handleClose}/>
        ];

        return (
            <div>

                {createNewButton}

                <Dialog
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    actions={actions}>

                    {createForm}

                </Dialog>

            </div>
        );
    }
}