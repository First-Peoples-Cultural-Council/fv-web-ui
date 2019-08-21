import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import Doughnut from 'react-chartjs/lib/doughnut'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

export default class Statistics extends Component {
  constructor(props, context) {
    super(props, context)
  }

  _generateLifecycleStateDoughnutData(data, docType) {
    const doughnutData = []
    doughnutData.push({
      value: data[docType].new,
      color: '#949FB1',
      highlight: '#A8B3C5',
      label: intl.trans('new', 'New', 'first'),
    })
    doughnutData.push({
      value: data[docType].enabled,
      color: '#FDB45C',
      highlight: '#FFC870',
      label: intl.trans('enabled', 'Enabled', 'first'),
    })
    doughnutData.push({
      value: data[docType].published,
      color: '#46BFBD',
      highlight: '#5AD3D1',
      label: intl.trans('published', 'Published', 'first'),
    }),
    doughnutData.push({
      value: data[docType].disabled,
      color: '#F7464A',
      highlight: '#FF5A5E',
      label: intl.trans('disabled', 'Disabled', 'first'),
    })
    return doughnutData
  }

  _generateTwoSliceDoughnutData(total, subset, labels) {
    const doughnutData = []
    const totalMinusSubset = total - subset
    doughnutData.push({ value: totalMinusSubset, color: '#46BFBD', highlight: '#5AD3D1', label: labels[0] }),
    doughnutData.push({ value: subset, color: '#F7464A', highlight: '#FF5A5E', label: labels[1] })
    return doughnutData
  }

  render() {
    const dataResponse = this.props.data
    const docType = this.props.docType

    // If no documents of the specified type, don't display anything
    if (dataResponse[docType].total == '0') {
      return <div />
    }

    const lifecycleStateDoughnutData = this._generateLifecycleStateDoughnutData(dataResponse, docType)

    return (
      <div>
        <div className={'row'} style={{ margin: '0' }}>
          <div className={'col-lg-4'} style={{ paddingLeft: '0' }}>
            <Doughnut data={lifecycleStateDoughnutData} width="200" height="170" options={{ responsive: true }} />
          </div>
          <div className={'col-lg-3'} style={{ paddingTop: '35px', paddingLeft: '35px' }}>
            <div style={{ paddingBottom: '10px' }}>
              <strong>{this.props.headerText}</strong>: {dataResponse[docType].total}
            </div>

            {lifecycleStateDoughnutData.map((slice, i) => (
              <div key={slice.label}>
                <span style={{ color: slice.color }}>&#9632;</span> {slice.label}: {slice.value}
              </div>
            ))}
          </div>
          <div className={'col-lg-5'} style={{ paddingTop: '65px' }}>
            <ul>
              <li>
                <strong>{intl.trans('views.components.dashboard.created_today', 'Created Today', 'first')}: </strong>
                {dataResponse[docType].created_today}
              </li>
              <li>
                <strong>{intl.trans('views.components.dashboard.modified_today', 'Modified Today', 'first')}: </strong>
                {dataResponse[docType].modified_today}
              </li>
              <li>
                <strong>
                  {intl.trans('views.components.dashboard.created_last_7_days', 'Created Last 7 Days', 'words')}:{' '}
                </strong>
                {dataResponse[docType].created_within_7_days}
              </li>
              <li>
                <strong>
                  {intl.trans('views.components.dashboard.available_in_kids_area', 'Available In Kids Area', 'words')}:{' '}
                </strong>
                {dataResponse[docType].available_in_childrens_archive}
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
