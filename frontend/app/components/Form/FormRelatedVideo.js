import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
// import Select from 'components/Form/Common/Select`'
import File from 'components/Form/Common/File'
import Checkbox from 'components/Form/Common/Checkbox'
import FormContributors from 'components/Form/FormContributors'
import FormRecorders from 'components/Form/FormRecorders'
import FormMoveButtons from 'components/Form/FormMoveButtons'
import FormRemoveButton from 'components/Form/FormRemoveButton'

import ProviderHelpers from 'common/ProviderHelpers'
import Preview from 'components/Preview'
// see about dropping:
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createVideo } from 'reducers/fvVideo'
import FVLabel from 'components/FVLabel'

const { array, func, object, number, string, element } = PropTypes
export class FormRelatedVideo extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  // STATE_EDIT = 4
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
    textBtnCreateItem: string,
    // textBtnEditItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    // handleClickEditItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    handleItemSelected: func,
    componentState: number,
    value: string,
    DISABLED_SORT_COLS: array,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    DIALECT_PATH: string.isRequired,
    selectMediaComponent: element.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    computeDialectFromParent: object.isRequired,
    // REDUX: reducers/state
    computeVideo: object.isRequired,
    // REDUX: actions/dispatch/func
    createVideo: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedVideo',
    groupName: 'FormRelatedVideo__group',
    id: -1,
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    // handleClickEditItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    selectMediaComponent: null,
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

  //   AFTER SUBMITTING NEW CONTRIBUTOR
  // ProviderHelpers.getEntry(nextProps.computeContributor, this.state.contributorPath).response

  render() {
    const {
      className,
      // name,
      id,
      // idDescribedbyItemBrowse,
      idDescribedByItemMove,
      index,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      // textBtnEditItem,
      textBtnSelectExistingItems,
      // textLabelItemSearch,
      textLegendItem,
      // handleClickSelectItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
      // value,
    } = this.props

    let componentContent = null
    const computeCreate = ProviderHelpers.getEntry(this.props.computeVideo, this.state.pathOrId)
    const isFetching = selectn('isFetching', computeCreate)
    const isSuccess = selectn('success', computeCreate)
    // let createdUid = null
    // let createdTitle = null
    // let createdPath = null
    // if (isSuccess) {
    //   createdUid = selectn(['response', 'uid'], computeCreate)
    //   createdTitle = selectn(['response', 'title'], computeCreate)
    //   createdPath = selectn(['response', 'path'], computeCreate)
    // }
    const _handleItemSelectedOrCreated = (selected) => {
      this.props.handleItemSelected(selected, () => {
        handleClickRemoveItem(id)
      })
    }

    if (isSuccess) {
      // Note: deletes the in-progress/newly added item and inserts the just created item
      _handleItemSelectedOrCreated(selectn('response', computeCreate))
    }

    switch (this.state.componentState) {
      case this.STATE_CREATE: {
        let formStatus = null
        if (isFetching) {
          formStatus = (
            <div className="alert alert-info">
              <FVLabel
                transKey="views.components.editor.uploading_message"
                defaultStr="Uploading... Please be patient..."
                transform="first"
              />
            </div>
          )
        }

        // CREATE AUDIO ------------------------------------
        componentContent = (
          <div>
            <h2>Create new video</h2>
            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewName`}
              labelText="Name of video"
              name="FormRelatedVideo.name"
              value=""
              handleChange={(data) => {
                this.setState({ createItemName: data })
              }}
            />
            {/* Description --------------- */}
            <Textarea
              className={this.props.groupName}
              id="CreateVideo__Description"
              labelText="Description of video"
              name="FormRelatedVideo.dc:description"
              value=""
              handleChange={(data) => {
                this.setState({ createItemDescription: data })
              }}
            />

            {/* File --------------- */}
            <File
              className={this.props.groupName}
              id="CreateVideo__File"
              labelText="Upload video"
              name="FormRelatedVideo.file"
              value=""
              handleChange={(data) => {
                this.setState({ createItemFile: data })
              }}
            />

            {/* Shared --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateVideo__Shared"
              labelText="Share this video across dialects"
              name="FormRelatedVideo.fvm:shared"
              handleChange={(data) => {
                this.setState({ createItemIsShared: data })
              }}
            />
            {/* Child focused --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateVideo__ChildFocused"
              labelText="Video is child focused"
              name="FormRelatedVideo.fvm:child_focused"
              handleChange={(data) => {
                this.setState({ createItemIsChildFocused: data })
              }}
            />

            {/* Contributors: fvm:source --------------- */}
            <FormContributors
              className={this.props.groupName}
              name="FormRelatedVideo.fv:source"
              textInfo="Contributors who helped create the video."
              handleItemsUpdate={(data) => {
                this.setState({ createItemContributors: data })
              }}
            />

            {/* Recorders: fvm:recorder --------------- */}
            <FormRecorders
              className={this.props.groupName}
              name="FormRelatedVideo.fvm:recorder"
              textInfo="Recorders who helped create the video."
              handleItemsUpdate={(data) => {
                this.setState({ createItemRecorders: data })
              }}
            />

            {/* BTN: Create contributor ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              Create new video
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_DEFAULT,
                })
              }}
            >
              {"Cancel, don't create new video"}
            </button>
            {formStatus}
          </div>
        )
        break
      }
      case this.STATE_CREATED: {
        componentContent = (
          <div className="Form__sidebar">
            <div className="Form__main">
              <Preview id={id} type="FVVideo" />
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
        )
        break
      }
      // case this.STATE_EDIT:
      //   // EDITING A CONTRIBUTOR ------------------------------------
      //   componentContent = (
      //     <div>
      //       <h2>Editing contributor</h2>

      //       {/* Name ------------- */}
      //       <Text
      //         className={this.props.groupName}
      //         id={`${className}__Contributor${index}__EditName`}
      //         labelText="Related Video name"
      //         name={`${name}[${index}]__EditName`}
      //         value="[some prefilled value]"
      //       />

      //       {/* Description ------------- */}
      //       <Textarea
      //         className={this.props.groupName}
      //         id={`${className}__Contributor${index}__EditDescription`}
      //         labelText="Related Video description"
      //         name={`${name}[${index}]__EditDescription`}
      //         value=""
      //       />

      //       {/* BTN: Create contributor ------------- */}
      //       <button
      //         type="button"
      //         onClick={(event) => {
      //           event.preventDefault()
      //           this._handleCreateItemSubmit()
      //         }}
      //       >
      //         Update contributor
      //       </button>

      //       {/* BTN: Cancel, go back ------------- */}
      //       <button
      //         type="button"
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_CREATED,
      //           })
      //         }}
      //       >
      //         {"Cancel, don't update contributor"}
      //       </button>
      //     </div>
      //   )
      //   break
      // case this.STATE_BROWSE: {
      //   // TODO: REMOVE? USING OLD MODAL CODE INSTEAD
      //   // Select from existing audio  ------------------------------------

      //   const { computeResourcesFromParent } = this.props
      //   const _computeResources = ProviderHelpers.getEntry(computeResourcesFromParent, '/FV/Workspaces/')
      //   const items =
      //     selectn('response.entries', _computeResources) || selectn('response_prev.entries', _computeResources) || []
      //   let audioExisting = []

      //   audioExisting = items.map((_element, i) => {
      //     const uid = _element.uid
      //     const audioId = `related_audio_${uid}`
      //     return (
      //       <div className={`${className}__browseItem`} key={i}>
      //         <div className={`${className}__browseItemGroup1`}>
      //           <input
      //             className={`${className}__browseItemRadio`}
      //             type="radio"
      //             id={audioId}
      //             name="related_audio"
      //             value={uid}
      //           />
      //         </div>
      //         <div className={`${className}__browseItemGroup2`}>
      //           <label htmlFor={audioId}>{`Select '${_element.title}'`}</label>
      //           <audio src={selectn('properties.file:content.data', _element)} preload="none" controls />
      //         </div>
      //       </div>
      //     )
      //   })

      //   componentContent = (
      //     <div>
      //       <div
      //         onChange={(event) => {
      //           this.setState({
      //             relatedAudioUid: event.target.value,
      //           })
      //         }}
      //       >
      //         {audioExisting}
      //       </div>

      //       {/* Save/select contributor ------------- */}
      //       <button
      //         type="button"
      //         disabled={this.state.relatedAudioUid === undefined}
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_CREATED,
      //             audioUid: this.state.relatedAudioUid,
      //           })
      //         }}
      //       >
      //         Add selected Related Video
      //       </button>

      //       {/* BTN: Cancel, go back ------------- */}
      //       <button
      //         type="button"
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_DEFAULT,
      //           })
      //         }}
      //       >
      //         {"Cancel, don't add Related Video"}
      //       </button>
      //     </div>
      //   )
      //   break
      // }
      default: {
        // INITIAL STATE ------------------------------------
        const { computeDialectFromParent, selectMediaComponent } = this.props
        const SelectMediaComponent = selectMediaComponent
        componentContent = (
          <div className="Form__sidebar">
            <div className="Form__main">
              {/* Create contributor */}
              <button
                type="button"
                onClick={() => {
                  this._handleClickCreateItem()
                }}
              >
                {textBtnCreateItem}
              </button>

              {/* Browse/select contributor */}
              {/* <button
              aria-describedby={idDescribedbyItemBrowse}
              onClick={() => {
                this._handleClickSelectItem()
              }}
              type="button"
            >
              {textBtnSelectExistingItems}
            </button> */}

              <SelectMediaComponent
                type={'FVVideo'}
                label={textBtnSelectExistingItems}
                onComplete={_handleItemSelectedOrCreated}
                dialect={selectn('response', computeDialectFromParent)}
              />
            </div>
            <div className="FormItemButtons">
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
          </div>
        )
      }
    }
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>
        {componentContent}
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
  // _handleClickEditItem = (id) => {
  //   const { handleClickEditItem } = this.props
  //   this.setState(
  //     {
  //       componentState: this.STATE_EDIT,
  //     },
  //     () => {
  //       handleClickEditItem(id)
  //     }
  //   )
  // }
  _handleSubmitExistingItem = (createItemUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED,
        contributorUid: createItemUid,
      },
      () => {}
    )
  }

  async _handleCreateItemSubmit() {
    const {
      createItemName,
      createItemDescription,
      createItemFile,
      createItemIsShared,
      createItemIsChildFocused,
      createItemContributors,
      createItemRecorders,
    } = this.state

    const docParams = {
      type: 'FVVideo',
      name: createItemName,
      properties: {
        'dc:title': createItemName,
        'dc:description': createItemDescription,
        'fvm:shared': createItemIsShared,
        'fvm:child_focused': createItemIsChildFocused,
        'fvm:recorder': createItemRecorders['fvm:recorder'] || [],
        'fvm:source': createItemContributors['fvm:source'] || [],
      },
    }

    const timestamp = Date.now()
    const { DIALECT_PATH } = this.props
    this.props.createVideo(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    this.setState({ pathOrId })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvVideo } = state

  const { computeVideo } = fvVideo

  return {
    computeVideo,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createVideo,
}

export default connect(mapStateToProps, mapDispatchToProps)(FormRelatedVideo)
