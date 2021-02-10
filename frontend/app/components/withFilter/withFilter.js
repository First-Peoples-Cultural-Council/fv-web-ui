import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { List, Map } from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'

import t from 'tcomb-form'

import IntlService from 'common/services/IntlService'
import filterFields from 'common/schemas/filterFields'
import filterOptions from 'common/schemas/filterOptions'

import withToggle from 'components/withToggle'

import ProviderHelpers from 'common/ProviderHelpers'
import FormHelpers from 'common/FormHelpers'

import FVLabel from 'components/FVLabel'

import './withFilter.css'

const intl = IntlService.instance

const FiltersWithToggle = withToggle()

/**
 * Return 'true' if value was found, 'false' otherwise.
 */
const defaultFilterFunc = function defaultFilterFunc(propertyToSearch, filterValue) {
  if (!propertyToSearch) return true

  if (Array.isArray(propertyToSearch)) {
    return propertyToSearch.indexOf(filterValue) !== -1
  }
  return propertyToSearch.search(new RegExp(filterValue, 'i')) !== -1
}

const { any, bool, func, object, string } = PropTypes
export default function withFilter(ComposedFilter, DefaultFetcherParams) {
  class FilteredGridList extends Component {
    static propTypes = {
      applyDefaultFormValues: bool,
      area: string,
      fetcher: func,
      fetcherParams: object,
      filterOptionsKey: string.isRequired,
      fixedList: bool,
      fixedListFetcher: func,
      formValues: any, // TODO: set appropriate propType
      fullWidth: bool,
      initialFormValue: any, // TODO: set appropriate propType
      initialValues: object,
      items: any, // TODO: set appropriate propType
      metadata: object,
    }
    static defaultProps = {
      filterOptionsKey: 'Default',
      fullWidth: false,
    }

    constructor(props, context) {
      super(props, context)

      this.filter_form = React.createRef()

      this.state = {
        filterOptions: filterOptions,
        formValue: props.initialFormValue || props.formValues,
        defaultFormValue: props.formValues,
        initialFormValue: props.initialFormValue,
      }
    }

    componentDidMount() {
      // Only auto-apply with a fixed list
      if (this.props.fixedList && this.props.applyDefaultFormValues) {
        this._onFilterSaveForm(null)
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.area !== prevProps.area) {
        this._onReset(null, this.props)
      }

      // Items may change in a fixed list (e.g. deleted, added)
      const curPropsItemsList = Immutable.fromJS(this.props.items)
      const prevPropsItemsList = Immutable.fromJS(prevProps.items)

      if (prevProps.fixedList && curPropsItemsList.equals(prevPropsItemsList) === false) {
        this._onReset(null, this.props)
      }
    }

    render() {
      let options = Map(selectn(this.props.filterOptionsKey, this.state.filterOptions))

      // Replace proxied properties where necessary
      if (this.props.area) {
        // TODO: fields already declared by import, see about fixing this
        // eslint-disable-next-line
        const fields = Map(options.get('fields')).map(
          function fieldsMap(field) {
            if (Object.prototype.hasOwnProperty.call(field, 'nxql')) {
              field.nxql = ProviderHelpers.replaceAllWorkspaceSectionKeys(field.nxql, this.props.area)
            }

            return field
          }.bind(this)
        )

        options = options.set('fields', fields)
      }

      return (
        <div data-testid="withFilter" className="FilteredGridList PrintHide">
          <div className="row">
            <div
              className={classNames('col-xs-12', {
                'col-md-3': !this.props.fullWidth,
                'col-md-12': this.props.fullWidth,
              })}
            >
              <form>
                <FiltersWithToggle
                  label={<FVLabel transKey="views.pages.search.filter_items" defaultStr="Filter Items" />}
                  mobileOnly
                >
                  <t.form.Form
                    ref={this.filter_form}
                    type={t.struct(selectn(this.props.filterOptionsKey, filterFields))}
                    context={this.props.initialValues}
                    value={this.state.formValue}
                    options={options.toJS()}
                  />
                  <div className="FilteredGridList__btnGroup">
                    <button
                      type="button"
                      className="FilteredGridList__btn RaisedButton RaisedButton--primary"
                      onClick={(e) => {
                        this._onReset(e, this.props)
                      }}
                    >
                      {intl.trans('reset', 'Reset', 'first')}
                    </button>
                    <button
                      type="button"
                      onClick={this._onFilterSaveForm}
                      className="FilteredGridList__btn RaisedButton RaisedButton--primary"
                    >
                      {intl.trans('filter', 'Filter', 'first')}
                    </button>
                  </div>
                </FiltersWithToggle>
              </form>
            </div>

            <div
              className={classNames('col-xs-12', {
                'col-md-9': !this.props.fullWidth,
                'col-md-12': this.props.fullWidth,
              })}
            >
              <ComposedFilter {...this.state} {...this.props} />
            </div>
          </div>
        </div>
      )
    }

    _doFilter = (filters, isReset, props = this.props) => {
      // Filter a fixed list (i.e. all items sent to component)
      if (this.props.fixedList) {
        const filteredList = new List(props.items).filter(function filteredListFilterer(item) {
          // Test each of the filters against item
          for (const filterKey in filters) {
            const filter = selectn([props.filterOptionsKey, 'fields', filterKey], filterOptions)
            const filterFunc =
              filter && Object.prototype.hasOwnProperty.call(filter, 'filterFunc')
                ? filter.filterFunc
                : defaultFilterFunc

            const filterValue = filters[filterKey]
            const propertyToSearch = selectn(filterKey, item)

            if (!filterFunc(propertyToSearch, filterValue)) {
              return false
            }
          }

          return true
        })

        props.fixedListFetcher(filteredList)
      } else {
        // Filter a remote list (i.e. partial list sent to component)
        const preparedFilters = FormHelpers.prepareFilters(filters, filterOptions, this.props.filterOptionsKey)

        this.props.fetcher(
          Object.assign({}, this.props.fetcherParams, {
            currentPageIndex: 1,
            filters: preparedFilters,
          }),
          isReset ? {} : filters
        )
      }
    }

    _onReset = (event, props = this.props) => {
      const form = this.filter_form.current

      // Reset all controlled inputs
      const inputs = Object.assign({}, selectn('refs.input.refs', form), selectn('inputRef.childRefs', form))

      for (const inputKey in inputs) {
        if (typeof inputs[inputKey].forceReset === 'function') {
          inputs[inputKey].forceReset()
        }
      }

      this.setState({
        formValue: this.state.defaultFormValue || null,
      })

      if (props.fixedList) {
        if (this.state.defaultFormValue) {
          this._doFilter(this.state.defaultFormValue, true, props)
        } else {
          props.fixedListFetcher(props.items)
        }
      } else {
        this._doFilter(DefaultFetcherParams.filters, true, props)
      }
    }

    _onFilterSaveForm = (e) => {
      // Prevent default behaviour
      if (e) {
        e.preventDefault()
      }

      const form = this.filter_form.current
      const properties = FormHelpers.getProperties(form)

      if (Object.keys(properties).length !== 0) {
        this.setState({
          formValue: properties,
        })

        this._doFilter(properties)
      } else {
        this._onReset(null)
      }
    }
  }

  return FilteredGridList
}
