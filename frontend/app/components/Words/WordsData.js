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
import { useEffect } from 'react'
import Immutable from 'immutable'

import useDialect from 'dataSources/useDialect'
import useDocument from 'dataSources/useDocument'
import useIntl from 'dataSources/useIntl'
import usePortal from 'dataSources/usePortal'
import useRoute from 'dataSources/useRoute'

import ProviderHelpers from 'common/ProviderHelpers'

function WordsData(props) {
  const { computeDialect2, fetchDialect2 } = useDialect()
  const { computeDocument, fetchDocument } = useDocument()
  const { intl } = useIntl()
  const { computePortal, cacheComputePortal, fetchPortal } = usePortal()
  const { routeParams } = useRoute()
  const dictionaryKey = `${routeParams.dialect_path}/Dictionary`

  const portalKey = `${routeParams.dialect_path}/Portal`
  useEffect(() => {
    // Dialect
    ProviderHelpers.fetchIfMissing({ key: routeParams.dialect_path, action: fetchDialect2, reducer: computeDialect2 })
    // Document
    ProviderHelpers.fetchIfMissing({ key: dictionaryKey, action: fetchDocument, reducer: computeDocument })
    // Portal
    ProviderHelpers.fetchIfMissing({
      key: portalKey,
      action: fetchPortal,
      reducer: computePortal,
      reducerCache: cacheComputePortal,
    })
  }, [])
  const computeEntities = Immutable.fromJS([
    {
      id: dictionaryKey,
      entity: computeDocument,
    },
  ])

  return props.children({
    computeEntities,
    intl,
  })
}

export default WordsData
