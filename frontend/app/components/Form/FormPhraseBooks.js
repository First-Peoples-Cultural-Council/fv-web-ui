import React from 'react'
import PropTypes from 'prop-types'
import FormPhraseBook from 'components/Form/FormPhraseBook'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
import BrowseComponent from 'components/BrowseComponent'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'

const { array, string, object, func } = PropTypes

export class FormPhraseBooks extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2

  static propTypes = {
    name: string.isRequired,
    className: string,
    textInfo: string,
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
    // REDUX: reducers/state
    computeDialect: object.isRequired,
    splitWindowPath: array.isRequired,
  }

  static defaultProps = {
    className: 'FormPhraseBooks',
    idDescribedbyItemBrowse: 'describedbyItemBrowse',
    idDescribedByItemMove: 'describedByItemMove',
    name: 'FormPhraseBooks',
    textDescribedbyItemBrowse: 'Select a Phrase Book from previously created Phrase Books',
    textDescribedByItemMove:
      "If you are adding multiple Phrase Books, you can change the position of the Phrase Book with the 'Move Phrase Book up' and 'Move Phrase Book down' buttons",
    textLegendItems: 'Phrase Books',
    textBtnAddItem: 'Add Phrase Book',
    textLegendItem: 'Phrase Book',
    textBtnRemoveItem: 'Remove Phrase Book',
    textBtnMoveItemUp: 'Move Phrase Book up',
    textBtnMoveItemDown: 'Move Phrase Book down',
    textBtnCreateItem: 'Create new Phrase Book',
    textBtnSelectExistingItems: 'Select from existing Phrase Books',
    textLabelItemSearch: 'Search existing Phrase Books',
    handleItemsUpdate: () => {},
  }

  state = {
    items: [],
    itemsIdUid: {},
    componentState: this.STATE_LOADING,
  }

  buttonCreate = React.createRef()

  // Fetch data on initial render
  async componentDidMount() {
    const { splitWindowPath } = this.props

    const dialect = await selectn('response', this.props.computeDialect)
    if (dialect) {
      this.setState({
        componentState: this.STATE_DEFAULT,
        dialect,
        dialectPath: ProviderHelpers.getDialectPathFromURLArray(splitWindowPath),
      })
    }
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
      textBtnCreateItem,
    } = this.props

    const { items, FormPhraseBookCreateNew, componentState } = this.state
    return (
      <fieldset className={className}>
        <legend>{textLegendItems}</legend>
        {textInfo && <p className="alert alert-info">{textInfo}</p>}
        <button
          type="button"
          onClick={() => {
            this._handleClickCreateItem()
          }}
          ref={this.buttonCreate}
        >
          {textBtnCreateItem}
        </button>

        {this.state.dialect && BrowseComponent && (
          <BrowseComponent
            type="FVCategory"
            label="Select from existing Phrases"
            onComplete={this.handleItemSelected}
            disabled={this.state.dialect === undefined}
            dialect={this.state.dialect}
            containerType="FVPhrase"
          />
        )}

        {componentState === this.STATE_CREATE && FormPhraseBookCreateNew && (
          <FormPhraseBookCreateNew handleCancel={this.handleCancel} />
        )}

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
  handleItemSelected = (selected, callback) => {
    const uid = selectn('uid', selected)

    let { items } = this.state
    const { dialectPath } = this.state
    const arg = { id: uid, items }

    if (getIndexOfElementById(arg) !== -1) {
      items = removeItem(arg)
    }

    const _props = {
      name: this.props.name,
      className: this.props.className,
      idDescribedbyItemBrowse: this.props.idDescribedbyItemBrowse,
      idDescribedByItemMove: this.props.idDescribedByItemMove,
      textLegendItem: this.props.textLegendItem,
      textBtnRemoveItem: this.props.textBtnRemoveItem,
      textBtnMoveItemUp: this.props.textBtnMoveItemUp,
      textBtnMoveItemDown: this.props.textBtnMoveItemDown,
      textBtnCreateItem: this.props.textBtnCreateItem,
      textBtnSelectExistingItems: this.props.textBtnSelectExistingItems,
      textLabelItemSearch: this.props.textLabelItemSearch,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
      handleItemSelected: this.handleItemSelected,
      computeDialectFromParent: this.props.computeDialect,
      DIALECT_PATH: dialectPath,
    }

    this.setState(
      {
        items: [...items, <FormPhraseBook componentState={3} key={uid} id={uid} {..._props} />],
      },
      () => {
        if (callback) {
          callback()
        }
      }
    )
  }
  handleCancel = () => {
    this.setState(
      {
        componentState: this.STATE_DEFAULT,
      },
      () => {
        this.buttonCreate.current.focus()
      }
    )
  }
  _handleClickCreateItem = async () => {
    const _FormPhraseBookCreateNew = await import('components/Form/FormPhraseBookCreateNew')
    this.setState({
      FormPhraseBookCreateNew: _FormPhraseBookCreateNew.default,
      componentState: this.STATE_CREATE,
    })
  }
  // _handleClickAddItem = () => {
  //   const {
  //     className,
  //     name,
  //     idDescribedbyItemBrowse,
  //     idDescribedByItemMove,
  //     textLegendItem,
  //     textBtnRemoveItem,
  //     textBtnMoveItemUp,
  //     textBtnMoveItemDown,
  //     textBtnCreateItem,
  //     textBtnSelectExistingItems,
  //     textLabelItemSearch,
  //   } = this.props
  //   const _props = {
  //     className,
  //     name,
  //     idDescribedbyItemBrowse,
  //     idDescribedByItemMove,
  //     textLegendItem,
  //     textBtnRemoveItem,
  //     textBtnMoveItemUp,
  //     textBtnMoveItemDown,
  //     textBtnCreateItem,
  //     textBtnSelectExistingItems,
  //     textLabelItemSearch,
  //     handleClickRemoveItem: this.handleClickRemoveItem,
  //     handleClickMoveItemUp: this.handleClickMoveItemUp,
  //     handleClickMoveItemDown: this.handleClickMoveItemDown,
  //   }

  //   const items = this.state.items
  //   const id = `${className}_${items.length}_${Date.now()}`
  //   items.push(
  //     <FormPhraseBook
  //       key={id}
  //       id={id}
  //       {..._props}
  //       handleItemChange={({ id: _id, uid }) => {
  //         const { itemsIdUid } = this.state
  //         itemsIdUid[_id] = uid
  //         this.setState(itemsIdUid, () => {
  //           this.props.handleItemsUpdate(this._getFvmSource())
  //         })
  //       }}
  //     />
  //   )
  //   this.setState(
  //     {
  //       items,
  //     },
  //     () => {
  //       this.props.handleItemsUpdate(this._getFvmSource())
  //     }
  //   )
  // }
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
    const selectedItems = []
    items.forEach((element) => {
      // console.log('here', element.props)
      const uid = itemsIdUid[element.props.id]
      if (uid) {
        selectedItems.push(uid)
      }
    })
    // console.log('!', selectedItems)
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

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, windowPath } = state

  const { computeDialect } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeDialect,
    splitWindowPath,
  }
}

export default connect(mapStateToProps, null)(FormPhraseBooks)
