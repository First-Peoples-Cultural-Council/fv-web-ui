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

import classNames from 'classnames'
import selectn from 'selectn'

import StringHelpers from 'common/StringHelpers'

import Preview from 'views/components/Editor/Preview'
import MetadataList from 'views/components/Browsing/metadata-list'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import IntlService from 'views/services/intl'
const intl = IntlService.instance
/**
 * Metadata panel for word or phrase views.
 */
export default class MetadataPanel extends Component {
  static propTypes = {
    computeEntity: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { computeEntity } = this.props

    const metadata = []

    /**
     * Categories
     */
    const categories = []

    {
      (selectn('response.contextParameters.word.categories', computeEntity) || []).map(function(category, key) {
        categories.push(<div key={key}>{selectn('dc:title', category)}</div>)
      })
    }
    metadata.push({
      label: intl.trans('categories', 'Categories', 'first'),
      value: categories,
    })

    /**
     * Phrase books
     */
    const phrase_books = []

    {
      (selectn('response.contextParameters.phrase.phrase_books', computeEntity) || []).map(function(phrase_book, key) {
        phrase_books.push(<div key={key}>{selectn('dc:title', phrase_book)}</div>)
      })
    }
    metadata.push({
      label: intl.trans('phrase_books', 'Phrase Books', 'first'),
      value: phrase_books,
    })

    /**
     * Reference
     */
    metadata.push({
      label: intl.trans('reference', 'Reference', 'first'),
      value: selectn('response.properties.fv:reference', computeEntity),
    })

    /**
     * Sources
     */
    const sources = []

    {
      (selectn('response.contextParameters.word.sources', computeEntity) || []).map(function(source, key) {
        sources.push(<Preview styles={{ padding: 0 }} expandedValue={source} key={key} type="FVContributor" />)
      })
    }
    metadata.push({
      label: intl.trans('sources', 'Sources', 'first'),
      value: sources,
    })

    /**
     * Date created
     */
    metadata.push({
      label: intl.trans('date_created', 'Date Created', 'first'),
      value: StringHelpers.formatUTCDateString(selectn('response.properties.dc:created', computeEntity)),
    })

    /**
     * Status
     */
    metadata.push({
      label: intl.trans('status', 'Status', 'first'),
      value: selectn('response.state', computeEntity),
    })

    /**
     * Version
     */
    metadata.push({
      label: intl.trans('version', 'Version', 'first'),
      value:
        selectn('response.properties.uid:major_version', computeEntity) +
        '.' +
        selectn('response.properties.uid:minor_version', computeEntity),
    })

    const themePalette = this.props.properties.theme.palette.rawTheme.palette

    return (
      <Card initiallyExpanded>
        <CardHeader
          className="card-header-custom"
          title={intl.trans('about_this_record', 'About this Record', 'upper')}
          titleStyle={{ lineHeight: 'initial' }}
          titleColor={themePalette.alternateTextColor}
          actAsExpander
          style={{
            backgroundColor: themePalette.primary2Color,
            height: 'initial',
            borderBottom: '4px solid ' + themePalette.primary1Color,
          }}
          showExpandableButton
        />
        <CardContent expandable style={{ backgroundColor: themePalette.accent4Color }}>
          <MetadataList metadata={metadata} style={{ overflow: 'auto', maxHeight: '100%' }} />
        </CardContent>
      </Card>
    )
  }
}
