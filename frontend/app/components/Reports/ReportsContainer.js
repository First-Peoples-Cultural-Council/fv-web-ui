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
import React from 'react'

import ReportsData from 'components/Reports/ReportsData'
import ReportsPresentation from 'components/Reports/ReportsPresentation'

function ReportsContainer() {
  return (
    <ReportsData>
      {({ computeEntities, reportFilter, routeParams, pushWindowPath }) => {
        return (
          <ReportsPresentation
            computeEntities={computeEntities}
            reportFilter={reportFilter}
            routeParams={routeParams}
            pushWindowPath={pushWindowPath}
          />
        )
      }}
    </ReportsData>
  )
}

export default ReportsContainer
