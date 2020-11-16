import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import FVLabel from 'components/FVLabel'

export class Statistics extends Component {
  constructor(props, context) {
    super(props, context)
  }

  _generateLifecycleStateDoughnutData(data, docType) {
    const doughnutData = []
    doughnutData.push({
      value: data[docType].new,
      color: '#949FB1',
      highlight: '#A8B3C5',
      label: this.props.intl.trans('new', 'New', 'first'),
    })
    doughnutData.push({
      value: data[docType].enabled,
      color: '#FDB45C',
      highlight: '#FFC870',
      label: this.props.intl.trans('enabled', 'Enabled', 'first'),
    })
    doughnutData.push({
      value: data[docType].published,
      color: '#46BFBD',
      highlight: '#5AD3D1',
      label: this.props.intl.trans('published', 'Published', 'first'),
    })
    doughnutData.push({
      value: data[docType].disabled,
      color: '#F7464A',
      highlight: '#FF5A5E',
      label: this.props.intl.trans('disabled', 'Disabled', 'first'),
    })
    return doughnutData
  }

  _generateTwoSliceDoughnutData(total, subset, labels) {
    const doughnutData = []
    const totalMinusSubset = total - subset
    doughnutData.push({ value: totalMinusSubset, color: '#46BFBD', highlight: '#5AD3D1', label: labels[0] })
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
          <div className={'col-sm-4'} style={{ paddingTop: '35px', paddingLeft: '35px' }}>
            <div style={{ paddingBottom: '10px' }}>
              <strong>{this.props.headerText}</strong>: {dataResponse[docType].total}
            </div>

            {lifecycleStateDoughnutData.map((slice) => (
              <div key={slice.label}>
                <span style={{ color: slice.color }}>&#9632;</span> {slice.label}: {slice.value}
              </div>
            ))}
          </div>
          <div className={'col-sm-5'} style={{ paddingTop: '65px' }}>
            <ul>
              <li>
                <strong>
                  <FVLabel
                    transKey="views.components.dashboard.created_today"
                    defaultStr="Created Today"
                    transform="first"
                  />
                  :{' '}
                </strong>
                {dataResponse[docType].created_today}
              </li>
              <li>
                <strong>
                  <FVLabel
                    transKey="views.components.dashboard.modified_today"
                    defaultStr="Modified Today"
                    transform="first"
                  />
                  :{' '}
                </strong>
                {dataResponse[docType].modified_today}
              </li>
              <li>
                <strong>
                  <FVLabel
                    transKey="views.components.dashboard.created_last_7_days"
                    defaultStr="Created Last 7 Days"
                    transform="words"
                  />
                  :{' '}
                </strong>
                {dataResponse[docType].created_within_7_days}
              </li>
              <li>
                <strong>
                  <FVLabel
                    transKey="views.components.dashboard.available_in_kids_area"
                    defaultStr="Available In Kids Area"
                    transform="words"
                  />
                  :{' '}
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

const mapStateToProps = (state) => {
  const { locale } = state
  const { intlService } = locale
  return {
    intl: intlService,
  }
}

export default connect(mapStateToProps)(Statistics)
