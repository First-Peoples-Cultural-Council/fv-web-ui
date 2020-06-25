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
import React from 'react'
import PhraseBooksGridData from './PhraseBooksGridData'
import PhraseBooksGridPresentation from './PhraseBooksGridPresentation'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
/**
 * @summary PhraseBooksGridContainer
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function PhraseBooksGridContainer() {
  // Render
  // ----------------------------------------
  return (
    <PhraseBooksGridData>
      {({ categories, computeEntities, onClickTile }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            {categories && categories.length > 0 ? (
              <PhraseBooksGridPresentation categories={categories} onClickTile={onClickTile} />
            ) : (
              <div>No results</div>
            )}
          </PromiseWrapper>
        )
      }}
    </PhraseBooksGridData>
  )
}

export default PhraseBooksGridContainer
