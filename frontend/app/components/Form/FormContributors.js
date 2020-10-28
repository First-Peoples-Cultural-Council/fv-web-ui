import React from 'react'
import PropTypes from 'prop-types'
import FormContributor from 'components/Form/FormContributor'
import { removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
const { string, array, func } = PropTypes

export default class FormContributors extends React.Component {
  static defaultProps = {
    className: 'FormContributors',
    idDescribedbyItemBrowse: 'describedbyItemBrowse',
    idDescribedByItemMove: 'describedByItemMove',
    name: 'FormContributors',
    textDescribedbyItemBrowse: 'Select a Contributor from previously created Contributors',
    textDescribedByItemMove:
      "If you are adding multiple Contributors, you can change the position of the Contributor with the 'Move Contributor up' and 'Move Contributor down' buttons",
    textLegendItems: 'Contributors',
    textBtnAddItem: 'Add Contributor',
    textLegendItem: 'Contributor',
    textBtnRemoveItem: 'Remove Contributor',
    textBtnMoveItemUp: 'Move Contributor up',
    textBtnMoveItemDown: 'Move Contributor down',
    textBtnCreateItem: 'Create new Contributor',
    textBtnSelectExistingItems: 'Select from existing Contributors',
    textLabelItemSearch: 'Search existing Contributors',
    handleItemsUpdate: () => {},
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    textInfo: string,
    items: array,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    textDescribedbyItemBrowse: string,
    textDescribedByItemMove: string,
    textLegendItems: string,
    textBtnAddItem: string,
    textLegendItem: string,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnCreateItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    handleItemsUpdate: func,
  }

  state = {
    items: [],
    itemsIdUid: {},
  }

  render() {
    const {
      className,
      textInfo,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textDescribedbyItemBrowse,
      textDescribedByItemMove,
      textLegendItems,
      textBtnAddItem,
    } = this.props

    const items = this.state.items
    return (
      <fieldset className={className}>
        <legend>{textLegendItems}</legend>
        {textInfo && <p className="alert alert-info">{textInfo}</p>}
        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          {textBtnAddItem}
        </button>

        {items}
        {this._generateHiddenInput()}
        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id={idDescribedbyItemBrowse} className="visually-hidden">
          {textDescribedbyItemBrowse}
        </span>
        <span id={idDescribedByItemMove} className="visually-hidden">
          {textDescribedByItemMove}
        </span>
      </fieldset>
    )
  }

  handleClickAddItem = () => {
    const {
      className,
      name,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textLegendItem,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLabelItemSearch,
    } = this.props
    const _props = {
      className,
      name,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textLegendItem,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLabelItemSearch,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
    }

    const items = this.state.items
    const id = `${className}_${items.length}_${Date.now()}`
    items.push(
      <FormContributor
        key={id}
        id={id}
        {..._props}
        handleItemChange={({ id: _id, uid }) => {
          const { itemsIdUid } = this.state
          itemsIdUid[_id] = uid
          this.setState(itemsIdUid, () => {
            this.props.handleItemsUpdate(this._getFvmSource())
          })
        }}
      />
    )
    this.setState(
      {
        items,
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickRemoveItem = (id) => {
    this.setState(
      {
        items: removeItem({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickMoveItemDown = (id) => {
    this.setState(
      {
        items: moveItemDown({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickMoveItemUp = (id) => {
    this.setState(
      {
        items: moveItemUp({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  _generateHiddenInput = () => {
    const { items, itemsIdUid } = this.state
    const selectedItems = items.map((element) => {
      return itemsIdUid[element.props.id]
    })
    return <input type="hidden" name="fvm:source" value={JSON.stringify(selectedItems)} />
  }
  _getFvmSource = () => {
    const { items, itemsIdUid } = this.state
    const fvmSource = []
    items.forEach((element) => {
      const uid = itemsIdUid[element.props.id]
      if (uid) {
        fvmSource.push(uid)
      }
    })
    return {
      'fvm:source': fvmSource,
    }
  }
}
