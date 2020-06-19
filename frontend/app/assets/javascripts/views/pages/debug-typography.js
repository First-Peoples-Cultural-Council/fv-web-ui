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
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

const { any } = PropTypes
export class DebugTypography extends Component {
  static propTypes = {
    deleteResource: any,
  }
  static defaultProps = {}

  render() {
    return (
      <div>
        <Typography variant="h1" gutterBottom>
          {'[variant="h1"]'}
        </Typography>
        <Typography variant="h2" gutterBottom>
          {'[variant="h2"]'}
        </Typography>
        <Typography variant="h3" gutterBottom>
          {'[variant="h3"]'}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {'[variant="h4"]'}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {'[variant="h5"]'}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {'[variant="h6"]'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {'[variant="subtitle1"]'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {'[variant="body1"]'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {'[variant="body2"]'}
        </Typography>
        <Typography variant="caption" gutterBottom>
          {'[variant="caption"]'}
        </Typography>
        <Typography gutterBottom>
          {`
    Lorem ipsum dolor sit amet. [No variant set]
`}
        </Typography>
        <Typography variant="button" gutterBottom>
          {'[variant="button"]'}
        </Typography>
      </div>
    )
  }
}

export default DebugTypography
