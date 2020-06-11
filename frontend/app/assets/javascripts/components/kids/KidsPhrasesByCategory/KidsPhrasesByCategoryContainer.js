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
import KidsPhrasesByCategoryData from 'components/kids/KidsPhrasesByCategory/KidsPhrasesByCategoryData'
import CategoriesGridView from 'components/CategoriesGridView'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// KidsPhrasesByCategoryContainer
// ====================================================
function KidsPhrasesByCategoryContainer() {
  return (
    <KidsPhrasesByCategoryData>
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
                    {hasItems ? <CategoriesGridView.Presentation categories={items} /> : <div>No results</div>}
                  </Pagination.Container>
                )}
              </div>
            </div>
          </PromiseWrapper>
        )
      }}
    </KidsPhrasesByCategoryData>
  )
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
