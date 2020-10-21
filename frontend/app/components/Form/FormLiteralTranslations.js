import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import Select from 'components/Form/Common/Select'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'
import { removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
const { string } = PropTypes

export default class FormLiteralTranslations extends React.Component {
  static defaultProps = {
    className: 'FormLiteralTranslations',
    name: 'FormLiteralTranslations',
    groupName: 'Form__group',
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
        <legend>Literal Translations</legend>
        <p className="alert alert-info">Describe what the word translates to regardless of context</p>

        {items}

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          Add a Literal Translation
        </button>

        {this._generateHiddenInput()}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedbyLanguageLiteralTranslation" className="visually-hidden">
          You are adding a Literal Translation for the new word. Please specify the Language of the Literal Translation.
        </span>
        <span id="describedByTranslationLiteralTranslation" className="visually-hidden">
          You are adding a Literal Translation for the new word. Please type a Translation of the Literal Translation in
          the selected Language.
        </span>
        <span id="describedByLiteralTranslationMove" className="visually-hidden">
          {`If you are adding multiple Literal Translations, you can change the position of the Literal Translation with
the 'Move Literal Translation up' and 'Move Literal Translation down' buttons`}
        </span>
      </fieldset>
    )
  }

  handleClickAddItem = () => {
    const items = this.state.items
    const { className } = this.props
    const id = `${className}_${items.length}_${Date.now()}`

    items.push(
      <fieldset key={id} id={id} className={this.props.groupName}>
        <legend>Literal Translation</legend>
        <div className="Form__sidebar">
          <div className="Form__main">
            <Select
              ariaDescribedby="describedbyLanguageLiteralTranslation"
              className="LiteralTranslationLanguage"
              id={`literal_translation.${items.length}.language`}
              labelText="Language"
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              handleChange={(value) => {
                this._handleChange({
                  id,
                  value,
                  property: 'language',
                })
              }}
              value="english"
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
              className="Create__LiteralTranslationTranslation"
              ariaDescribedby="describedByTranslationLiteralTranslation"
              id={`literal_translation.${items.length}.translation`}
              labelText="Translation"
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              handleChange={(value) => {
                this._handleChange({
                  id,
                  value,
                  property: 'translation',
                })
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
  _generateHiddenInput = () => {
    const { items, itemData } = this.state
    const arrayOfObjects = items.map((element) => {
      const id = element.props.id
      return itemData[id]
    })
    return <input type="hidden" name="fv:literal_translation" value={JSON.stringify(arrayOfObjects)} />
  }

  _handleChange = (arg) => {
    const { id, value, property } = arg
    const { itemData: _itemData } = this.state
    _itemData[id][property] = value
    this.setState({
      itemData: _itemData,
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
