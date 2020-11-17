import React from 'react'
// checked === searchBySettings[idName]
// classNameInput === _classes.SearchDialectOption
// classNameLabel === _classes.SearchDialectLabel
function SearchDialectCheckbox({
  classNameInput = 'SearchDialectOption',
  classNameLabel = 'SearchDialectLabel',
  defaultChecked,
  idName,
  labelText,
}) {
  return (
    <>
      <input defaultChecked={defaultChecked} className={classNameInput} id={idName} name={idName} type="checkbox" />
      <label className={classNameLabel} htmlFor={idName}>
        {labelText}
      </label>
    </>
  )
}
export default SearchDialectCheckbox
