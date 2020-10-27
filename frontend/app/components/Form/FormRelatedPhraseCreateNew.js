import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
// import Textarea from 'components/Form/Common/Textarea'
// import Select from 'components/Form/Common/Select`'
// import File from 'components/Form/Common/File'
import Checkbox from 'components/Form/Common/Checkbox'
import FormContributors from 'components/Form/FormContributors'
// import FormRecorders from 'components/Form/FormRecorders'
import FormDefinitions from 'components/Form/FormDefinitions'
import FormCulturalNotes from 'components/Form/FormCulturalNotes'
import FormRelatedAudio from 'components/Form/FormRelatedAudio'
import FormRelatedPictures from 'components/Form/FormRelatedPictures'
import FormRelatedVideos from 'components/Form/FormRelatedVideos'
import FormPhraseBooks from 'components/Form/FormPhraseBooks'
import ProviderHelpers from 'common/ProviderHelpers'
import * as yup from 'yup'
// import Preview from 'components/Preview'
// see about dropping:
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createAudio } from 'reducers/fvAudio'
import FVLabel from 'components/FVLabel'

const { func, object, number, string } = PropTypes
export class FormRelatedPhraseCreateNew extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATED = 2

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: number,
    textLegendItem: string,
    handleCancel: func,
    handleClickRemoveItem: func,
    handleItemSelected: func,
    componentState: number,

    DIALECT_PATH: string,
    refPhrase: func,
    // REDUX: reducers/state
    computeAudio: object.isRequired,
    // REDUX: actions/dispatch/func
    createAudio: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhraseCreateNew',
    groupName: 'Form__group',
    id: undefined,
    componentState: 0,
    handleCancel: () => {},
    handleClickRemoveItem: () => {},
    handleItemSelected: () => {},
    refPhrase: () => {},
  }
  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
    createItemFile: {},
    createItemIsShared: false,
    createItemIsChildFocused: false,
    createItemContributors: [],
    createItemRecorders: [],
    pathOrId: undefined,

    'FormRelatedPhraseCreateNew.dc:title': '',
    'FormRelatedPhraseCreateNew.fv:definitions': [],
    'FormRelatedPhraseCreateNew.fv:related_audio': [],
    'FormRelatedPhraseCreateNew.fv:related_pictures': [],
    'FormRelatedPhraseCreateNew.fv:related_videos': [],
    'FormRelatedPhraseCreateNew.fv:cultural_note': [],
    'FormRelatedPhraseCreateNew.fv:reference': '',
    'FormRelatedPhraseCreateNew.fv:acknowledgement': '',
    'FormRelatedPhraseCreateNew.fv:source': [],
    'FormRelatedPhraseCreateNew.fv:available_in_childrens_archive': false,
  }

  // componentDidMount() {
  //   this.phrase.focus()
  // }

  render() {
    const { className, id, textLegendItem, handleClickRemoveItem } = this.props
    const computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
    const isFetching = selectn('isFetching', computeCreate)
    const isSuccess = selectn('success', computeCreate)

    const _handleItemSelectedOrCreated = (selected) => {
      this.props.handleItemSelected(selected, () => {
        handleClickRemoveItem(id)
      })
    }

    if (isSuccess) {
      // Note: deletes the in-progress/newly added item and inserts the just created item
      _handleItemSelectedOrCreated(selectn('response', computeCreate))
    }

    let formStatus = null
    if (isFetching) {
      formStatus = (
        <div className="alert alert-info">
          <FVLabel
            transKey="views.components.editor.uploading_message"
            defaultStr="Uploading... Please be patient..."
            transform="first"
          />
        </div>
      )
    }
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>

        <h2>Create new Related Phrase</h2>
        {/* Name ------------- */}
        <Text
          id="FormRelatedPhraseCreateNew.dc:title"
          className={this.props.groupName}
          name="FormRelatedPhraseCreateNew.dc:title"
          labelText="Phrase"
          value={this.state['FormRelatedPhraseCreateNew.dc:title']}
          handleChange={(phrase) => {
            this.setState({ 'FormRelatedPhraseCreateNew.dc:title': phrase })
          }}
          setRef={this.props.refPhrase}
        />

        {/* Definitions --------------- */}
        <FormDefinitions
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv:definitions"
          value={this.state['FormRelatedPhraseCreateNew.fv:definitions']}
          handleChange={(definitions) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:definitions': definitions })
          }}
        />

        {/* Phrase Books --------------- */}
        <FormPhraseBooks
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv-phrase:phrase_books"
          value={this.state['FormRelatedPhraseCreateNew.fv-phrase:phrase_books']}
          handleChange={(phraseBook) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv-phrase:phrase_books': phraseBook })
          }}
        />

        {/* RELATED AUDIO --------------- */}
        <FormRelatedAudio
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv:related_audio"
          value={this.state['FormRelatedPhraseCreateNew.fv:related_audio']}
          handleChange={(audio) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:related_audio': audio })
          }}
        />

        {/* RELATED PICTURES --------------- */}
        <FormRelatedPictures
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv:related_pictures"
          value={this.state['FormRelatedPhraseCreateNew.fv:related_pictures']}
          handleChange={(pictures) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:related_pictures': pictures })
          }}
        />

        {/* RELATED VIDEOS --------------- */}
        <FormRelatedVideos
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv:related_videos"
          value={this.state['FormRelatedPhraseCreateNew.fv:related_videos']}
          handleChange={(videos) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:related_videos': videos })
          }}
        />

        {/* Cultural Notes --------------- */}
        <FormCulturalNotes
          className="Form__group"
          name="FormRelatedPhraseCreateNew.fv:cultural_note"
          value={this.state['FormRelatedPhraseCreateNew.fv:cultural_note']}
          handleChange={(notes) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:cultural_note': notes })
          }}
        />

        {/* REFERENCE --------------- */}
        <div className="Form__group">
          <Text
            className=""
            id="CreateWord__Reference1"
            labelText="Reference"
            name="FormRelatedPhraseCreateNew.fv:reference"
            ariaDescribedby="describedByReference"
            value={this.state['FormRelatedPhraseCreateNew.fv:reference']}
            handleChange={(reference) => {
              this.setState({ 'FormRelatedPhraseCreateNew.fv:reference': reference })
            }}
          />
          <span id="describedByReference">Origin of record (person, book, etc).</span>
        </div>

        {/* ACKNOWLEDGEMENT --------------- */}
        <div className="Form__group">
          <Text
            className=""
            id="CreateWord__Acknowledgement"
            labelText="Reference"
            name="FormRelatedPhraseCreateNew.fv:acknowledgement"
            ariaDescribedby="describedByReference"
            value={this.state['FormRelatedPhraseCreateNew.fv:acknowledgement']}
            handleChange={(acknowledgement) => {
              this.setState({ 'FormRelatedPhraseCreateNew.fv:acknowledgement': acknowledgement })
            }}
          />
          <span id="describedByAcknowledgement">Acknowledgement or Data Usage</span>
        </div>

        {/* Contributors --------------- */}
        <FormContributors
          className="Form__group"
          textInfo="Contributors who helped create this Phrase."
          name="FormRelatedPhraseCreateNew.fv:source"
          value={this.state['FormRelatedPhraseCreateNew.fv:source']}
          handleChange={(source) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:source': source })
          }}
        />

        {/* IN CHILDREN'S ARCHIVE --------------- */}
        <Checkbox
          className="Form__group"
          id="CreateWord__InKidsArchive0"
          labelText="Available in children's archive"
          name="FormRelatedPhraseCreateNew.fv:available_in_childrens_archive"
          selected={this.state['FormRelatedPhraseCreateNew.fv:available_in_childrens_archive']}
          handleChange={(childrens) => {
            this.setState({ 'FormRelatedPhraseCreateNew.fv:available_in_childrens_archive': childrens })
          }}
        />

        {/* BTN: Create contributor ------------- */}
        <button
          disabled={isFetching || isSuccess}
          type="button"
          onClick={() => {
            this._handleCreateItemSubmit()
          }}
        >
          Create new phrase
        </button>

        {/* BTN: Cancel, go back ------------- */}
        <button
          disabled={isFetching || isSuccess}
          type="button"
          onClick={() => {
            this.props.handleCancel()
          }}
        >
          {"Cancel, don't create Related Phrase"}
        </button>
        {formStatus}
      </fieldset>
    )
  }

  schemaCreateForm = yup.object().shape({
    'FormRelatedPhraseCreateNew.dc:title': yup
      .string()
      .label('Phrase') // used when errored, message will say 'Name' instead of 'dc:title'
      .required(),
    'FormRelatedPhraseCreateNew.fv:definitions': yup
      .array()
      .of(yup.object().shape({ language: yup.string(), translation: yup.string() })),
    // TODO: Phrase books
    'FormRelatedPhraseCreateNew.fv:related_audio': yup.array().of(yup.string()),
    'FormRelatedPhraseCreateNew.fv:related_pictures': yup.array().of(yup.string()),
    'FormRelatedPhraseCreateNew.fv:related_videos': yup.array().of(yup.string()),
    'FormRelatedPhraseCreateNew.fv:cultural_note': yup.array().of(yup.string()),
    'FormRelatedPhraseCreateNew.fv:reference': yup.string(),
    'FormRelatedPhraseCreateNew.fv:acknowledgement': yup.string(),
    'FormRelatedPhraseCreateNew.fv:source': yup.array().of(yup.string()),
    'FormRelatedPhraseCreateNew.fv:available_in_childrens_archive': yup.string(),
  })

  _handleCreateItemSubmit = async () => {
    const formData = this._getFormData()
    // console.log(':::formData::::', formData)
    const formValidation = await this._validateForm(formData)
    if (formValidation.valid) {
      // console.log('IS VALID. WOULD SUBMIT FORM!')
      // const now = Date.now()
      // this.props.createWord(
      //   this.props.routeParams.dialect_path + '/Dictionary',
      //   {
      //     type: 'FVWord',
      //     name: now.toString(),
      //     properties: this._getFormData(),
      //   },
      //   null,
      //   now
      // )
      this.setState({
        errors: [],
        // toggleForm: false,
      })
    } else {
      // console.log('IS NOT VALID', formValidation.errors)
      this.setState({
        errors: formValidation.errors,
        // toggleForm: false,
      })
    }

    // const {
    //   createItemName,
    //   createItemDescription,
    //   createItemFile,
    //   createItemIsShared,
    //   createItemIsChildFocused,
    //   createItemContributors,
    //   createItemRecorders,
    // } = this.state
    // const docParams = {
    //   type: 'FVAudio',
    //   name: createItemName,
    //   properties: {
    //     'dc:title': createItemName,
    //     'dc:description': createItemDescription,
    //     'fvm:shared': createItemIsShared,
    //     'fvm:child_focused': createItemIsChildFocused,
    //     'fvm:recorder': createItemRecorders['fvm:recorder'],
    //     'fvm:source': createItemContributors['fvm:source'],
    //   },
    // }
    // const timestamp = Date.now()
    // const { DIALECT_PATH } = this.props
    // this.props.createAudio(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    // const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    // this.setState({ pathOrId })
  }

  // could centralize the following
  _getFormData = () => {
    return {
      'FormRelatedPhraseCreateNew.dc:title': this.state['FormRelatedPhraseCreateNew.dc:title'],
      'FormRelatedPhraseCreateNew.fv:definitions': this.state['FormRelatedPhraseCreateNew.fv:definitions'],
      'FormRelatedPhraseCreateNew.fv:related_audio': this.state['FormRelatedPhraseCreateNew.fv:related_audio'],
      'FormRelatedPhraseCreateNew.fv:related_pictures': this.state['FormRelatedPhraseCreateNew.fv:related_pictures'],
      'FormRelatedPhraseCreateNew.fv:related_videos': this.state['FormRelatedPhraseCreateNew.fv:related_videos'],
      'FormRelatedPhraseCreateNew.fv:cultural_note': this.state['FormRelatedPhraseCreateNew.fv:cultural_note'],
      'FormRelatedPhraseCreateNew.fv:reference': this.state['FormRelatedPhraseCreateNew.fv:reference'],
      'FormRelatedPhraseCreateNew.fv:acknowledgement': this.state['FormRelatedPhraseCreateNew.fv:acknowledgement'],
      'FormRelatedPhraseCreateNew.fv:source': this.state['FormRelatedPhraseCreateNew.fv:source'],
      'FormRelatedPhraseCreateNew.fv:available_in_childrens_archive': this.state[
        'FormRelatedPhraseCreateNew.fv:available_in_childrens_archive'
      ],
    }
  }
  _validateForm = async (formData) => {
    // Note: When `abortEarly === true` then `{ path, type } = invalid` is defined.
    // When `abortEarly === false` then `{ path, type } = invalid` is not defined! Data is found in `invalid.errors[]`.
    const validation = await this.schemaCreateForm.validate(formData, { abortEarly: false }).then(
      () => {
        return {
          valid: true,
          errors: [],
        }
      },
      (invalid) => {
        const { inner } = invalid
        const errors = inner.map((error) => {
          const { message, path, type } = error
          return {
            message,
            path,
            type,
          }
        })
        return {
          valid: false,
          errors,
        }
      }
    )
    return validation
  }
  _validateField = async ({ name, data }) => {
    // const formDataFormatted = this._getFormData()
    const results = await this._validateForm(data)
    const { valid, errors } = results

    if (valid === false) {
      const fieldErrored = errors.filter((error) => {
        return error.path === name
      })
      if (fieldErrored.length !== 0) {
        const fieldData = fieldErrored[0]
        fieldData.valid = false
        return fieldData
      }
    }
    return {
      valid: true,
    }
  }
  _getError = ({ errors, fieldName }) => {
    const error = errors.filter((errorItem) => {
      return errorItem.path === fieldName
    })
    if (error.length === 1) {
      return error[0]
    }
    return {}
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvAudio } = state

  const { computeAudio } = fvAudio

  return {
    computeAudio,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createAudio,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormRelatedPhraseCreateNew)
