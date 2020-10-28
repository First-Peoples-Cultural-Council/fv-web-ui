import React from 'react'
import PropTypes from 'prop-types'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'

// import ProviderHelpers from 'common/ProviderHelpers'
import Preview from 'components/Preview'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createCategory } from 'reducers/fvCategory'

import ProviderHelpers from 'common/ProviderHelpers'

const { array, func, object, number, string, element } = PropTypes

export class FormPhraseBook extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  STATE_BROWSE = 5

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: number,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    index: number,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnSelectExistingItems: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    handleItemSelected: func,
    componentState: number,
    value: string,
    browseComponent: element.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    computeDialectFromParent: object.isRequired,
    // REDUX: reducers/state
    computeCategory: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func‘
    createCategory: func.isRequired,
  }
  static defaultProps = {
    className: 'FormPhraseBook',
    groupName: 'FormPhraseBook__group',
    id: -1,
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
    browseComponent: null,
  }

  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
    createItemFile: {},
    createItemIsShared: false,
    createItemIsChildFocused: false,
    createItemContributors: [],
    createItemRecorders: [],
    pathOrId: undefined,
  }

  CONTRIBUTOR_PATH = undefined
  DIALECT_PATH = undefined

  componentDidMount() {
    const { splitWindowPath } = this.props
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
  }

  render() {
    const {
      className,
      id,
      idDescribedByItemMove,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textLegendItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
    } = this.props

    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>

        <div className="Form__sidebar">
          <div className="Form__main">
            <Preview id={this.props.id} type="FVPhrase" />
          </div>
          <div className="FormItemButtons Form__aside">
            <FormRemoveButton
              id={id}
              textBtnRemoveItem={textBtnRemoveItem}
              handleClickRemoveItem={handleClickRemoveItem}
            />
            <FormMoveButtons
              id={id}
              idDescribedByItemMove={idDescribedByItemMove}
              textBtnMoveItemUp={textBtnMoveItemUp}
              textBtnMoveItemDown={textBtnMoveItemDown}
              handleClickMoveItemUp={handleClickMoveItemUp}
              handleClickMoveItemDown={handleClickMoveItemDown}
            />
          </div>
        </div>
      </fieldset>
    )
  }
  _handleClickCreateItem = () => {
    const { handleClickCreateItem } = this.props
    this.setState(
      {
        componentState: this.STATE_CREATE,
      },
      () => {
        handleClickCreateItem()
      }
    )
  }
  _handleSubmitExistingItem = (createItemUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED,
        contributorUid: createItemUid,
      },
      () => {}
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, windowPath } = state

  const { computeCategory } = fvCategory
  const { splitWindowPath } = windowPath

  return {
    computeCategory,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createCategory,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPhraseBook)
