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
import React from 'react'
import classNames from 'classnames'
import Link from 'components/Link'
import PropTypes from 'prop-types'

function ReportsPresentationCard({ dialectPath, fullWidth, item, style }) {
  const _style = Object.assign({}, { marginBottom: '20px' }, style)
  return (
    <div style={_style} key={item.uid} className={classNames('col-xs-12', 'col-md-12', { 'col-md-4': !fullWidth })}>
      <Link href={`/explore${dialectPath}/reports/${encodeURI(item.name)}`}>{item.name}</Link>
    </div>
  )
}

const { bool, object, string } = PropTypes

ReportsPresentationCard.propTypes = {
  dialectPath: string,
  fullWidth: bool,
  item: object,
  style: object,
}

ReportsPresentationCard.defaultPropTypes = {
  item: {},
}

export default ReportsPresentationCard
