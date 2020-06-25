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
import React from 'react'
import PropTypes from 'prop-types'
import Pagination from 'components/Pagination'
import KidsPhrasesByPhrasebookData from 'components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookData'
import PhraseBooksGrid from 'components/PhraseBooksGrid'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

/**
 * @summary KidsPhrasesByPhrasebookContainer
 * @description Note: no corresponding KidsPhrasesByPhrasebookPresentation component
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function KidsPhrasesByPhrasebookContainer() {
  return (
    <KidsPhrasesByPhrasebookData>
      {({ computeEntities, items, hasItems, onPaginationUpdate, page, pageSize, resultsCount }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <div className="row" style={{ marginTop: '15px' }}>
              <div className="col-xs-12 col-md-8 col-md-offset-2">
                {resultsCount && (
                  <Pagination.Container
                    pageSize={pageSize}
                    page={page}
                    resultsCount={resultsCount}
                    onPaginationUpdate={(pagePageSize) => {
                      onPaginationUpdate(pagePageSize)
                    }}
                  >
                    {hasItems ? <PhraseBooksGrid.Presentation categories={items} /> : <div>No results</div>}
                  </Pagination.Container>
                )}
              </div>
            </div>
          </PromiseWrapper>
        )
      }}
    </KidsPhrasesByPhrasebookData>
  )
}

// PROPTYPES
// -------------------------------------------
const { array } = PropTypes
KidsPhrasesByPhrasebookContainer.propTypes = {
  items: array,
}
KidsPhrasesByPhrasebookContainer.defaultProps = {
  items: [],
}

export default KidsPhrasesByPhrasebookContainer
