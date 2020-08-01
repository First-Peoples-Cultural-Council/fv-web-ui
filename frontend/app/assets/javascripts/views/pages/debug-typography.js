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
import React, { useEffect } from 'react'
import usePortal from 'DataSource/usePortal'
import useRoute from 'DataSource/useRoute'
import ProviderHelpers from 'common/ProviderHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import Typography from '@material-ui/core/Typography'

function DebugTypography() {
  const { computePortal, fetchPortal } = usePortal()
  const { routeParams } = useRoute()

  // on load
  useEffect(() => {
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, fetchPortal, computePortal)
  }, [])

  const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
  const dialectClassName = getDialectClassname(extractComputePortal)

  return (
    <div style={{ margin: '20px' }}>
      <p className="fontBCSans">ÍȻX̱Ŧ, ÍY, C̸NES QENOṈE ṮÁ, U, EUQ C̸NES QENOṈE HÁLE // fontBCSans</p>
      <p className="fontBCSans">ÍȻX̱Ŧ, ÍY, C̸NES QENOṈE ṮÁ, U, EUQ C̸NES QENOṈE HÁLE // fontBCSans</p>
      <p className="NotoSansCanadianAboriginal">
        ÍȻX̱Ŧ, ÍY, C̸NES QENOṈE ṮÁ, U, EUQ C̸NES QENOṈE HÁLE // NotoSansCanadianAboriginal
      </p>
      <p className="OskiDakelhWeb">ÍȻX̱Ŧ, ÍY, C̸NES QENOṈE ṮÁ, U, EUQ C̸NES QENOṈE HÁLE // OskiDakelhWeb</p>
      <p className={dialectClassName}>
        ÍȻX̱Ŧ, ÍY, C̸NES QENOṈE ṮÁ, U, EUQ C̸NES QENOṈE HÁLE //{' '}
        {`getDialectClassname(extractComputePortal) === ${dialectClassName}`}
      </p>

      <Typography variant="h1" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h1
      </Typography>
      <Typography variant="h2" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h2
      </Typography>
      <Typography variant="h3" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h3
      </Typography>
      <Typography variant="h4" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h4
      </Typography>
      <Typography variant="h5" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h5
      </Typography>
      <Typography variant="h6" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // h6
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // subtitle1
      </Typography>
      <Typography variant="body1" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // body1
      </Typography>
      <Typography variant="body2" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // body2
      </Typography>
      <Typography variant="caption" gutterBottom display="block">
        A quick brown fox jumps over the lazy dog. 1234567890 // caption
      </Typography>
      <Typography variant="button" gutterBottom>
        A quick brown fox jumps over the lazy dog. 1234567890 // button
      </Typography>
    </div>
  )
}

export default DebugTypography
