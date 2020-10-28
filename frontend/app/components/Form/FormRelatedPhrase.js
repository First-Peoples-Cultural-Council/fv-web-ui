import React from 'react'
import PropTypes from 'prop-types'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'

// import ProviderHelpers from 'common/ProviderHelpers'
import Preview from 'components/Preview'

// REDUX
import { connect } from 'react-redux'

import ProviderHelpers from 'common/ProviderHelpers'

const { array, func, number, string } = PropTypes

export class FormRelatedPhrase extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  STATE_BROWSE = 5

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: string,
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
    // REDUX: reducers/state
    splitWindowPath: array.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhrase',
    groupName: 'FormRelatedPhrase__group',
    id: '_0',
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
    // browseComponent: null,
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
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { windowPath } = state

  const { splitWindowPath } = windowPath

  return {
    splitWindowPath,
  }
}

export default connect(mapStateToProps, null)(FormRelatedPhrase)
