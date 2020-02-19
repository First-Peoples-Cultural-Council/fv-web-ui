/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDocuments } from 'providers/redux/reducers/search'
import Edit from '@material-ui/icons/Edit'
import selectn from 'selectn'

import t from 'tcomb-form'

import fields from 'models/schemas/filter-fields'
import options from 'models/schemas/filter-options'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import Link from 'views/components/Link'
import StringHelpers, { CLEAN_FULLTEXT } from 'common/StringHelpers'
import FormHelpers from 'common/FormHelpers'
import AnalyticsHelpers from 'common/AnalyticsHelpers'

// import SearchResultTile from './tile'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
// import DocumentListView from 'views/components/Document/DocumentListView'
import { getListSmallScreen } from 'views/components/Browsing/DictionaryList'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import { SECTIONS, WORKSPACES } from 'common/Constants'
import UIHelpers from 'common/UIHelpers'
import FVButton from 'views/components/FVButton'
import '!style-loader!css-loader!./Search.css'

const FiltersWithToggle = withToggle()
const intl = IntlService.instance

const { array, bool, func, number, object, string } = PropTypes
export class Search extends DataListView {
  static propTypes = {
    action: func,
    data: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    DISABLED_SORT_COLS: array,
    filter: object,
    gridListView: bool,
    routeParams: object.isRequired,

    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeSearchDocuments: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    searchDocuments: func.isRequired,
  }
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'fv-word:categories', 'related_audio', 'related_pictures'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_TYPE: 'asc',
    dialect: null,
    filter: new Map(),
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    this.formSearch = React.createRef()

    this.state = {
      pageInfo: {
        page: selectn('routeParams.page', props) || props.DEFAULT_PAGE,
        pageSize: selectn('routeParams.pageSize', props) || props.DEFAULT_PAGE_SIZE,
      },
      formValue: {
        searchTerm: props.routeParams.searchTerm,
        documentTypes: ['FVWord', 'FVPhrase', 'FVBook', 'FVPortal'],
      },
      defaultFormValue: { searchTerm: '', documentTypes: ['FVWord', 'FVPhrase', 'FVBook', 'FVPortal'] },
      preparedFilters: null,
    }

    this.state.queryParam = this._computeQueryParam()
    this.state.queryPath = this._getQueryPath()

    // Bind methods to 'this'
    ;[
      '_handleRefetch',
      '_onSearchSaveForm',
      '_computeQueryParam',
      '_getQueryPath',
      '_onEntryNavigateRequest',
      '_onReset',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps = this.props) {
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  async _fetchListViewData(
    props = this.props,
    pageIndex,
    pageSize,
    sortOrder,
    sortBy,
    formValue = this.state.formValue
  ) {
    if (props.routeParams.searchTerm && props.routeParams.searchTerm !== '') {
      const documentTypeFilter = "'" + (formValue.documentTypes || []).join("','") + "'"

      await props.searchDocuments(
        this._getQueryPath(props),
        `${
          props.routeParams.area === SECTIONS ? ' AND ecm:isLatestVersion = 1' : ' '
        } AND ecm:primaryType IN (${documentTypeFilter}) AND ecm:fulltext LIKE '${StringHelpers.clean(
          props.routeParams.searchTerm,
          CLEAN_FULLTEXT
          // More specific:
          // ` AND (ecm:fulltext_description = '${props.routeParams.searchTerm}' OR ecm:fulltext_title = '${props.routeParams.searchTerm}'`
        )}'&currentPageIndex=${pageIndex - 1}&pageSize=${pageSize}&sortBy=ecm:fulltextScore`
      )

      // Update url
      const href = `${NavigationHelpers.getContextPath()}/explore${this._getQueryPath()}/search/${
        this.props.routeParams.searchTerm
      }/${pageSize}/${pageIndex}`
      NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
    }
  }

  _onSearchSaveForm(e) {
    // Prevent default behaviour
    if (e) {
      e.preventDefault()
    }

    const form = this.formSearch.current
    const properties = FormHelpers.getProperties(form)

    if (Object.keys(properties).length !== 0) {
      this.setState(
        {
          formValue: properties,
          pageInfo: {
            page: 1,
            pageSize: this.state.pageInfo.pageSize,
          },
        },
        () => {
          this._fetchListViewData(
            this.props,
            this.state.pageInfo.page,
            this.state.pageInfo.pageSize,
            this.props.DEFAULT_SORT_TYPE,
            this.props.DEFAULT_SORT_COL,
            properties
          )
        }
      )
    }
  }

  _onEntryNavigateRequest(/*path*/) {
    // this.props.pushWindowPath(`/${this.props.routeParams.siteTheme}${path}`)
  }

  _getQueryPath(props = this.props) {
    return (
      props.routeParams.dialect_path ||
      props.routeParams.language_path ||
      props.routeParams.language_family_path ||
      `/${props.properties.domain}/${props.routeParams.area || SECTIONS}/Data`
    )
  }

  _computeQueryParam() {
    const lastPathSegment = this.props.splitWindowPath[this.props.splitWindowPath.length - 1]

    let queryParam = ''
    if (lastPathSegment !== 'search') {
      queryParam = lastPathSegment
    }

    return queryParam
  }

  _onReset() {
    // Reset all controlled inputs
    const inputs = selectn('refs.input.refs', this.formSearch.current)

    for (const inputKey in inputs) {
      if (typeof inputs[inputKey].reset === 'function') {
        inputs[inputKey].reset()
      }
    }

    this.setState(
      {
        formValue: this.state.defaultFormValue || null,
        pageInfo: {
          page: 1,
          pageSize: this.state.pageInfo.pageSize,
        },
      },
      () => {
        this._fetchListViewData(
          this.props,
          this.state.pageInfo.page,
          this.state.pageInfo.pageSize,
          this.props.DEFAULT_SORT_TYPE,
          this.props.DEFAULT_SORT_COL
        )
      }
    )
  }

  componentDidUpdate(prevProps) {
    const computeSearchDocuments = ProviderHelpers.getEntry(this.props.computeSearchDocuments, this._getQueryPath())

    if (selectn('response.totalSize', computeSearchDocuments) !== undefined) {
      // Track search event
      AnalyticsHelpers.trackSiteSearch({
        keyword: this.props.routeParams.searchTerm,
        category: false,
        results: selectn('response.totalSize', computeSearchDocuments),
      })
    }

    // if search came from nav bar
    if (prevProps.windowPath !== this.props.windowPath) {
      this.setState(
        {
          pageInfo: {
            page: this.state.pageInfo.page,
            pageSize: this.state.pageInfo.pageSize,
          },
        },
        () => {
          this._fetchListViewData(
            this.props,
            this.state.pageInfo.page,
            this.state.pageInfo.pageSize,
            this.props.DEFAULT_SORT_TYPE,
            this.props.DEFAULT_SORT_COL
          )
        }
      )
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getQueryPath(),
        entity: this.props.computeSearchDocuments,
      },
    ])

    const computeSearchDocuments = ProviderHelpers.getEntry(this.props.computeSearchDocuments, this._getQueryPath())
    // const _onEntryNavigateRequest = this._onEntryNavigateRequest
    // const searchTerm = this.props.routeParams.searchTerm
    // const SearchResultTileWithProps = React.Component({
    //   // Note: don't switch the render fn to a fat arrow, eg:
    //   // render: () => {
    //   // It breaks the search results display
    //   render: function SearchResultTileWithPropsRender() {
    //     return React.createElement(SearchResultTile, {
    //       searchTerm: searchTerm,
    //       action: _onEntryNavigateRequest,
    //       ...this.props,
    //     })
    //   },
    // })

    return (
      <div className="Search">
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3', 'PrintHide')}>
            <div className="col-xs-12">
              <form onSubmit={this._onSearchSaveForm}>
                <FiltersWithToggle
                  label={intl.trans('views.pages.search.filter_items', 'Filter items', 'first')}
                  mobileOnly
                >
                  <div className="fontAboriginalSans">
                    <t.form.Form
                      ref={this.formSearch}
                      value={Object.assign({}, this.state.formValue, { searchTerm: this.props.routeParams.searchTerm })}
                      type={t.struct(selectn('Search', fields))}
                      options={selectn('Search', options)}
                    />
                  </div>
                  <div className="Search__btnGroup">
                    <button
                      type="button"
                      className="Search__btn RaisedButton RaisedButton--primary"
                      onClick={this._onReset}
                    >
                      {intl.trans('reset', 'Reset', 'first')}
                    </button>
                    <button type="submit" className="Search__btn RaisedButton RaisedButton--primary">
                      {intl.trans('search', 'Search', 'first')}
                    </button>
                  </div>
                </FiltersWithToggle>
              </form>
            </div>
          </div>
          <div className={classNames('search-results', 'col-xs-12', 'col-md-9')}>
            <h1>
              {intl.trans('search_results', 'Search results', 'first')} -{' '}
              <span className="fontAboriginalSans">{this.props.routeParams.searchTerm}</span>
            </h1>

            <PromiseWrapper renderOnError computeEntities={computeEntities}>
              {(() => {
                const entries = selectn('response.entries', computeSearchDocuments)
                if (entries) {
                  if (entries.length === 0) {
                    const suggestDocumentTypes =
                      this.state.formValue.documentTypes === undefined ? (
                        <div className="alert alert-info">
                          <span>
                            {
                              "Tip: Try searching again with a selected 'Document type'. Click the '+ ADD NEW' button if there are none displayed."
                            }
                          </span>
                        </div>
                      ) : null
                    return (
                      <div>
                        <p>Sorry, no results were found for this search.</p>
                        {suggestDocumentTypes}
                      </div>
                    )
                  }

                  // entries.forEach((entry) => {
                  //   console.log(entry)
                  //   // fv-portal:about: "<p><span class="regular">The <b>Dene Sų́łiné</b> of <b>Łue Chok Tué</b> occupy the territory around present-day Cold Lake, Alberta in the northeast of the province close to the Saskatchewan border. They are the only Dene community who are signatory to Treaty Six and are somewhat isolated from other Dene. Their closest Dene neighbors are situated at Ejerésche or Dillon, Saskatchewan and K’ái K'oz Desé or Janvier, Alberta, both of which are approximately 5 hours away by motor vehicle.<br /><br />The Dene of Łue Chok Tué were traditionally a nomadic people who lived off the land by hunting and gathering. Wetlands, prairie and boreal forest made up their homelands in this eco-region and was indeed plentiful in food. During the fur-trade era, they trapped in and around Xah Tué (Primrose Lake) and Łue Chok Tué (Cold Lake) where there was an abundance in fur-bearing animals such as beaver &amp; muskrat. However things would soon change.<br /><br />In 1952, life changed drastically for the people of Łue Chok Tué. The Canadian government took over their traditional lands to set aside for military purposes. Today there are annual military flight exercises known as Maple Flag which brings military personnel from around the world to train over those traditional Dene homelands. The Dene were forced to become sedentary and assume a new lifestyle with the loss of their traditional territory. In recent years, a booming oil and gas industry in the area, much of which takes place in that traditional territory, provides employment and business opportunities for the people of Cold Lake First Nations.<br /><br /><b>Acknowledgements</b><br /><br />I would like to take this opportunity to acknowledge and thank all who have contributed to this Dene language archive. This project builds upon the Dene Language revitalization work that has taken place over the past few years at <b>Cold Lake First Nations</b> through the <b>Daghida Project. </b> The Daghida Project funding made it possible for individuals who were involved in the language work to attend conferences such as the annual Stabilizing Indigenous Languages Symposia where Shirley Cardinal first met Peter Brand &amp; John Elliot in the year 2000. It was the beginning of a relationship which eventually led to the initiation of this project and hopefully will continue for a long time to come as we forge ahead with new developments in technology and language preservation activity.<br /><br />First of all, I would like to acknowledge and thank <b>Peter Brand</b> of FirstVoices. His willingness to share his knowledge and skill demonstrates his commitment to supporting the efforts of First Nations language warriors. Thank you so much for your generosity and especially your patience during the many challenges we faced with our Dene project!<br /><br />I would also like to thank the rest of the staff of FirstVoices who have provided assistance in various capacities: <b>Ivy Shaughnessy</b> for her great sense of humor as well as assisting with the training in Hobbema, her hospitality during our stay in Victoria &amp; email and telephone support; <b>Pauline Edwards</b> for all the assistance both while we were in Victoria and the on-going email &amp; telephone support; <b>Alex Wadsworth</b> for all the technical expertise behind the scenes and <b>Helena Charleson</b> for administrative support. I would also like to take the opportunity to mention that it was indeed a pleasure to meet Tyrone and Deanna of First People's Cultural Foundation at the SILS conference in Buffalo. You are all doing fantastic work, keep it up!!!<br /><br />I would also like to thank everyone from Łue Chok Tué who have contributed to the on-going efforts of language preservation in our community:<br /><br />The language carriers who make time to participate in linguistic fieldwork even when our endless questions don’t seem to make any sense to them especially the following: <b>Ernest Ennow, Nora Matchatis, John Janvier, Alex Janvier, Evangeline Janvier, Lorraine Loth, Lionel Francois, Shirley Cardinal, Marlene Piche, &amp; Dennis Andrew.</b><br /><br />The past and present leadership: <b>Chief Francis Scanie</b> who endorsed our letter of intent in the early stages of the Daghida Project; <b>Chief Joyce Metchewais &amp; Council </b>during the two terms of office for on-going administrative support of the Daghida Project and endorsing this proposed FirstVoices project; and <b>Chief Dwayne Nest &amp; Council</b> for continued administrative support during this project.<br /><br />A special thanks to the Cold Lake First Nations staff who get the job done: <b>Shawna Janvier, Administrator; Maria Keating, Finance; &amp; Tom Piche, Communications.</b> The FCSS staff: <b>Cecilia Machatis &amp; Shirley Grandbois</b> who are always there when needed.<br /><br />To my technical assistant &amp; junior partner in this FirstVoices project, <b>Lucianne Crazyboy.</b> I hope this experience was all you hoped for and more. I’m sure you had no idea what you were getting into.<br /><br />I also want to express my heartfelt gratitude to a wonderful group of ladies who really make a difference. They are my peers, my friends, my ‘sisters’ and they share in the vision of reviving the ways of our ancestors, the language and culture of the Dene people: <b>Angie Grandbois, Maureena Loth, Margaret Martial, Noella Amable, Lynda Janvier, Alma Janvier, Mary Jane Sayazie, Jill Janvier, Gail Muskego, &amp; Tricia Janvier.</b> Thank you for your inspiration and encouragement.<br /><br />A special thank you to my friend, my colleage, my partner <b>Sally Rice</b> without whom there would not have been a Daghida Project. Thank you always for all your expertise, your mentorship, your support and encouragement.<br /><br /><b>Mąsi chok!! Horelyų́ nuhghąnighila! </b></span></p>"
                  // })

                  return (
                    <Suspense fallback={<div>Loading...</div>}>
                      {getListSmallScreen({
                        hasPagination: true,
                        pageSize: 10,
                        dictionaryListSmallScreenProps: {
                          // rowClickHandler: props.rowClickHandler,
                          // hasSorting: props.hasSorting,
                          // // withPagination
                          // // --------------------
                          // appendControls: props.appendControls,
                          // disablePageSize: props.disablePageSize,
                          // fetcher: props.fetcher,
                          // fetcherParams: props.fetcherParams,
                          fetcher: ({ currentPageIndex, pageSize } = {}) => {
                            this.setState(
                              {
                                pageInfo: {
                                  page: currentPageIndex,
                                  pageSize: pageSize,
                                },
                              },
                              () => {
                                this._fetchListViewData(
                                  this.props,
                                  currentPageIndex,
                                  pageSize,
                                  this.props.DEFAULT_SORT_TYPE,
                                  this.props.DEFAULT_SORT_COL
                                )
                              }
                            )
                          },
                          fetcherParams: {
                            currentPageIndex: this.state.pageInfo.page,
                            pageSize: this.state.pageInfo.pageSize,
                          },
                          metadata: selectn('response', computeSearchDocuments),
                          // List: small screen
                          // --------------------
                          items: entries,
                          columns: [
                            {
                              name: 'type',
                              title: 'Type',
                              columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
                              render: (v, data) => {
                                const family = selectn(['contextParameters', 'ancestry', 'family', 'dc:title'], data)
                                const language = selectn(
                                  ['contextParameters', 'ancestry', 'language', 'dc:title'],
                                  data
                                )
                                let itemType
                                switch (data.type) {
                                  case 'FVPhrase':
                                    itemType = `${language} » Phrase`
                                    break
                                  case 'FVWord':
                                    itemType = `${language} » Word`
                                    break
                                  case 'FVBook':
                                    itemType = `${language} » ${data.properties['fvbook:type']}`
                                    break
                                  case 'FVPortal': {
                                    itemType = `${family} » ${language}`
                                    break
                                  }
                                  default:
                                    itemType = '-'
                                }
                                return itemType
                              },
                            },
                            {
                              name: 'title',
                              title: 'Title',
                              columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
                              render: (v, data) => {
                                let alternateContent
                                let href = null
                                let hrefEdit = null
                                const currentTheme = this.props.routeParams.siteTheme
                                if (data.type === 'FVPhrase') {
                                  href = NavigationHelpers.generateUIDPath(currentTheme, data, 'phrases')
                                  hrefEdit = NavigationHelpers.generateUIDEditPath(
                                    this.props.routeParams.siteTheme,
                                    data,
                                    'phrases'
                                  )
                                }
                                if (data.type === 'FVWord') {
                                  href = NavigationHelpers.generateUIDPath(currentTheme, data, 'words')
                                  hrefEdit = NavigationHelpers.generateUIDEditPath(
                                    this.props.routeParams.siteTheme,
                                    data,
                                    'words'
                                  )
                                }
                                if (data.type === 'FVBook') {
                                  let bookType = null
                                  switch (data.properties['fvbook:type']) {
                                    case 'song':
                                      bookType = 'songs'
                                      break
                                    case 'story':
                                      bookType = 'stories'
                                      break

                                    default:
                                      break
                                  }
                                  href = NavigationHelpers.generateUIDPath(currentTheme, data, bookType)
                                  hrefEdit = NavigationHelpers.generateUIDEditPath(
                                    this.props.routeParams.siteTheme,
                                    data,
                                    bookType
                                  )
                                }
                                if (data.type === 'FVPortal') {
                                  // Generate URL
                                  const siteTheme = this.props.routeParams.siteTheme
                                  const area = this.props.routeParams.area
                                  const family = (
                                    selectn(['contextParameters', 'ancestry', 'family', 'dc:title'], data) || ''
                                  ).replace(/\//g, '_')

                                  const language = (
                                    selectn(['contextParameters', 'ancestry', 'language', 'dc:title'], data) || ''
                                  ).replace(/\//g, '_')

                                  const dialect = (
                                    selectn(['contextParameters', 'ancestry', 'dialect', 'dc:title'], data) || ''
                                  ).replace(/\//g, '_')

                                  href = `/${siteTheme}/FV/${area}/Data/${family}/${language}/${dialect}`
                                  // Pull title text from different location with Portal/Dialects
                                  alternateContent = selectn(
                                    ['contextParameters', 'ancestry', 'dialect', 'dc:title'],
                                    data
                                  )
                                }

                                const isWorkspaces = this.props.routeParams.area === WORKSPACES

                                const computeDialect2 = this.props.dialect /* || this.getDialect()*/

                                const editButton =
                                  isWorkspaces && hrefEdit ? (
                                    <AuthorizationFilter
                                      filter={{
                                        entity: selectn('response', computeDialect2),
                                        login: this.props.computeLogin,
                                        role: ['Record', 'Approve', 'Everything'],
                                      }}
                                      hideFromSections
                                      routeParams={this.props.routeParams}
                                    >
                                      <FVButton
                                        type="button"
                                        variant="flat"
                                        size="small"
                                        component="a"
                                        className="PrintHide"
                                        href={hrefEdit}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          NavigationHelpers.navigate(hrefEdit, this.props.pushWindowPath, false)
                                        }}
                                      >
                                        <Edit title={intl.trans('edit', 'Edit', 'first')} />
                                      </FVButton>
                                    </AuthorizationFilter>
                                  ) : null
                                return (
                                  <>
                                    <Link className="DictionaryList__link DictionaryList__link--indigenous" href={href}>
                                      {alternateContent || v}
                                    </Link>
                                    {editButton}
                                  </>
                                )
                              },
                            },
                            {
                              name: 'fv:definitions',
                              title: intl.trans('definitions', 'Definitions', 'first'),
                              columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
                              columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
                              render: (v, data, cellProps) => {
                                return UIHelpers.generateOrderedListFromDataset({
                                  dataSet: selectn(`properties.${cellProps.name}`, data),
                                  extractDatum: (entry, i) => {
                                    if (entry.language === this.props.DEFAULT_LANGUAGE && i < 2) {
                                      return entry.translation
                                    }
                                    return null
                                  },
                                  classNameList: 'DictionaryList__definitionList',
                                  classNameListItem: 'DictionaryList__definitionListItem',
                                })
                              },
                              sortName: 'fv:definitions/0/translation',
                            },
                            {
                              name: 'related_audio',
                              title: intl.trans('audio', 'Audio', 'first'),
                              columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
                              columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomAudio,
                              render: (v, data, cellProps) => {
                                let firstAudio = null
                                if (data.type === 'FVPhrase') {
                                  firstAudio = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
                                }
                                if (data.type === 'FVWord') {
                                  firstAudio = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
                                }

                                if (firstAudio) {
                                  return (
                                    <Preview
                                      minimal
                                      styles={{ padding: 0 }}
                                      tagStyles={{ width: '100%', minWidth: '230px' }}
                                      key={selectn('uid', firstAudio)}
                                      expandedValue={firstAudio}
                                      type="FVAudio"
                                    />
                                  )
                                }
                              },
                            },
                          ],
                          dictionaryListSmallScreenTemplate: ({ templateData }) => {
                            return (
                              <div className="DictionaryListSmallScreen__item">
                                <div className="DictionaryListSmallScreen__groupMain">
                                  <div className="DictionaryListSmallScreen__groupMainMiscellaneous">
                                    <div className="DictionaryListSmallScreen__searchType">{templateData.type}</div>
                                  </div>
                                  <div className="DictionaryListSmallScreen__groupData DictionaryListSmallScreen__groupData--noHorizPad">
                                    {templateData.title}
                                  </div>
                                  {templateData.related_audio && (
                                    <div className="DictionaryListSmallScreen__groupData DictionaryListSmallScreen__groupData--noHorizPad">
                                      {templateData.related_audio}
                                    </div>
                                  )}
                                  {templateData['fv:definitions'] && (
                                    <div className="DictionaryListSmallScreen__groupData">
                                      <h2 className="DictionaryListSmallScreen__definitionsHeading">Definitions</h2>
                                      {templateData['fv:definitions']}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          },
                        },
                      })}
                    </Suspense>
                  )
                }
              })()}
            </PromiseWrapper>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, nuxeo, search, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeSearchDocuments } = search
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeSearchDocuments,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
  searchDocuments,
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
