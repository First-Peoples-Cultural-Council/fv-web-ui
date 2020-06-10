/* Copyright 2016 First People's Cultural Council

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

// 3rd party
// -------------------------------------------
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import selectn from 'selectn'

// FPCC
// -------------------------------------------
import Pagination from 'components/Pagination'
import KidsPhrasesByCategoryData from 'components/kids/KidsPhrasesByCategory/KidsPhrasesByCategoryData'
// import KidsPhrasesByCategoryPresentation from 'components/kids/KidsPhrasesByCategory/KidsPhrasesByCategoryPresentation'
// import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// KidsPhrasesByCategoryContainer
// ====================================================
export class KidsPhrasesByCategoryContainer extends Component {
  render() {
    return (
      <KidsPhrasesByCategoryData>{({computeEntities, filterInfo, items, resultsCount})=>{
        console.log('KidsPhrasesByCategoryData Liminal', {filterInfo, items, resultsCount})
        // const phraseListView = dialectUid ? (
        //   <PhraseListView
        //     DEFAULT_PAGE_SIZE={8}
        //     disablePageSize
        //     filter={filterInfo.setIn(['currentAppliedFilter', 'kids'], ' AND fv:available_in_childrens_archive=1')}
        //     gridListView
        //     gridCols={2}
        //     controlViaURL
        //     DEFAULT_PAGE={DEFAULT_PAGE}
        //     DEFAULT_SORT_COL={DEFAULT_SORT_COL}
        //     DEFAULT_SORT_TYPE={DEFAULT_SORT_TYPE}
        //     disableClickItem={false}
        //     // flashcardTitle={pageTitle}
        //     // TODO
        //     onPagePropertiesChange={this._handlePagePropertiesChange} // NOTE: This function is in PageDialectLearnBase
        //     parentID={selectn('response.uid', computeDocument)}
        //     dialectID={dialectUid}
        //     routeParams={this.props.routeParams}
        //     // Search:
        //     handleSearch={this.changeFilter}
        //     resetSearch={this.resetSearch}
        //     hasSearch
        //     searchUi={[
        //       {
        //         defaultChecked: true,
        //         idName: 'searchByTitle',
        //         labelText: 'Phrase',
        //       },
        //       {
        //         defaultChecked: true,
        //         idName: 'searchByDefinitions',
        //         labelText: 'Definitions',
        //       },
        //       {
        //         idName: 'searchByCulturalNotes',
        //         labelText: 'Cultural notes',
        //       },
        //     ]}
        //     searchByMode={searchByMode}
        //     // TODO
        //     rowClickHandler={this.props.rowClickHandler}
        //     // TODO
        //     hasSorting={this.props.hasSorting}
        //     dictionaryListClickHandlerViewMode={this.props.setListViewMode}
        //     dictionaryListViewMode={this.props.listView.mode}
        //   />
        // ) : null
        const phraseListView = <div>TEMP: phraseListView</div>
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <div className="row" style={{ marginTop: '15px' }}>
              <div className="col-xs-12 col-md-8 col-md-offset-2">{(items || []).map((item, index)=>{
                return <div key={`item${index}`}>An item</div>
              })}</div>
              <div className="col-xs-12 col-md-8 col-md-offset-2">
                <Pagination.Container
                  initialPageSize={10}
                  initialPage={1}
                  resultsCount={resultsCount}
                  onUpdate={({page, pageSize})=>{console.log('onUpdate', {page, pageSize})}}>
                  <div>test</div>
                </Pagination.Container>
              </div>
            </div>
          </PromiseWrapper>
        )
      }}
      </KidsPhrasesByCategoryData>
    )
  }
  // END render
}

// PROPTYPES
// -------------------------------------------
const { array } = PropTypes
KidsPhrasesByCategoryContainer.propTypes = {
  items: array,
}
KidsPhrasesByCategoryContainer.defaultProps = {
  items: [],
}

export default KidsPhrasesByCategoryContainer
