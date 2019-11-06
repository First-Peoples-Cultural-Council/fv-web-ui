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
        <Typography variant="display4" gutterBottom>
          {'Display 4 [variant="display4"]'}
        </Typography>
        <Typography variant="display3" gutterBottom>
          {'Display 3 [variant="display3"]'}
        </Typography>
        <Typography variant="display2" gutterBottom>
          {'Display 2 [variant="display2"]'}
        </Typography>
        <Typography variant="display1" gutterBottom>
          {'Display 1 [variant="display1"]'}
        </Typography>
        <Typography variant="headline" gutterBottom>
          {'Headline [variant="headline"]'}
        </Typography>
        <Typography variant="title" gutterBottom>
          {'Title [variant="title"]'}
        </Typography>
        <Typography variant="subheading" gutterBottom>
          {'Subheading [variant="subheading"]'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {'Body 2 [variant="body2"]'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {'Body 1 [variant="body1"]'}
        </Typography>
        <Typography variant="caption" gutterBottom>
          {'Caption [variant="caption"]'}
        </Typography>
        <Typography gutterBottom>
          {`
    Lorem ipsum dolor sit amet. [No variant set]
`}
        </Typography>
        <Typography variant="button" gutterBottom>
          {'Button [variant="button"]'}
        </Typography>
      </div>
    )
  }
}

export default DebugTypography
