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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import classNames from 'classnames';

import ReactPaginate from 'react-paginate';

import ChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right';

export default class Pagination extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <ReactPaginate
                previousLabel={<ChevronLeft/>}
                nextLabel={<ChevronRight/>}
                forcePage={this.props.forcePage}
                breakLabel={<a style={{paddingBottom: '7px'}}>...</a>}
                breakClassName={"pagination-page"}
                pageLinkClassName={"pagination-page"}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                onPageChange={this.props.onPageChange}
                {...this.props} />
        );
    }
}