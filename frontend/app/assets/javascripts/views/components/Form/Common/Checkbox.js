import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const { string, number, bool, func, oneOfType, object } = PropTypes

const Checkbox = (props) => {
  const [selected, setSelected] = useState(props.selected)
  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])

  const { className, ariaDescribedby, id, labelText, name, value, setRef } = props
  const { message } = props.error

  const handleChange = () => {
    const newValue = !selected
    setSelected(newValue)
    props.handleChange(newValue, props.value)
  }

  return (
    <div className={`${className} Checkbox ${message ? 'Form__error' : ''}`}>
      <input
        aria-describedby={ariaDescribedby}
        className={`${className}__text Checkbox__text`}
        id={id}
        name={name}
        checked={selected}
        onChange={handleChange}
        value={value}
        type="checkbox"
        ref={setRef}
      />
      <label className={`${className}__label Checkbox__label`} htmlFor={id}>
        {labelText}
      </label>
      {message && (
        <div>
          <label className="Form__errorMessage" htmlFor={id}>
            {message}
          </label>
        </div>
      )}
    </div>
  )
}
Checkbox.propTypes = {
  id: string.isRequired,
  labelText: string.isRequired,
  name: string.isRequired,
  ariaDescribedby: string,
  className: string,
  selected: bool,
  handleChange: func,
  value: oneOfType([number, string, bool]),
  error: object,
  setRef: func,
}
Checkbox.defaultProps = {
  className: 'Checkbox',
  value: true,
  handleChange: () => {},
  error: {},
  setRef: () => {},
}
export default Checkbox
