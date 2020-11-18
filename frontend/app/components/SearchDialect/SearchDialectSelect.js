import React from 'react'
import PropTypes from 'prop-types'
function SearchDialectSelect({
  children,
  classNameInput = 'SearchDialectOption',
  classNameLabel = 'SearchDialectLabel',
  defaultValue,
  idName,
  labelText,
}) {
  return (
    <span className="SearchDialectFormSecondaryGroup">
      <label className={classNameLabel} htmlFor={idName}>
        {labelText}
      </label>
      <select className={classNameInput} id={idName} name={idName} defaultValue={defaultValue}>
        {children}
      </select>
    </span>
  )
}
// PROPTYPES
const { string, node } = PropTypes
SearchDialectSelect.propTypes = {
  children: node,
  classNameInput: string,
  classNameLabel: string,
  defaultValue: string,
  idName: string,
  labelText: string,
}
export default SearchDialectSelect
