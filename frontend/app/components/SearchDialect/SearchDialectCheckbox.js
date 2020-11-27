import React from 'react'
import PropTypes from 'prop-types'
function SearchDialectCheckbox({
  classNameInput = 'SearchDialectOption',
  classNameLabel = 'SearchDialectLabel',
  defaultChecked,
  idName,
  labelText,
}) {
  return (
    <span className="SearchDialectFormSecondaryGroup">
      <input defaultChecked={defaultChecked} className={classNameInput} id={idName} name={idName} type="checkbox" />
      <label className={classNameLabel} htmlFor={idName}>
        {labelText}
      </label>
    </span>
  )
}
// PROPTYPES
const { bool, string } = PropTypes
SearchDialectCheckbox.propTypes = {
  classNameInput: string,
  classNameLabel: string,
  defaultChecked: bool,
  idName: string,
  labelText: string,
}
export default SearchDialectCheckbox
