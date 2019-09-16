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

import selectn from 'selectn'

import StringHelpers from 'common/StringHelpers'
import IntlService from 'views/services/intl'

import Preview from 'views/components/Editor/Preview'
import MetadataList from 'views/components/Browsing/metadata-list'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { withTheme } from '@material-ui/core/styles'

const intl = IntlService.instance
/**
 * Metadata panel for word or phrase views.
 */
export class MetadataPanel extends Component {
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
    const categoriesMap = selectn('response.contextParameters.word.categories', computeEntity) || []
    categoriesMap.map((category, key) => {
      categories.push(<div key={key}>{selectn('dc:title', category)}</div>)
    })
    metadata.push({
      label: intl.trans('categories', 'Categories', 'first'),
      value: categories,
    })

    /**
     * Phrase books
     */
    const phrase_books = []
    const phraseBooksMap = selectn('response.contextParameters.phrase.phrase_books', computeEntity) || []

    phraseBooksMap.map((phrase_book, key) => {
      phrase_books.push(<div key={key}>{selectn('dc:title', phrase_book)}</div>)
    })

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
    const sourcesMap = selectn('response.contextParameters.word.sources', computeEntity) || []

    sourcesMap.map((source, key) => {
      sources.push(<Preview styles={{ padding: 0 }} expandedValue={source} key={key} type="FVContributor" />)
    })

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

    const themePalette = this.props.theme.v0.palette

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
export default withTheme()(MetadataPanel)
