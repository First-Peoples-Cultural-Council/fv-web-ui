import React from 'react'

// Material UI
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

// FPCC
import NavigationHelpers from 'common/NavigationHelpers'
import IntlService from 'common/services/IntlService'
import FVButton from 'components/FVButton'
import PageDialectPhrasesCreate from 'components/PhrasesCreateEdit/Create'
import PageDialectLinksCreate from 'components/Links/create'
import PageDialectCategoryCreate from 'components/Category/createV1'
import PageDialectContributorsCreate from 'components/Contributor/createV1'
import PageDialectPhraseBooksCreate from 'components/Phrasebook/createV1'
import PageDialectLinksEdit from 'components/Links/edit'

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

  _generateButton(label) {
    return (
      <FVButton variant="outlined" onClick={this.handleOpen}>
        {label}
      </FVButton>
    )
  }

  render() {
    let createForm = ''
    let createButton
    switch (this.props.fieldAttributes.type) {
      case 'FVPhrase':
        createForm = (
          <PageDialectPhrasesCreate
            embedded
            routeParams={{ dialect_path: this.props.context.path }}
            onDocumentCreated={this._onDocumentCreated}
          />
        )
        createButton = this._generateButton(
          intl.trans('views.pages.explore.dialect.phrases.create_new_phrase', 'Create New Phrase', 'words')
        )
        break

      case 'FVCategory':
        if (this.props.fieldAttributes.page_provider.folder == 'Phrase Books') {
          createForm = <PageDialectPhraseBooksCreate embedded onDocumentCreated={this._onDocumentCreated} />
          createButton = this._generateButton(
            intl.trans('views.pages.explore.dialect.phrases.create_new_phrase_book', 'Create New Phrase Book', 'words')
          )
          if (this.props.value) {
            createButton = (
              <FVButton
                variant="outlined"
                onClick={() =>
                  window.open(
                    `${NavigationHelpers.getBaseWebUIURL()}/explore${this.props.context.path}/edit/phrasebook/${
                      this.props.value
                    }`,
                    '_blank'
                  )
                }
              >
                {intl.trans('views.pages.explore.dialect.phrases.edit_phrase_book', 'Edit Phrase Book', 'words')}
              </FVButton>
            )
            createForm = null
          }
        } else if (this.props.fieldAttributes.page_provider.folder == 'Categories') {
          createForm = <PageDialectCategoryCreate embedded onDocumentCreated={this._onDocumentCreated} />
          createButton = this._generateButton(
            intl.trans('views.pages.explore.dialect.phrases.create_new_category', 'Create New Category', 'words')
          )
        }
        break

      case 'FVContributor':
        createForm = <PageDialectContributorsCreate embedded onDocumentCreated={this._onDocumentCreated} />
        createButton = this._generateButton(
          intl.trans('views.pages.explore.dialect.phrases.create_new_contributor', 'Create New Contributor', 'words')
        )
        break

      case 'FVLink':
        // Create
        createForm = <PageDialectLinksCreate embedded onDocumentCreated={this._onDocumentCreated} />
        createButton = this._generateButton(
          intl.trans('views.pages.explore.dialect.phrases.create_link', 'Create Link', 'words')
        )

        // Edit
        if (this.props.value) {
          createButton = this._generateButton(
            intl.trans('views.pages.explore.dialect.phrases.edit_link', 'Edit Link', 'words')
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
    let button = ''
    if (
      !this.props.fieldAttributes.disableCreateNewButton ||
      this.props.fieldAttributes.disableCreateNewButton === false
    ) {
      button = createButton
    }

    return (
      <div data-testid="DialogCreateForm">
        {button}
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
              {intl.trans('cancel', 'Cancel', 'words')}
            </FVButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
