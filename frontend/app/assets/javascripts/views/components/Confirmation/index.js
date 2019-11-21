import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./Confirmation.css'
import SpinnerBallFall from 'views/components/SpinnerBallFall'
const { string, bool, func } = PropTypes

const STATE_INITIALIZING = 0
const STATE_DEFAULT = 1
const STATE_CONFIRM_OR_DENY = 2
const STATE_PERFORMING_ACTION = 3

export class Confirmation extends React.Component {
  static propTypes = {
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
  static defaultProps = {
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
  state = {
    isConfirmOrDeny: false,
    isPerformingAction: false,
    componentState: STATE_INITIALIZING,
  }
  btnInitiate = React.createRef()
  btnDeny = React.createRef()

  async componentDidMount() {
    // use copy from props or load up file
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "ConfirmationInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )
    // Flip to ready state...
    this.setState({
      componentState: STATE_DEFAULT,
      copy,
    })
  }

  render() {
    const {
      className,
      compact,
      copyIsConfirmOrDenyTitle,
      copyBtnInitiate,
      copyBtnDeny,
      copyBtnConfirm,
      disabled,
      reverse,
    } = this.props
    const { componentState } = this.state

    // Component state modifier classNames
    let classNameComponentState = ''
    switch (componentState) {
      case STATE_INITIALIZING:
        classNameComponentState = 'Confirmation--isInitializing'
        break
      case STATE_CONFIRM_OR_DENY:
        classNameComponentState = 'Confirmation--isConfirmOrDeny'
        break
      case STATE_PERFORMING_ACTION:
        classNameComponentState = 'Confirmation--isConfirmOrDeny Confirmation--isPerformingAction'
        break
      default:
        // NOTE: STATE_DEFAULT
        classNameComponentState = 'Confirmation--isDefault'
    }

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
            ref={this.btnInitiate}
            disabled={disabled}
            onClick={this._initiate}
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
              ref={this.btnDeny}
              disabled={disabled || componentState === STATE_PERFORMING_ACTION}
              onClick={this._deny}
              type="button"
            >
              {copyBtnDeny}
            </button>
            <button
              className={`Confirmation__btnConfirm _btn _btn--destructive ${classNameBtnCompact}`}
              disabled={disabled || componentState === STATE_PERFORMING_ACTION}
              onClick={this._confirm}
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
  _initiate = () => {
    this.setState(
      {
        componentState: STATE_CONFIRM_OR_DENY,
      },
      () => {
        this.btnDeny.current.focus()
      }
    )
  }
  _confirm = () => {
    this.setState(
      {
        componentState: STATE_PERFORMING_ACTION,
      },
      () => {
        this.props.confirmationAction()
      }
    )
  }
  _deny = () => {
    this.setState(
      {
        componentState: STATE_DEFAULT,
      },
      () => {
        this.btnInitiate.current.focus()
      }
    )
  }
}

export default Confirmation
