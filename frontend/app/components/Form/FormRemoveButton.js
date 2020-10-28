import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
const { array, func, object, number, string, element } = PropTypes

class FormRemoveButton extends React.Component {
  static propTypes = {
    id: string,
    textBtnRemoveItem: string,
    handleClickRemoveItem: func,
  }
  static defaultProps = {
    id: '_0',
  }
  state = {}

  render() {
    const { id, textBtnRemoveItem, handleClickRemoveItem } = this.props

    return (
      <button
        className="FormRemoveButton"
        onClick={() => {
          handleClickRemoveItem(id)
        }}
        type="button"
      >
        ✖ <span className="visually-hidden">{textBtnRemoveItem}</span>
      </button>
    )
  }
}

export default FormRemoveButton
