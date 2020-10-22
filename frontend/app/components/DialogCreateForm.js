import React from 'react'

import FVButton from 'components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import PageDialectPhrasesCreate from 'components/Phrases/Create'

import PageDialectLinksCreate from 'components/Links/create'
import PageDialectCategoryCreate from 'components/Category/createV1'
import PageDialectContributorsCreate from 'components/Contributor/createV1'
import PageDialectPhraseBooksCreate from 'components/Phrasebook/createV1'

import PageDialectLinksEdit from 'components/Links/edit'
import PageDialectContributorEdit from 'components/Contributor/editV1'
import PageDialectPhraseBooksEdit from 'components/Phrasebook/editV1'
import FVLabel from 'components/FVLabel'

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
    let createNewButtonLabel
    switch (this.props.fieldAttributes.type) {
      case 'FVPhrase':
        createForm = (
          <PageDialectPhrasesCreate
            embedded
            routeParams={{ dialect_path: this.props.context.path }}
            onDocumentCreated={this._onDocumentCreated}
          />
        )
        createNewButtonLabel = (
          <FVLabel
            transKey="views.pages.explore.dialect.phrases.create_new_phrase"
            defaultStr="Create New Phrase"
            transform="words"
          />
        )
        break

      case 'FVCategory':
        if (this.props.fieldAttributes.page_provider.folder == 'Phrase Books') {
          createForm = <PageDialectPhraseBooksCreate embedded onDocumentCreated={this._onDocumentCreated} />
          createNewButtonLabel = (
            <FVLabel
              transKey="views.pages.explore.dialect.phrases.create_new_phrase_book"
              defaultStr="Create New Phrase Book"
              transform="words"
            />
          )

          if (this.props.value) {
            createNewButtonLabel = (
              <FVLabel
                transKey="views.pages.explore.dialect.phrases.edit_phrase_book"
                defaultStr="Edit Phrase Book"
                transform="words"
              />
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
          createNewButtonLabel = (
            <FVLabel
              transKey="views.pages.explore.dialect.phrases.create_new_category"
              defaultStr="Create New Category"
              transform="words"
            />
          )
        }
        break

      case 'FVContributor':
        createForm = <PageDialectContributorsCreate embedded onDocumentCreated={this._onDocumentCreated} />
        createNewButtonLabel = (
          <FVLabel
            transKey="views.pages.explore.dialect.phrases.create_new_contributor"
            defaultStr="Create New Contributor"
            transform="words"
          />
        )

        if (this.props.value) {
          createNewButtonLabel = (
            <FVLabel
              transKey="views.pages.explore.dialect.phrases.edit_contributor"
              defaultStr="Edit Contributor"
              transform="words"
            />
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
        createNewButtonLabel = (
          <FVLabel
            transKey="views.pages.explore.dialect.phrases.create_link"
            defaultStr="Create Link"
            transform="words"
          />
        )

        // Edit
        if (this.props.value) {
          createNewButtonLabel = (
            <FVLabel
              transKey="views.pages.explore.dialect.phrases.edit_link"
              defaultStr="Edit Link"
              transform="words"
            />
          )
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
              <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
            </FVButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
