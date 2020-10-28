import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Immutable, {List, Map} from 'immutable'

import selectn from 'selectn'
import DOMPurify from 'dompurify'

import GridListTile from '@material-ui/core/GridListTile'

import UIHelpers from 'common/UIHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import { connect } from 'react-redux'

class SearchResultTile extends Component {
  static defaultProps = {}
  static propTypes = {
    intl: PropTypes.any.isRequired, // TODO: set appropriate propType
    tile: PropTypes.any.isRequired, // TODO: set appropriate propType
    searchTerm: PropTypes.any, // TODO: set appropriate propType
  }
  constructor(props, context) {
    super(props, context)

    this.state = {
      showInfo: false,
    }
  }

  render() {
    const { intl, tile } = this.props

    let type = selectn('type', tile) || ''
    let desc = intl.searchAndReplace(selectn('properties.dc:description', tile))
    let title = intl.searchAndReplace(selectn('properties.dc:title', tile))
    let subtitle = ''
    const path = [
      selectn('contextParameters.ancestry.family.dc:title', tile),
      selectn('contextParameters.ancestry.language.dc:title', tile),
      selectn('contextParameters.ancestry.dialect.dc:title', tile),
    ]
    let imgObj = null
    let targetPath = this.props.tile

    switch (type) {
      case 'FVWord': {
        imgObj = selectn('contextParameters.word.related_pictures[0]', tile)

        const literalTranslations = selectn('properties.fv:literal_translation', tile) || []
        const lts =
          selectn('length', literalTranslations) > 0
            ? intl.trans('views.pages.search.translation_s', 'Translation(s)', 'first') + ': '
            : ''

        subtitle = lts + literalTranslations.map((v) => v.translation).join(', ')

        const output = []

        const definitions = selectn('properties.fv:definitions', tile) || []
        if (definitions.length > 0) {
          output.push(
            '<em>' +
              intl.trans('views.pages.search.definition_s', 'Definition(s)', 'first') +
              '</em>: ' +
              definitions.map((v) => v.translation).join(', ')
          )
        }

        const partOfSpeech = selectn('properties.fv-word:part_of_speech', tile)
        if (partOfSpeech) {
          output.push(
            '<em>' +
              intl.trans('views.pages.search.part_of_speech', 'Part of Speech', 'first') +
              '</em>: ' +
              partOfSpeech
          )
        }

        const pronunciation = selectn('properties.fv-word:pronunciation', tile)
        if (pronunciation) {
          output.push('<em>' + intl.trans('pronunciation', 'Pronunciation', 'first') + '</em>: ' + pronunciation)
        }

        const categories = selectn('contextParameters.word.categories', tile) || []
        if (categories.length > 0) {
          output.push(
            '<em>' +
              intl.trans('categories', 'Categories', 'first') +
              '</em>: ' +
              categories.map((v) => selectn('dc:title', v)).join(', ')
          )
        }

        desc = output.join(', ')
        targetPath = NavigationHelpers.navigate(NavigationHelpers.generateUIDPath('explore', tile, 'words'), null, true)
        break
      }

      case 'FVPhrase': {
        imgObj = selectn('contextParameters.phrase.related_pictures[0]', tile)

        const pLiteralTranslations = selectn('properties.fv:literal_translation', tile) || []
        const plts =
          selectn('length', pLiteralTranslations) > 0
            ? intl.trans('views.pages.search.translation_s', 'Translation(s)', 'first') + ': '
            : ''

        subtitle = plts + pLiteralTranslations.map((v) => v.translation).join(', ')

        const pOutput = []

        const pDefinitions = selectn('properties.fv:definitions', tile) || []
        if (pDefinitions.length > 0) {
          pOutput.push(
            '<em>' +
              intl.trans('views.pages.search.definition_s', 'Definition(s)', 'first') +
              '</em>: ' +
              pDefinitions.map((v) => v.translation).join(', ')
          )
        }

        const pCategories = selectn('contextParameters.phrase.phrase_books', tile) || []
        if (pCategories.length > 0) {
          pOutput.push(
            '<em>' +
              intl.trans('phrase_bookes', 'Phrase Books', 'words') +
              '</em>: ' +
              pCategories.map((v) => selectn('dc:title', v)).join(', ')
          )
        }

        desc = pOutput.join(', ')

        targetPath = NavigationHelpers.navigate(
          NavigationHelpers.generateUIDPath('explore', tile, 'phrases'),
          null,
          true
        )
        break
      }

      case 'FVPortal':
        type = 'Dialect'
        title = selectn('contextParameters.ancestry.dialect.dc:title', tile)
        imgObj = selectn('contextParameters.portal.fv-portal:logo', tile)

        desc = DOMPurify.sanitize(selectn('properties.fv-portal:about', tile), { ALLOWED_TAGS: [] })
        desc = desc.length > 300 ? '...' + desc.substr(desc.indexOf(this.props.searchTerm) - 50, 250) + '...' : desc

        targetPath = '/explore' + selectn('contextParameters.ancestry.dialect.path', tile)
        break

      case 'FVBook':
        imgObj = selectn('contextParameters.phrase.related_pictures[0]', tile)

        desc = DOMPurify.sanitize(selectn('dc:description', tile), { ALLOWED_TAGS: [] })
        desc = desc.length > 300 ? '...' + desc.substr(desc.indexOf(this.props.searchTerm) - 50, 250) + '...' : desc

        targetPath = NavigationHelpers.navigate(
          NavigationHelpers.generateUIDPath(
            'explore',
            tile,
            selectn('properties.fvbook:type', tile) == 'song' ? 'songs' : 'stories'
          ),
          null,
          true
        )
        break
      default: // Note: do nothing
    }

    if (desc) {
      desc = desc.replace(
        new RegExp(this.props.searchTerm.replace(/[()]/gi, ''), 'gi'),
        '<strong className="fontBCSans">' + this.props.searchTerm + '</strong>'
      )
    }
    title = DOMPurify.sanitize(title)
    const SearchResultTileTitleType = type.replace('FV', '')

    return (
      <GridListTile
        className="SearchResultTile"
        style={{ borderBottom: '1px solid #e0e0e0', margin: '20px 0', paddingTop: '65px' }}
        key={selectn('uid', tile)}
      >
        <div className="SearchResultTileMain fontBCSans" style={{ marginLeft: '16px', width: '80%' }}>
          <a href={targetPath} className="SearchResultTileTitle fontBCSans">
            {title}
            <small className="SearchResultTileTitleType">[{SearchResultTileTitleType}]</small>
          </a>
          <span className="SearchResultTileSubtitle">{subtitle}</span>

          <div className="SearchResultTileImgContainer">
            {imgObj ? (
              <div
                className="pull-right SearchResultTileImg"
                style={{
                  height: '75px',
                  width: '75px',
                  maxHeight: '75px',
                  marginLeft: '25px',
                  background: 'url(' + UIHelpers.getThumbnail(imgObj, 'Thumbnail') + ')',
                }}
              />
            ) : (
              ''
            )}{' '}
            <span className="SearchResultTileDescription" dangerouslySetInnerHTML={{ __html: desc }} />
          </div>
          <p className="SearchResultTilePath">
            <span style={{ color: 'gray' }} dangerouslySetInnerHTML={{ __html: path.join(' &raquo; ') }} />
          </p>
        </div>
      </GridListTile>
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

export default connect(mapStateToProps)(SearchResultTile)
