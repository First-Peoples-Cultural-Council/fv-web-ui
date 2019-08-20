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

import ReactPaginate from 'react-paginate'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

export default class Pagination extends Component {
  static defaultProps = {}
  static propTypes = {
    forcePage: PropTypes.any, // TODO: set appropriate propType
    onPageChange: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <ReactPaginate
        previousLabel={<ChevronLeft />}
        nextLabel={<ChevronRight data-testid="pagination__next" />}
        forcePage={this.props.forcePage}
        breakLabel={<a style={{ paddingBottom: '7px' }}>...</a>}
        breakClassName={'pagination-page'}
        pageLinkClassName={'pagination-page'}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        onPageChange={this.props.onPageChange}
        {...this.props}
      />
    )
  }
}
