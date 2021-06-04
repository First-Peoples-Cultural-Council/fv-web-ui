import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// FPCC
// -------------------------------------------
import WordsList from 'components/WordsList'
import PhrasesList from 'components/PhrasesList'
import PromiseWrapper from 'components/PromiseWrapper'

import { reportsQueries } from 'components/Reports/reportsQueries'
import GeneralList from 'components/GeneralList'
import ReportsPresentationCard from 'components/Reports/ReportsPresentationCard'

import withFilter from 'components/withFilter'
const FilteredCardList = withFilter(GeneralList)

/**
 * @summary ReportsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ReportsPresentation({ computeEntities, reportFilter, routeParams, pushWindowPath }) {
  const [filteredList, setFilteredList] = useState()
  const listView =
    reportFilter?.type === 'words' ? (
      <WordsList.Container reportFilter={reportFilter} />
    ) : (
      <PhrasesList.Container reportFilter={reportFilter} />
    )

  const fullWidth = reportFilter ? true : false

  const reportsBrowserProps = {
    filterOptionsKey: 'Reports',
    fixedList: true,
    fixedListFetcher: (list) => setFilteredList(list),
    filteredItems: filteredList,
    fullWidth: fullWidth,
    style: { fontSize: '1.2em', padding: '8px 0 0 30px' },
    wrapperStyle: fullWidth ? { maxHeight: '1000px', overflowY: 'scroll' } : null,
    card: <ReportsPresentationCard fullWidth={fullWidth} dialectPath={routeParams.dialect_path} />,
    area: routeParams.area,
    items: reportsQueries,
    action: (path) => {
      pushWindowPath(path)
    },
  }

  const reportsBrowser = <FilteredCardList {...reportsBrowserProps} />

  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      {reportFilter ? (
        <div className="row">
          <div className="col-xs-12 col-md-3 PrintHide">{reportsBrowser}</div>
          <div className="col-xs-12 col-md-9">{listView}</div>
        </div>
      ) : (
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-8')}>
            <h1>Reports</h1>
            {reportsBrowser}
          </div>
        </div>
      )}
    </PromiseWrapper>
  )
}

// PROPTYPES
const { func, object } = PropTypes
ReportsPresentation.propTypes = {
  computeEntities: object,
  pushWindowPath: func,
  reportFilter: object,
  routeParams: object,
}

ReportsPresentation.defaultProps = {}

export default ReportsPresentation
