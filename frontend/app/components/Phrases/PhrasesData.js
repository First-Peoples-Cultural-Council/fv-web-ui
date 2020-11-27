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
import useWindowPath from 'dataSources/useWindowPath'

import ProviderHelpers from 'common/ProviderHelpers'

function PhrasesData(props) {
  const { computeDialect2, fetchDialect2 } = useDialect()
  const { computeDocument, fetchDocument } = useDocument()
  const { intl } = useIntl()
  const { computePortal, fetchPortal } = usePortal()
  const { routeParams } = useRoute()
  const { splitWindowPath } = useWindowPath()
  const dictionaryKey = `${routeParams.dialect_path}/Dictionary`

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Dialect
    await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
    // Document
    await ProviderHelpers.fetchIfMissing(dictionaryKey, fetchDocument, computeDocument)
    // Portal
    await ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, fetchPortal, computePortal)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: routeParams.dialect_path,
      entity: computePortal,
    },
    {
      id: dictionaryKey,
      entity: computeDocument,
    },
  ])

  const handlePhrasebookClick = () => {
    // TODO: WILL BE FIXED IN FW-2027
  }

  const handleAlphabetClick = () => {
    // TODO: WILL BE FIXED IN FW-2028
  }

  return props.children({
    computeEntities,
    flashcardMode: false,
    handlePhrasebookClick,
    handleAlphabetClick,
    intl,
    routeParams,
    splitWindowPath,
  })
}

export default PhrasesData
