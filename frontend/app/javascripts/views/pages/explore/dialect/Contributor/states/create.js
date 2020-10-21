import React from 'react'
import PropTypes from 'prop-types'

import FVButton from 'components/FVButton'

import File from 'components/Form/Common/File'
import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import ContributorDelete from 'components/Confirmation'
import { getError, getErrorFeedback } from 'common/FormHelpers'
const { string, element, array, bool, func, object } = PropTypes
export class ContributorStateCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    groupName: string,
    breadcrumb: element,
    errors: array,
    isBusy: bool,
    isEdit: bool,
    isTrashed: bool,
    deleteItem: func,
    onRequestSaveForm: func,
    setFormRef: func,
    valueName: string,
    valueDescription: string,
    valuePhotoName: string,
    valuePhotoData: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
    groupName: 'Form__group',
    breadcrumb: null,
    errors: [],
    isBusy: false,
    isEdit: false,
    isTrashed: false,
    deleteItem: () => {},
    onRequestSaveForm: () => {},
    setFormRef: () => {},
    valueName: '',
    valueDescription: '',
    valuePhotoName: '',
    valuePhotoData: '',
    copy: {
      default: {},
    },
  }
  state = {
    deleting: false,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  btnDeleteInitiate = null
  btnDeleteDeny = null

  render() {
    const {
      className,
      copy,
      groupName,
      valueName,
      valueDescription,
      valuePhotoName,
      valuePhotoData,
      breadcrumb,
      errors,
      isBusy,
      isTrashed,
      isEdit,
      onRequestSaveForm,
      setFormRef,
    } = this.props
    const _copy = isEdit ? copy.edit : copy.create

    return (
      <form
        className={`${className} Contributor Contributor--create`}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
        encType="multipart/form-data"
      >
        {breadcrumb}

        <div className="Contributor__btnHeader">
          <button
            className="_btn _btn--secondary Contributor__btnBack"
            type="button"
            onClick={() => {
              window.history.back()
            }}
          >
            {_copy.btnBack}
          </button>
          {/* BTN: Delete contributor ------------- */}
          {isEdit && !isTrashed ? (
            <ContributorDelete
              confirmationAction={this.props.deleteItem}
              className="Contributor__delete"
              reverse
              copyIsConfirmOrDenyTitle={_copy.isConfirmOrDenyTitle}
              copyBtnInitiate={_copy.btnInitiate}
              copyBtnDeny={_copy.btnDeny}
              copyBtnConfirm={_copy.btnConfirm}
            />
          ) : null}
        </div>

        {isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null}

        <h1 className="Contributor__heading">{_copy.title}</h1>

        <p>{_copy.requiredNotice}</p>

        {/* Name ------------- */}
        <Text
          className={groupName}
          disabled={isTrashed}
          error={getError({ errors, fieldName: 'dc:title' })}
          id={this._clean('dc:title')}
          isRequired
          labelText={_copy.name}
          name="dc:title"
          value={valueName}
        />

        {/* Description ------------- */}
        <Textarea
          className={groupName}
          disabled={isTrashed}
          error={getError({ errors, fieldName: 'dc:description' })}
          id={this._clean('dc:description')}
          labelText={_copy.description}
          name="dc:description"
          value={valueDescription}
          wysiwyg
        />

        {/* File --------------- */}
        <div className={`${groupName} Contributor__photoGroup`}>
          {valuePhotoData && (
            <div className={groupName}>
              <h2>{_copy.profilePhotoCurrent}</h2>
              <p>{valuePhotoName}</p>
              <img className="Contributor__photo" src={valuePhotoData} alt={`Photo representing '${valueName}'`} />
            </div>
          )}
          <File
            className={groupName}
            disabled={isTrashed}
            handleChange={(data) => {
              this.setState({ createItemFile: data })
            }}
            id={this._clean('fvcontributor:profile_picture')}
            labelText={valuePhotoData ? _copy.profilePhotoExists : _copy.profilePhoto}
            name="fvcontributor:profile_picture"
            value=""
          />
        </div>

        {getErrorFeedback({ errors })}

        <div className="Contributor__btn-container">
          {/* BTN: Create contributor ------------- */}
          {/* <button className="_btn _btn--primary" disabled={isBusy || isTrashed} type="submit">
            {_copy.submit}
          </button> */}
          <FVButton
            variant="contained"
            color="primary"
            disabled={isBusy || isTrashed}
            onClick={(e) => {
              e.preventDefault()
              onRequestSaveForm()
            }}
          >
            {_copy.submit}
          </FVButton>
        </div>
      </form>
    )
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
}

export default ContributorStateCreate
