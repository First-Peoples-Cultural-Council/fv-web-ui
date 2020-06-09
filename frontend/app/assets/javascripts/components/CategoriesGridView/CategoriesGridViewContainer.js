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
import CategoriesGridViewData from './CategoriesGridViewData'
import CategoriesGridViewPresentation from './CategoriesGridViewPresentation'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
/**
 * @summary CategoriesGridViewContainer
 * @component
 * @version 1.0.1
 */
function CategoriesGridViewContainer() {
  // Render
  // ----------------------------------------
  return (
    <CategoriesGridViewData>
      {({ categories, computeEntities, onClickTile }) => {
        return (
          <PromiseWrapper renderOnError computeEntities={computeEntities}>
            <CategoriesGridViewPresentation categories={categories} onClickTile={onClickTile} />
          </PromiseWrapper>
        )
      }}
    </CategoriesGridViewData>
  )
}

export default CategoriesGridViewContainer
