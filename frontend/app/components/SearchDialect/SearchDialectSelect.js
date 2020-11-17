import React from 'react'
function SearchDialectSelect({ classNameInput = 'SearchDialectOption', defaultValue, idName, children }) {
  return (
    <select className={classNameInput} id={idName} name={idName} defaultValue={defaultValue}>
      {children}
    </select>
  )
}
export default SearchDialectSelect
