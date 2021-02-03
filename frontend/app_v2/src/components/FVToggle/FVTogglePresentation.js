import React from 'react'
import PropTypes from 'prop-types'

/**
 * @summary FVTogglePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {boolean} props.toggled state of the toggle - true or false sets it to on or off
 * @param {function} props.toggleCallback a function to be called upon toggle click
 *
 * @returns {node} jsx markup
 */
function FVTogglePresentation({ toggled, toggleCallback, styling }) {
  const toggleInputClass = toggled ? ' border-fv-green right-0' : ' border-fv-warning-red'
  const toggleLabelClass = toggled ? ' bg-fv-green right-0' : ' bg-fv-warning-red'

  const onToggleClick = () => {
    toggleCallback()
  }

  return (
    <div className={styling}>
      <div
        onClick={() => onToggleClick()}
        className="relative w-12 align-middle select-none transition duration-200 ease-in"
      >
        <input
          type="checkbox"
          name="toggle"
          id="workspace-toggle"
          className={`absolute block w-7 h-7 rounded-full bg-white border-2 appearance-none cursor-pointer focus:outline-none ${toggleInputClass}`}
        />
        <label htmlFor="toggle" className={`block overflow-hidden h-7 rounded-full cursor-pointer ${toggleLabelClass}`}>
          {toggled ? (
            <p className="text-white text-xxs p-0.5">ON</p>
          ) : (
            <p className="absolute text-white text-xxs p-0.5 right-0">OFF</p>
          )}
        </label>
      </div>
    </div>
  )
}
// PROPTYPES
const { bool, func, string } = PropTypes
FVTogglePresentation.propTypes = {
  toggled: bool,
  toggleCallback: func,
  styling: string,
}

FVTogglePresentation.defaultProps = {
  toggled: false,
  toggleCallback: () => {},
}
export default FVTogglePresentation
