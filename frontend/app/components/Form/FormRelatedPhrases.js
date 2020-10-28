import React from 'react'
import PropTypes from 'prop-types'
// import Text from 'components/Form/Common/Text'

// NOTE: importing the non-wrapped provide() version
import FormRelatedPhrase from 'components/Form/FormRelatedPhrase'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from 'components/Form/FormInteractions'
import ProviderHelpers from 'common/ProviderHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createContributor, fetchContributors } from 'reducers/fvContributor'
import { fetchDialect } from 'reducers/fvDialect'
import { fetchResources } from 'reducers/fvResources'

import selectn from 'selectn'

const { string, array, object, func, number } = PropTypes
let BrowseComponent = null

export class FormRelatedPhrases extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2

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
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeContributors: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    fetchResources: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhrases',
    idDescribedbyItemBrowse: 'describedbyRelatedAudioBrowse',
    idDescribedByItemMove: 'describedByRelatedAudioMove',
    name: 'FormRelatedPhrases',
    textDescribedbyItemBrowse: 'Select a Related Phrase from previously created Phrases',
    textDescribedByItemMove: `If you are adding multiple Related Phrases, you can change the position of the Phrase with
    the 'Move Related Phrase up' and 'Move Related Phrase down' buttons`,
    textLegendItems: 'Related Phrase',
    textBtnAddItem: 'Create new Related Phrase',
    textLegendItem: 'Related Phrase',
    textBtnRemoveItem: 'Remove Related Phrase',
    textBtnMoveItemUp: 'Move Related Phrase left',
    textBtnMoveItemDown: 'Move Related Phrase right',
    textBtnCreateItem: 'Create new Phrase',
    textBtnSelectExistingItems: 'Select from existing phrases',
    textLabelItemSearch: 'Search existing phrases',
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
  }

  state = {
    items: [],
    componentState: this.STATE_LOADING,
    FormRelatedPhraseCreateNew: null,
  }

  buttonCreate = React.createRef()

  // Fetch data on initial render
  async componentDidMount() {
    const { computeDialect, splitWindowPath } = this.props

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
    this.CONTRIBUTOR_PATH = `${this.DIALECT_PATH}/Contributors`
    // Get data for computeDialect
    if (!computeDialect.success) {
      await this.props.fetchDialect('/' + this.DIALECT_PATH)
    }

    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_TYPE, DEFAULT_SORT_COL } = this.props
    let currentAppliedFilter = '' // eslint-disable-line
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }
    // Get contrinbutors
    await this.props.fetchContributors(
      this.CONTRIBUTOR_PATH,
      `${currentAppliedFilter}&currentPageIndex=${DEFAULT_PAGE -
        1}&pageSize=${DEFAULT_PAGE_SIZE}&sortOrder=${DEFAULT_SORT_TYPE}&sortBy=${DEFAULT_SORT_COL}`
    )

    // Get existing phrases
    // TODO: hardcoded current page and page size!
    await this.props.fetchResources(
      '/FV/Workspaces/',
      `AND ecm:primaryType LIKE 'FVPhrase' AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 AND ecm:currentLifeCycleState != 'Disabled' AND (ecm:path STARTSWITH '${
        this.DIALECT_PATH
      }/Resources/')&currentPageIndex=${0}&pageSize=${1000}`
    )

    const _BrowseComponent = await import('components/BrowseComponent')
    BrowseComponent = _BrowseComponent.default

    this.setState({ componentState: this.STATE_DEFAULT })
  }

  render() {
    const {
      className,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textDescribedbyItemBrowse,
      textDescribedByItemMove,
      textLegendItems,
      textBtnAddItem,
    } = this.props
    const { items, FormRelatedPhraseCreateNew, loading, componentState } = this.state
    const { computeDialect, textBtnSelectExistingItems } = this.props
    return (
      <fieldset className={className}>
        <legend>{textLegendItems}</legend>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            this.handleClickCreateItem()
          }}
          ref={this.buttonCreate}
        >
          {textBtnAddItem}
        </button>

        {computeDialect && BrowseComponent && (
          <BrowseComponent
            disabled={false}
            type={'FVPhrase'}
            label={textBtnSelectExistingItems}
            onComplete={(selected, callback) => {
              this.handleItemSelected(selected)
              if (typeof callback === 'function') {
                callback()
              }
            }}
            dialect={selectn('response', computeDialect)}
          />
        )}

        {componentState === this.STATE_CREATE && FormRelatedPhraseCreateNew && (
          <FormRelatedPhraseCreateNew
            handleCancel={() => {
              this.setState(
                {
                  componentState: this.STATE_DEFAULT,
                },
                () => {
                  this.buttonCreate.current.focus()
                }
              )
            }}
            refPhrase={(element) => (this.phrase = element)}
          />
        )}

        {/* COLLECTION OF PHRASES --------------- */}
        {items}
        {/* CREATES THE HIDDEN INPUT REPRESENTING THE ITEMS ---------------
        <input type="hidden" name="fv-word:related_phrases" value="['phrase-id-1','phrase-id-2']" />
         */}
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
  _generateHiddenInput = () => {
    const { items } = this.state
    const selectedItems = items.map((element) => {
      return element.props.id
    })
    return <input type="hidden" name="fv-word:related_phrases" value={JSON.stringify(selectedItems)} />
  }

  handleClickCreateItem = async () => {
    const _FormRelatedPhraseCreateNew = await import('components/Form/FormRelatedPhraseCreateNew')
    this.setState(
      {
        FormRelatedPhraseCreateNew: _FormRelatedPhraseCreateNew.default,
        componentState: this.STATE_CREATE,
      },
      () => {
        this.phrase.focus()
      }
    )
  }
  handleItemSelected = (selected) => {
    const uid = selectn('uid', selected)

    let { items } = this.state
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
      DIALECT_PATH: this.DIALECT_PATH,
    }

    this.setState({
      items: [...items, <FormRelatedPhrase componentState={3} key={uid} id={uid} {..._props} />],
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

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, fvDialect, windowPath } = state

  const { computeContributor, computeContributors, computeCreateContributor } = fvContributor
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeContributor,
    computeContributors,
    computeCreateContributor,
    computeDialect,
    computeDialect2,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  fetchContributors,
  fetchDialect,
  fetchResources,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormRelatedPhrases)
