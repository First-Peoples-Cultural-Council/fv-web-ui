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

import Preview from 'views/components/Editor/Preview'
import MetadataList from 'views/components/Browsing/metadata-list'
import FVLabel from 'views/components/FVLabel/index'

import { withTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { connect } from 'react-redux'

/**
 * Metadata panel for word or phrase views.
 */
export class MetadataPanel extends Component {
  static propTypes = {
    computeEntity: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
  }
  state = {
    open: false,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { computeEntity, routeParams } = this.props

    const metadata = []

    /**
     * Categories
     */
    const categoriesMap = selectn('response.contextParameters.word.categories', computeEntity) || []
    const categories = categoriesMap.map((category, key) => {
      return <div key={key}>{selectn('dc:title', category)}</div>
    })
    metadata.push({
      label: this.props.intl.trans('categories', 'Categories', 'first'),
      value: categories,
    })

    /**
     * Phrase books
     */
    const phraseBooksMap = selectn('response.contextParameters.phrase.phrase_books', computeEntity) || []

    const phrase_books = phraseBooksMap.map((phrase_book, key) => {
      return <div key={key}>{selectn('dc:title', phrase_book)}</div>
    })

    metadata.push({
      label: this.props.intl.trans('phrase_books', 'Phrase Books', 'first'),
      value: phrase_books,
    })

    /**
     * Reference
     */
    metadata.push({
      label: this.props.intl.trans('reference', 'Reference', 'first'),
      value: selectn('response.properties.fv:reference', computeEntity),
    })

    /**
     * Sources
     */
    const sourcesMap =
      selectn('response.contextParameters.word.sources', computeEntity) ||
      selectn('response.contextParameters.phrase.sources', computeEntity) ||
      []

    const sources = sourcesMap.map((source, key) => {
      return <Preview styles={{ padding: 0 }} expandedValue={source} key={key} type="FVContributor" />
    })

    metadata.push({
      label: this.props.intl.trans('sources', 'Sources', 'first'),
      value: sources,
    })

    /**
     * Date created
     */
    metadata.push({
      label: this.props.intl.trans('date_created', 'Date Added to FirstVoices', 'first'),
      value: StringHelpers.formatUTCDateString(selectn('response.properties.dc:created', computeEntity)),
    })

    /**
     * Status
     */
    const dialectName = routeParams.dialect_name

    const mapDocumentStateToVisibility = {
      New: `${dialectName ? dialectName : ''} Team Only`,
      Disabled: `${dialectName ? dialectName : ''} Team Only`,
      Enabled: `${dialectName ? dialectName : ''} Members Only`,
      Published: 'Public',
    }

    metadata.push({
      label: this.props.intl.trans('status', 'Status', 'first'),
      value: mapDocumentStateToVisibility[selectn('response.state', computeEntity)],
    })

    /**
     * Version
     */
    metadata.push({
      label: this.props.intl.trans('version', 'Version', 'first'),
      value:
        selectn('response.properties.uid:major_version', computeEntity) +
        '.' +
        selectn('response.properties.uid:minor_version', computeEntity),
    })

    const themePalette = this.props.theme.palette

    return (
      <Card>
        <CardHeader
          onClick={() => {
            this.setState({
              open: !this.state.open,
            })
          }}
          className="card-header-custom"
          title={
            <Typography
              variant="subtitle1"
              style={{
                color: themePalette.secondary.contrastText,
              }}
            >
              <FVLabel transKey="metadata" defaultStr="METADATA" transform="upper" />
              <IconButton
                onClick={() => {
                  this.setState({
                    open: !this.state.open,
                  })
                }}
              >
                {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Typography>
          }
          style={{
            backgroundColor: themePalette.primary2Color,
            borderBottom: '4px solid ' + themePalette.primary.light,
            padding: '0 16px',
          }}
        />
        <Collapse in={this.state.open}>
          <CardContent>
            <MetadataList metadata={metadata} style={{ overflow: 'auto', maxHeight: '100%' }} />
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  const { locale, navigation } = state
  const { intlService } = locale

  return {
    intl: intlService,
    routeParams: navigation.route.routeParams,
  }
}

export default connect(mapStateToProps)(withTheme(MetadataPanel))
