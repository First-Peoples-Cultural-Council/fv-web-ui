import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
import ProviderHelpers from 'common/ProviderHelpers'
import * as yup from 'yup'

// see about dropping:
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createAudio } from 'reducers/fvAudio'

const { func, object, number, string } = PropTypes
export class FormPhraseBookCreateNew extends React.Component {
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

    // REDUX: reducers/state
    computeAudio: object.isRequired,
    // REDUX: actions/dispatch/func
    createAudio: func.isRequired,
  }
  static defaultProps = {
    className: 'FormPhraseBookCreateNew',
    groupName: 'Form__group',
    id: undefined,
    componentState: 0,
    handleCancel: () => {},
    handleClickRemoveItem: () => {},
    handleItemSelected: () => {},
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
    errors: [],
    'FormPhraseBookCreateNew.dc:title': '',
    'FormPhraseBookCreateNew.dc:description': [],
  }
  componentDidMount() {
    this.phrase.focus()
  }
  render() {
    const { errors } = this.state
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

    // let errorFeedback = null
    // if (errors.length !== 0) {
    //   if (errors.length > 0) {
    //     const li = errors.map((error, i) => {
    //       return (
    //         <li key={i}>
    //           <label className="Form__errorFeedbackItemLabel" htmlFor={error.path}>
    //             {error.message}
    //           </label>
    //         </li>
    //       )
    //     })

    //     const intro = `Please correct the following ${errors.length > 1 ? 'items' : 'item'}:`
    //     errorFeedback = (
    //       <div className="Form__errorFeedback">
    //         {intro}
    //         <ul className="Form__errorFeedbackItems">{li}</ul>
    //       </div>
    //     )
    //   }
    // }

    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>

        <h2>Create new Phrase Book</h2>
        {/* Name ------------- */}
        <Text
          id="FormPhraseBookCreateNew.dc:title"
          className={this.props.groupName}
          name="FormPhraseBookCreateNew.dc:title"
          labelText="Phrase Book name"
          value={this.state['FormPhraseBookCreateNew.dc:title']}
          handleChange={(phrase) => {
            this.setState({ 'FormPhraseBookCreateNew.dc:title': phrase })
          }}
          setRef={(_element) => {
            this.phrase = _element
          }}
          error={this._getError({ errors, fieldName: 'FormPhraseBookCreateNew.dc:title' })}
        />
        {/* Description ------------- */}
        <Textarea
          id="FormPhraseBookCreateNew.dc:description"
          className={this.props.groupName}
          name="FormPhraseBookCreateNew.dc:description"
          labelText="Phrase Book description"
          value={this.state['FormPhraseBookCreateNew.dc:description']}
          handleChange={(phrase) => {
            this.setState({ 'FormPhraseBookCreateNew.dc:description': phrase })
          }}
        />

        {/* {errorFeedback} */}

        {/* BTN: Create contributor ------------- */}
        <button
          disabled={isFetching || isSuccess}
          type="button"
          onClick={() => {
            this._handleCreateItemSubmit()
          }}
        >
          Create new Phrase Book
        </button>

        {/* BTN: Cancel, go back ------------- */}
        <button
          disabled={isFetching || isSuccess}
          type="button"
          onClick={() => {
            this.props.handleCancel()
          }}
        >
          {"Cancel, don't create Phrase Book"}
        </button>
      </fieldset>
    )
  }

  schemaCreateForm = yup.object().shape({
    'FormPhraseBookCreateNew.dc:title': yup
      .string()
      .label('Phrase Book name') // used when errored, message will say 'Name' instead of 'dc:title'
      .required(),
    'FormPhraseBookCreateNew.dc:description': yup.string(),
  })

  _handleCreateItemSubmit = async() => {
    // Note: using state instead of FormData since can't nest forms
    const formData = this._getFormData()
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
  }

  // could centralize the following
  _getFormData = () => {
    return {
      'FormPhraseBookCreateNew.dc:title': this.state['FormPhraseBookCreateNew.dc:title'],
      'FormPhraseBookCreateNew.dc:description': this.state['FormPhraseBookCreateNew.dc:description'],
    }
  }
  _validateForm = async(formData) => {
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
  _validateField = async({ name, data }) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(FormPhraseBookCreateNew)
