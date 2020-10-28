import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'
import { removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
const { string } = PropTypes

export default class FormCulturalNotes extends React.Component {
  static defaultProps = {
    className: 'FormCulturalNotes',
    groupName: 'Form__group',
    name: 'FormCulturalNotes',
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    groupName: string,
  }

  state = {
    items: [],
    itemData: {},
  }

  render() {
    const { className, groupName } = this.props

    const items = this.state.items
    return (
      <fieldset className={`${className} ${groupName}`}>
        <legend>Cultural Notes</legend>

        {items}
        {this._generateHiddenInput()}

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          Add Cultural Note
        </button>

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedByCulturalNoteMove" className="visually-hidden">
          {`If you are adding multiple Cultural Notes, you can change the position of the Cultural Note with
the 'Move Cultural Note up' and 'Move Cultural Note down' buttons`}
        </span>
      </fieldset>
    )
  }
  _generateHiddenInput = () => {
    const { items, itemData } = this.state
    const selectedItems = items.map((element) => {
      const id = element.props.id
      return itemData[id]
    })
    return <input type="hidden" name="fv:cultural_note" value={JSON.stringify(selectedItems)} />
  }
  handleClickAddItem = () => {
    const items = this.state.items
    const { className } = this.props
    const id = `${className}_${items.length}_${Date.now()}`

    items.push(
      <fieldset key={id} id={id} className={this.props.groupName}>
        <legend className="visually-hidden">Cultural Note</legend>
        <div className="Form__sidebar">
          <div className="Form__main">
            <Text
              className="Create__CulturalNote"
              id="CreateWord__CulturalNote0"
              labelText="Cultural Note"
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              value=""
              handleChange={(value) => {
                this.handleTextChange(value, id)
              }}
              setRef={(element) => {
                this[`${id}.text`] = element
              }}
            />
          </div>
          <div className="FormItemButtons Form__aside">
            <FormRemoveButton
              id={id}
              textBtnRemoveItem={'Remove Definition'}
              handleClickRemoveItem={this.handleClickRemoveItem}
            />
            <FormMoveButtons
              id={id}
              idDescribedByItemMove={'describedByDefinitionMove'}
              textBtnMoveItemUp={'Move Definition up'}
              textBtnMoveItemDown={'Move Definition down'}
              handleClickMoveItemUp={this.handleClickMoveItemUp}
              handleClickMoveItemDown={this.handleClickMoveItemDown}
            />
          </div>
        </div>
      </fieldset>
    )
    const { itemData } = this.state
    itemData[id] = ''
    this.setState(
      {
        items,
        itemData,
      },
      () => {
        this[`${id}.text`].focus()
      }
    )
  }
  handleTextChange = (value, id) => {
    const { itemData } = this.state
    itemData[id] = value
    this.setState({
      itemData,
    })
  }
  handleClickRemoveItem = (id) => {
    this.setState({
      items: removeItem({ id, items: this.state.items }),
    })
  }
  handleClickMoveItemDown = (id) => {
    this.setState({
      items: moveItemDown({ id, items: this.state.items }),
    })
  }
  handleClickMoveItemUp = (id) => {
    this.setState({
      items: moveItemUp({ id, items: this.state.items }),
    })
  }
}
