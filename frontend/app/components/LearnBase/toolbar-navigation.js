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

import Link from 'components/Link'
import FVLabel from 'components/FVLabel'

import useRoute from 'dataSources/useRoute'
/**
 * Navigation for learning page
 */

const ToolbarNavigation = () => {
  const { routeParams } = useRoute()
  const dialectPath = routeParams.dialect_path
  return (
    <div className="dialect-navigation">
      <div className="row">
        <div className="col-xs-12 col-md-10">
          <div float="left">
            <Link href={`/explore${dialectPath}/learn/words?page=1&pageSize=10`}>
              <FVLabel transKey="general.words" defaultStr="Words" />
            </Link>
            <Link href={`/explore${dialectPath}/learn/phrases?page=1&pageSize=10`}>
              <FVLabel transKey="general.phrases" defaultStr="Phrases" />
            </Link>
            <Link href={`/explore${dialectPath}/learn/songs`}>
              <FVLabel transKey="general.songs" defaultStr="Songs" />
            </Link>
            <Link href={`/explore${dialectPath}/learn/stories`}>
              <FVLabel transKey="general.stories" defaultStr="Stories" />
            </Link>
            <Link href={`/explore${dialectPath}/learn/alphabet`}>
              <FVLabel transKey="general.alphabet" defaultStr="Alphabet" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolbarNavigation
