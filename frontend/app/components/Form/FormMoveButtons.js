import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
const { array, func, object, number, string, element } = PropTypes

class FormMoveButtons extends React.Component {
  static propTypes = {
    id: string,
    idDescribedByItemMove: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
  }
  static defaultProps = {
    id: 0,
  }
  state = {}

  render() {
    const {
      id,
      idDescribedByItemMove,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
    } = this.props
    return (
      <div className="FormMoveButtons">
        {/* Move item */}
        <button
          className="FormMoveButtons__button"
          aria-describedby={idDescribedByItemMove}
          onClick={() => {
            handleClickMoveItemUp(id)
          }}
          type="button"
        >
          ▲ <span className="visually-hidden">{textBtnMoveItemUp}</span>
        </button>

        {/* Move item */}
        <button
          className="FormMoveButtons__button"
          aria-describedby={idDescribedByItemMove}
          onClick={() => {
            handleClickMoveItemDown(id)
          }}
          type="button"
        >
          ▼ <span className="visually-hidden">{textBtnMoveItemDown}</span>
        </button>
      </div>
    )
  }
}

export default FormMoveButtons
