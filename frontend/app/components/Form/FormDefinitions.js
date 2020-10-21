import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import Select from 'components/Form/Common/Select'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'
import { removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
const { string, array, func } = PropTypes

export default class FormDefinitions extends React.Component {
  static defaultProps = {
    className: 'FormDefinitions',
    groupName: 'Form__group',
    name: 'FormDefinitions',
    itemData: [],
    handleChange: () => {},
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    groupName: string,
    itemData: array,
    handleChange: func,
  }

  state = {
    items: [], // jsx
    itemData: {},
  }

  componentDidMount() {
    this._populateItems()
  }

  render() {
    const { className } = this.props

    const { items } = this.state

    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>Definitions</legend>
        <p className="alert alert-info">Describe what the word actually means</p>

        {items}

        <button
          type="button"
          onClick={() => {
            this._handleClickAddItem()
          }}
        >
          Add a Definition
        </button>

        {this._generateHiddenInput()}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedbyLanguage" className="visually-hidden">
          You are adding a Definition for the new word. Please specify the Language of the Definition.
        </span>
        <span id="describedByTranslation" className="visually-hidden">
          You are adding a Definition for the new word. Please type a Translation of the Definition in the selected
          Language.
        </span>
        <span id="describedByDefinitionMove" className="visually-hidden">
          {`If you are adding multiple Definitions, you can change the position of the Definition with the 'Move
Definition up' and 'Move Definition down' buttons`}
        </span>
      </fieldset>
    )
  }

  _handleClickAddItem = () => {
    const items = this.state.items
    const { className } = this.props
    const id = `${className}_${items.length}_${Date.now()}`

    items.push(this._generateDefinition({ id, index: items.length }))
    const { itemData } = this.state
    itemData[id] = { language: 'english', translation: '' }
    this.setState(
      {
        items,
        itemData,
      },
      () => {
        // focus on the newly created select
        this[`${id}.select`].focus()
      }
    )
  }

  _populateItems = () => {
    const { className, itemData: itemDataProps } = this.props
    const { items, itemData } = this.state
    const _items = []
    const _itemData = {}
    itemDataProps.forEach((item, index) => {
      const { language, translation } = item
      const id = `${className}_${items.length + index}_${Date.now()}`
      _items.push(this._generateDefinition({ id, language, translation, index }))
      _itemData[id] = { language, translation }
    })
    this.setState({
      items: [...items, ..._items],
      itemData: Object.assign({}, itemData, _itemData),
    })
  }

  _generateDefinition = ({ id, index, language, translation }) => {
    return (
      <fieldset key={id} id={id} className={this.props.groupName}>
        <legend>Definition</legend>
        <div className="Form__sidebar">
          <div className="Form__main">
            <Select
              ariaDescribedby="describedbyLanguage"
              className="DefinitionLanguage"
              id={`definitions.${index}.language`}
              labelText="Language"
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              handleChange={(value) => {
                this._handleChange({
                  id,
                  value,
                  property: 'language',
                })
              }}
              value={language || 'english'}
              setRef={(element) => (this[`${id}.select`] = element)}
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
              </optgroup>
            </Select>
            <Text
              className="Create__DefinitionTranslation"
              ariaDescribedby="describedByTranslation"
              id={`definitions.${index}.translation`}
              labelText="Translation"
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              handleChange={(value) => {
                this._handleChange({
                  id,
                  value,
                  property: 'translation',
                })
              }}
              value={translation || ''}
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
  }

  _generateHiddenInput = () => {
    const { items, itemData } = this.state
    // TODO: NEED TO BE ABLE TO SET ITEMS
    // loop through jsx items displayed and pull related entry in itemData
    // consider a visible flag?
    // Perhaps these need to handle arrays instead of jsx collections:
    // removeItem
    // moveItemDown
    // moveItemUp
    const arrayOfObjects = items.map((element) => {
      const id = element.props.id
      return itemData[id]
    })

    return <input type="hidden" name={this.props.name} value={JSON.stringify(arrayOfObjects)} />
  }

  _handleChange = (arg) => {
    const { id, value, property } = arg
    const { itemData: _itemData } = this.state
    _itemData[id][property] = value
    this.setState(
      {
        itemData: _itemData,
      },
      () => {
        const { items, itemData } = this.state
        const arrayOfObjects = items.map((element) => {
          const _id = element.props.id
          return itemData[_id]
        })
        this.props.handleChange(arrayOfObjects)
      }
    )
  }

  handleClickRemoveItem = (id) => {
    this.setState({
      items: removeItem({ id, items: this.state.items }),
    })
  }

  handleClickMoveItemDown = (id) => {
    const items = moveItemDown({ id, items: this.state.items })
    this.setState({
      items,
    })
  }

  handleClickMoveItemUp = (id) => {
    this.setState({
      items: moveItemUp({ id, items: this.state.items }),
    })
  }
}
