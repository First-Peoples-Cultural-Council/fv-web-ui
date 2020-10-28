import React from 'react'
import PropTypes from 'prop-types'
import FormRecorder from 'components/Form/FormRecorder'
import { removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
const { string, array, func } = PropTypes

export default class FormRecorders extends React.Component {
  static defaultProps = {
    className: 'FormRecorders',
    idDescribedbyItemBrowse: 'describedbyItemBrowse',
    idDescribedByItemMove: 'describedByItemMove',
    name: 'FormRecorders',
    textDescribedbyItemBrowse: 'Select a Recorder from previously created Recorders',
    textDescribedByItemMove:
      "If you are adding multiple Recorders, you can change the position of the Recorder with the 'Move Recorder up' and 'Move Recorder down' buttons",
    textLegendItems: 'Recorders',
    textBtnAddItem: 'Add Recorder',
    textLegendItem: 'Recorder',
    // textBtnEditItem: 'Edit Recorder',
    textBtnRemoveItem: 'Remove Recorder',
    textBtnMoveItemUp: 'Move Recorder up',
    textBtnMoveItemDown: 'Move Recorder down',
    textBtnCreateItem: 'Create new Recorder',
    textBtnSelectExistingItems: 'Select from existing Recorders',
    textLabelItemSearch: 'Search existing Recorders',
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
    // textBtnEditItem: string,
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

    // const items = this.getItems()
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
      // textBtnEditItem,
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
      // textBtnEditItem,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLabelItemSearch,
      handleClickCreateItem: this.handleClickCreateItem,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
    }

    const items = this.state.items
    const id = `${className}_${items.length}_${Date.now()}`
    items.push(
      <FormRecorder
        key={id}
        id={id}
        {..._props}
        handleItemChange={({ id: _id, uid }) => {
          const { itemsIdUid } = this.state
          itemsIdUid[_id] = uid
          this.setState(itemsIdUid, () => {
            this.props.handleItemsUpdate(this._getFvmRecorder())
          })
        }}
      />
    )
    this.setState(
      {
        items,
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmRecorder())
      }
    )
  }
  handleClickCreateItem = () => {
    // console.log('! handleClickCreateItem', this.index)
  }
  handleClickSelectItem = () => {
    // console.log('! handleClickSelectItem')
  }
  handleClickEditItem = () => {
    // console.log('! handleClickEditItem')
  }
  handleClickRemoveItem = (id) => {
    this.setState(
      {
        items: removeItem({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmRecorder())
      }
    )
  }
  handleClickMoveItemDown = (id) => {
    this.setState(
      {
        items: moveItemDown({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmRecorder())
      }
    )
  }
  handleClickMoveItemUp = (id) => {
    this.setState(
      {
        items: moveItemUp({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmRecorder())
      }
    )
  }
  _getFvmRecorder = () => {
    const { items, itemsIdUid } = this.state
    const fvmRecorder = []
    items.forEach((element) => {
      const uid = itemsIdUid[element.props.id]
      if (uid) {
        fvmRecorder.push(uid)
      }
    })
    return {
      'fvm:recorder': fvmRecorder,
    }
  }

  _generateHiddenInput = () => {
    const { items, itemsIdUid } = this.state
    const selectedItems = items.map((element) => {
      return itemsIdUid[element.props.id]
    })
    return <input type="hidden" name="fvm:recorder" value={JSON.stringify(selectedItems)} />
  }
}
