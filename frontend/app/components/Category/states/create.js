import React from 'react'
import PropTypes from 'prop-types'

import FVButton from 'components/FVButton'
import Select from 'components/Form/Common/Select'
import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import { getError, getErrorFeedback } from 'common/FormHelpers'
import CategoryDelete from 'components/Confirmation'

const { string, element, array, bool, func, object } = PropTypes
export class CategoryStateCreate extends React.Component {
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
    valueParent: string,
    valueDescription: string,
    valueCategories: array,
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
    valueParent: '',
    valueDescription: '',
    valueCategories: [],
    valuePhotoName: '',
    valuePhotoData: '',
    copy: {
      default: {},
    },
  }
  state = {
    deleting: false,
    parentCategory: '',
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
      valueParent,
      valueDescription,
      valueCategories,
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
        className={`${className} Category Category--create`}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
      >
        {breadcrumb}

        <div className="Category__btnHeader">
          <button
            className="_btn _btn--secondary Category__btnBack"
            type="button"
            onClick={() => {
              window.history.back()
            }}
          >
            {_copy.btnBack}
          </button>
          {/* BTN: Delete contributor ------------- */}
          {isEdit && !isTrashed ? (
            <CategoryDelete
              confirmationAction={this.props.deleteItem}
              className="Category__delete"
              reverse
              copyIsConfirmOrDenyTitle={_copy.isConfirmOrDenyTitle}
              copyBtnInitiate={_copy.btnInitiate}
              copyBtnDeny={_copy.btnDeny}
              copyBtnConfirm={_copy.btnConfirm}
            />
          ) : null}
        </div>

        {isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null}

        <h1 className="Category__heading">{_copy.title}</h1>

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

        {/* Parent Category ------------- */}
        <Select
          className={groupName}
          id={this._clean('parentRef')}
          labelText={_copy.parent}
          name="parentRef"
          value={valueParent}
          error={getError({ errors, fieldName: 'parentRef' })}
        >
          {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
          <optgroup>
            {valueCategories.map((category, index) => {
              return (
                <option key={index} value={category.uid}>
                  {category.title}
                </option>
              )
            })}
          </optgroup>
        </Select>

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

        <div className="Category__btn-container">
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

export default CategoryStateCreate
