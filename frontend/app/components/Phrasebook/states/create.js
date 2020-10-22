import React from 'react'
import PropTypes from 'prop-types'

import FVButton from 'components/FVButton'

import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import { getError, getErrorFeedback } from 'common/FormHelpers'
import PhrasebookDelete from 'components/Confirmation'
const { string, element, array, bool, func, object } = PropTypes
export class PhrasebookStateCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    deleteItem: func,
    groupName: string,
    breadcrumb: element,
    errors: array,
    isBusy: bool,
    isEdit: bool,
    isTrashed: bool,
    deleteSelf: func,
    onRequestSaveForm: func,
    setFormRef: func,
    valueName: string,
    valueDescription: string,
    valuePhotoName: string,
    valuePhotoData: string,
  }
  static defaultProps = {
    className: '',
    deleteItem: () => {},
    groupName: '',
    breadcrumb: null,
    errors: [],
    isBusy: false,
    isEdit: false,
    isTrashed: false,
    deleteSelf: () => {},
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
      breadcrumb,
      errors,
      isBusy,
      isEdit,
      isTrashed,
      onRequestSaveForm,
      setFormRef,
    } = this.props
    const _copy = isEdit ? copy.edit : copy.create
    return (
      <form
        className={`${className} Phrasebook Phrasebook--create`}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
      >
        {breadcrumb}

        <div className="Phrasebook__btnHeader">
          <button
            className="_btn _btn--secondary Phrasebook__btnBack"
            type="button"
            onClick={() => {
              window.history.back()
            }}
          >
            {_copy.btnBack}
          </button>
          {/* BTN: Delete contributor ------------- */}
          {isEdit && !isTrashed ? (
            <PhrasebookDelete
              confirmationAction={this.props.deleteItem}
              className="Phrasebook__delete"
              reverse
              copyIsConfirmOrDenyTitle={_copy.isConfirmOrDenyTitle}
              copyBtnInitiate={_copy.btnInitiate}
              copyBtnDeny={_copy.btnDeny}
              copyBtnConfirm={_copy.btnConfirm}
            />
          ) : null}
        </div>

        {isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null}

        <h1 className="Phrasebook__heading">{_copy.title}</h1>

        <p>{_copy.requiredNotice}</p>

        {/* Name ------------- */}
        <Text
          className={groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          value={valueName}
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={_copy.name}
          disabled={isTrashed}
        />

        {/* Description ------------- */}
        <Textarea
          className={groupName}
          id={this._clean('dc:description')}
          labelText={_copy.description}
          name="dc:description"
          value={valueDescription}
          error={getError({ errors, fieldName: 'dc:description' })}
          wysiwyg
          disabled={isTrashed}
        />

        {getErrorFeedback({ errors })}

        <div className="Phrasebook__btn-container">
          {/* BTN: Create ------------- */}
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

export default PhrasebookStateCreate
