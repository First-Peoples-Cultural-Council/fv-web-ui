import React from 'react'

import FVButton from 'views/components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import PageDialectPhrasesCreate from 'views/pages/explore/dialect/learn/phrases/Create'
import PageDialectCategoryCreate from 'views/pages/explore/dialect/category/create'

import PageDialectContributorsCreate from 'views/pages/explore/dialect/Contributor/createV1'
import PageDialectPhraseBooksCreate from 'views/pages/explore/dialect/Phrasebook/createV1'
import PageDialectLinksCreate from 'views/pages/explore/dialect/links/create'

import PageDialectLinksEdit from 'views/pages/explore/dialect/links/edit'
import PageDialectContributorEdit from 'views/pages/explore/dialect/Contributor/editV1'
import PageDialectPhraseBooksEdit from 'views/pages/explore/dialect/Phrasebook/editV1'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

export default class DialogCreateForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }

    // Bind methods to 'this'
    ;['_onDocumentCreated'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  // NOTE: The shouldComponentUpdate check was added to suppress an issue where clicking on the Browse buttons would not open a modal.
  // The additional props.value check ensures the correct button label text is displayed after an item is selected.
  shouldComponentUpdate(newProps, newState) {
    if (newState !== this.state || newProps.value !== this.props.value) return true

    return false
  }

  _onDocumentCreated(document) {
    if (document) {
      this.setState({ open: false })
      this.props.onChange(event, document)
    }
  }

  render() {
    let createForm = ''
    let createNewButtonLabel = ''
    switch (this.props.fieldAttributes.type) {
      case 'FVPhrase':
        createForm = (
          <PageDialectPhrasesCreate
            embedded
            routeParams={{ dialect_path: this.props.context.path }}
            onDocumentCreated={this._onDocumentCreated}
          />
        )
        createNewButtonLabel = intl.trans(
          'views.pages.explore.dialect.phrases.create_new_phrase',
          'Create New Phrase',
          'words'
        )
        break

      case 'FVCategory':
        if (this.props.fieldAttributes.page_provider.folder == 'Phrase Books') {
          createForm = <PageDialectPhraseBooksCreate embedded onDocumentCreated={this._onDocumentCreated} />
          createNewButtonLabel = intl.trans(
            'views.pages.explore.dialect.phrases.create_new_phrase_book',
            'Create New Phrase Book',
            'words'
          )

          if (this.props.value) {
            createNewButtonLabel = intl.trans(
              'views.pages.explore.dialect.phrases.edit_phrase_book',
              'Edit Phrase Book',
              'words'
            )
            createForm = (
              <PageDialectPhraseBooksEdit
                dialect={this.props.context}
                routeParams={{
                  dialect_path: this.props.context.path,
                  siteTheme: 'explore',
                }}
                value={this.props.value}
                embedded
                onDocumentCreated={this._onDocumentCreated}
                cancelMethod={this.handleClose}
              />
            )
          }
        } else if (this.props.fieldAttributes.page_provider.folder == 'Categories') {
          createForm = <PageDialectCategoryCreate embedded onDocumentCreated={this._onDocumentCreated} />
          createNewButtonLabel = intl.trans(
            'views.pages.explore.dialect.phrases.create_new_category',
            'Create New Category',
            'words'
          )
        }
        break

      case 'FVContributor':
        createForm = <PageDialectContributorsCreate embedded onDocumentCreated={this._onDocumentCreated} />
        createNewButtonLabel = intl.trans(
          'views.pages.explore.dialect.phrases.create_new_contributor',
          'Create New Contributor',
          'words'
        )

        if (this.props.value) {
          createNewButtonLabel = intl.trans(
            'views.pages.explore.dialect.phrases.edit_contributor',
            'Edit Contributor',
            'words'
          )
          createForm = (
            <PageDialectContributorEdit
              dialect={this.props.context}
              routeParams={{
                dialect_path: this.props.context.path,
                siteTheme: 'explore',
              }}
              value={this.props.value}
              embedded
              onDocumentCreated={this._onDocumentCreated}
              cancelMethod={this.handleClose}
            />
          )
        }
        break

      case 'FVLink':
        // Create
        createForm = <PageDialectLinksCreate embedded onDocumentCreated={this._onDocumentCreated} />
        createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.create_link', 'Create Link', 'words')

        // Edit
        if (this.props.value) {
          createNewButtonLabel = intl.trans('views.pages.explore.dialect.phrases.edit_link', 'Edit Link', 'words')
          createForm = (
            <PageDialectLinksEdit
              dialect={this.props.context}
              routeParams={{
                dialect_path: this.props.context.path,
                siteTheme: 'explore',
              }}
              value={this.props.value}
              embedded
              onDocumentCreated={this._onDocumentCreated}
              cancelMethod={this.handleClose}
            />
          )
        }
        break
      default: // NOTE: do nothing
    }

    // Show Create New button, unless otherwise specified
    let createNewButton = ''
    if (
      !this.props.fieldAttributes.disableCreateNewButton ||
      this.props.fieldAttributes.disableCreateNewButton === false
    ) {
      createNewButton = (
        <FVButton variant="outlined" onClick={this.handleOpen}>
          {createNewButtonLabel}
        </FVButton>
      )
    }

    return (
      <div data-testid="DialogCreateForm">
        {createNewButton}

        <Dialog
          data-testid="DialogCreateForm__Dialog"
          fullWidth
          maxWidth="md"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogContent data-testid="DialogCreateForm__DialogContent">{createForm}</DialogContent>
          <DialogActions data-testid="DialogCreateForm__DialogActions">
            <FVButton variant="contained" color="secondary" onClick={this.handleClose}>
              {intl.trans('cancel', 'Cancel', 'first')}
            </FVButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
