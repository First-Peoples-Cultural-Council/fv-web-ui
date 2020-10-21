import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./Confirmation.css'
import SpinnerBallFall from 'components/SpinnerBallFall'
const STATE_INITIALIZING = 0
const STATE_DEFAULT = 1
const STATE_CONFIRM_OR_DENY = 2
const STATE_PERFORMING_ACTION = 3

export const Confirmation = (props) => {
  const btnInitiate = useRef(null)
  const btnDeny = useRef(null)

  const [componentState, setComponentState] = useState(STATE_INITIALIZING)
  const [classNameComponentState, setClassNameComponentState] = useState('Confirmation--isDefault')
  useEffect(() => {
    if (componentState === STATE_CONFIRM_OR_DENY) {
      btnDeny.current.focus()
    }
    if (componentState === STATE_DEFAULT) {
      btnInitiate.current.focus()
    }
  }, [componentState])

  const initiate = () => {
    setComponentState(STATE_CONFIRM_OR_DENY)
    setClassNameComponentState('Confirmation--isConfirmOrDeny')
  }
  const confirm = () => {
    setComponentState(STATE_PERFORMING_ACTION)
    setClassNameComponentState('Confirmation--isConfirmOrDeny Confirmation--isPerformingAction')
    props.confirmationAction()
  }
  const deny = () => {
    setComponentState(STATE_DEFAULT)
    setClassNameComponentState('Confirmation--isDefault')
  }
  const {
    className,
    compact,
    copyIsConfirmOrDenyTitle,
    copyBtnInitiate,
    copyBtnDeny,
    copyBtnConfirm,
    disabled,
    reverse,
  } = props

  // Modifier classNames
  const classNameCompact = compact ? 'Confirmation--compact' : ''
  const classNameBtnCompact = compact ? '_btn--compact' : ''
  const classNameReverse = reverse ? 'Confirmation--reverse' : ''
  const classNameDisabled = disabled ? 'Confirmation--disabled' : ''

  return (
    <div
      className={`Confirmation ${className} ${classNameReverse} ${classNameCompact} ${classNameDisabled} ${classNameComponentState}`}
    >
      <div className={'Confirmation__initiate'}>
        <button
          className={`Confirmation__btnInitiate _btn _btn--secondary ${classNameBtnCompact}`}
          ref={btnInitiate}
          disabled={disabled}
          onClick={initiate}
          type="button"
        >
          {copyBtnInitiate}
        </button>
      </div>
      <div className="Confirmation__confirmOrDeny">
        <h2 className="Confirmation__confirmOrDenyTitle">{copyIsConfirmOrDenyTitle}</h2>
        <div className="Confirmation__confirmOrDenyInner">
          <button
            className={`Confirmation__btnDeny _btn _btn--secondary ${classNameBtnCompact}`}
            ref={btnDeny}
            disabled={disabled || componentState === STATE_PERFORMING_ACTION}
            onClick={deny}
            type="button"
          >
            {copyBtnDeny}
          </button>
          <button
            className={`Confirmation__btnConfirm _btn _btn--destructive ${classNameBtnCompact}`}
            disabled={disabled || componentState === STATE_PERFORMING_ACTION}
            onClick={confirm}
            type="button"
          >
            <SpinnerBallFall className="Confirmation__busy" />
            <div className="Confirmation__btnConfirmText">{copyBtnConfirm}</div>
          </button>
        </div>
      </div>
    </div>
  )
}
const { string, bool, func } = PropTypes
Confirmation.propTypes = {
  className: string,
  compact: bool,
  confirmationAction: func,
  copyIsConfirmOrDenyTitle: string,
  copyBtnInitiate: string,
  copyBtnDeny: string,
  copyBtnConfirm: string,
  disabled: bool,
  deleting: bool,
  reverse: bool,
  setFormRef: func,
}
Confirmation.defaultProps = {
  className: '',
  compact: false,
  confirmationAction: () => {},
  copyIsConfirmOrDenyTitle: '',
  copyBtnInitiate: '',
  copyBtnDeny: '',
  copyBtnConfirm: '',
  deleting: false,
  disabled: false,
  reverse: false,
  setFormRef: () => {},
}
export default Confirmation
