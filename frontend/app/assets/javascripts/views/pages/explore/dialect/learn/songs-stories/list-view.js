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

import DOMPurify from 'dompurify'

import AVPlayArrow from '@material-ui/icons/PlayArrow'
import AVStop from '@material-ui/icons/Stop'
import ClearIcon from '@material-ui/icons/Clear'
import FlipToFrontIcon from '@material-ui/icons/FlipToFront'

import { withTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
// import GridList from '@material-ui/core/GridList'
// import GridListTile from '@material-ui/core/GridListTile'
// import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Link from 'views/components/Link'
import FVTab from 'views/components/FVTab'
import UIHelpers from 'common/UIHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import { Cover } from 'components/svg/cover'
import FVLabel from 'views/components/FVLabel/index'
import { connect } from 'react-redux'

class _Introduction extends Component {
  static propTypes = {
    defaultLanguage: PropTypes.any, // TODO: set correct type
    style: PropTypes.any, // TODO: set correct type
    item: PropTypes.any, // TODO: set correct type
    audio: PropTypes.any, // TODO: set correct type
  }
  static defaultProps = {
    style: {},
  }
  state = {
    tabValue: 0,
  }
  render() {
    const DEFAULT_LANGUAGE = this.props.defaultLanguage
    const item = this.props.item
    const introduction = selectn('properties.fvbook:introduction', item)
    const introductionTranslations = selectn('properties.fvbook:introduction_literal_translation', item)
    const introductionDiv = (
      <div className="IntroductionContent">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduction) }} style={this.props.style} />
      </div>
    )

    if (!introductionTranslations || introductionTranslations.length === 0) {
      if (!introduction) {
        return null
      }

      return (
        <div className="IntroductionTranslations">
          <div>
            <h1 className="IntroductionTitle">
              <FVLabel
                transKey="introduction"
                defaultStr="Introduction"
                transform="first"
              />
              {this.props.audio}
            </h1>
          </div>
          {introductionDiv}
        </div>
      )
    }

    return (
      <div>
        <FVTab
          tabItems={[
            { label: this.props.intl.trans('introduction', 'Introduction', 'first') },
            {
              label: this.props.intl.searchAndReplace(DEFAULT_LANGUAGE),
            },
          ]}
          tabsValue={this.state.tabValue}
          tabsOnChange={(e, tabValue) => this.setState({ tabValue })}
        />

        {this.state.tabValue === 0 && (
          <Typography variant="headline" component="div" style={{ padding: 8 * 3 }}>
            {introductionDiv}
          </Typography>
        )}
        {this.state.tabValue === 1 && (
          <Typography variant="headline" component="div" style={{ padding: 8 * 3 }}>
            <div className="IntroductionContent">
              {introductionTranslations.map(function introductionTranslationsMapper(translation, i) {
                if (translation.language === DEFAULT_LANGUAGE) {
                  return (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation.translation) }} key={i} />
                  )
                }
              })}
            </div>
          </Typography>
        )}
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

const Introduction = connect(mapStateToProps)(withTheme()(_Introduction))

class _SongsStoriesCardView extends Component {
  static propTypes = {
    action: PropTypes.func,
    item: PropTypes.any, // TODO: set correct type
    defaultLanguage: PropTypes.any, // TODO: set correct type
    style: PropTypes.any, // TODO: set correct type
    cols: PropTypes.any, // TODO: set correct type
    siteTheme: PropTypes.any, // TODO: set correct type
  }
  static defaultProps = {
    action: () => { },
    style: {},
    siteTheme: 'explore',
  }
  constructor(props, context) {
    super(props, context)

    this.state = {
      showIntro: false,
    }
  }

  render() {
    let audioIcon = null
    let audioCallback = null

    const DEFAULT_LANGUAGE = this.props.defaultLanguage
    const item = this.props.item

    let cardImage = <Cover />
    const mediumImage = selectn('contextParameters.book.related_pictures[0].views[2]', item)
    if (mediumImage) {
      const coverImage = selectn('url', mediumImage) || 'assets/images/cover.png'
      cardImage = (
        <div
          className="CardViewMedia"
          style={{
            backgroundSize: selectn('width', mediumImage) > 200 ? 'contain' : 'cover',
            backgroundImage: `url('${coverImage}?inline=true')`,
          }}
        />
      )
    }
    const audioObj = selectn('contextParameters.book.related_audio[0].path', item)

    if (audioObj) {
      const stateFunc = function stateFunc(state) {
        this.setState(state)
      }.bind(this)

      const isStopped =
        decodeURIComponent(selectn('src', this.state.nowPlaying)) !== NavigationHelpers.getBaseURL() + audioObj
      audioIcon = isStopped ? (
        <AVPlayArrow style={{ marginRight: '10px' }} />
      ) : (
        <AVStop style={{ marginRight: '10px' }} />
      )
      audioCallback = isStopped
        ? UIHelpers.playAudio.bind(this, this.state, stateFunc, NavigationHelpers.getBaseURL() + audioObj)
        : UIHelpers.stopAudio.bind(this, this.state, stateFunc)
    }

    // Translated 'continue' label
    const entryType = selectn('properties.fvbook:type', item)
    const translatedContinueLabelKey =
      'views.pages.explore.dialect.learn.songs_stories.continue_to_' + (entryType ? entryType : 'x')

    const translatedContinueLabel = this.props.intl.trans(
      translatedContinueLabelKey,
      'Continue to ' + (entryType ? this.props.intl.searchAndReplace(entryType) : 'Entry'),
      'first',
      [entryType ? this.props.intl.searchAndReplace(entryType) : this.props.intl.trans('entry', 'Entry', 'first')]
    )
    const title = <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.title) }} />
    const subtitle = (selectn('properties.fvbook:title_literal_translation', item) || []).map((translation, i) => {
      if (translation.language === DEFAULT_LANGUAGE) {
        return <span key={i}>{translation.translation}</span>
      }
    })

    const cardViewPopover = (
      <div
        className="CardViewPopover"
        style={{
          zIndex: 2,
          width: '95%',
          minWidth: 'auto',
        }}
      >
        <IconButton
          className="CardViewPopoverClose"
          style={{ position: 'absolute' }}
          // iconClassName="material-icons"
          onClick={() => this.setState({ showIntro: false })}
        >
          <ClearIcon />
        </IconButton>

        {selectn('properties.fvbook:introduction', item) && (
          <Introduction
            defaultLanguage={this.props.defaultLanguage}
            item={this.props.item}
            style={this.props.style}
            audio={
              audioIcon ? (
                <IconButton
                  style={{ verticalAlign: 'middle', padding: '0', width: '25px', height: '25px' }}
                  // iconStyle={{ width: '25px', height: '25px' }}
                  onClick={audioCallback}
                >
                  {audioIcon}
                </IconButton>
              ) : null
            }
          />
        )}
      </div>
    )
    const CardClasses = classNames({
      CardView: true,
      'col-xs-12': true,
      [`col-md-${Math.ceil(12 / this.props.cols)}`]: true,
    })
    const href = NavigationHelpers.generateUIDPath(
      this.props.siteTheme,
      item,
      selectn('properties.fvbook:type', item) === 'story' ? 'stories' : 'songs'
    )
    return (
      <div key={item.uid} className={CardClasses} style={this.props.style}>
        <Card className="CardViewCard">
          <div className="CardViewMediaContainer" onClick={this.props.action.bind(this, item)}>
            {cardImage}
          </div>
          {this.state.showIntro && cardViewPopover}
          <CardContent style={{ padding: '4px' }}>
            <div className="CardViewTitles">
              <h2
                className={classNames('CardViewTitle', 'fontAboriginalSans')}
                onClick={this.props.action.bind(this, item)}
              >
                {title}
              </h2>
              <h3 className="CardViewSubtitle" onClick={this.props.action.bind(this, item)}>
                {subtitle}
              </h3>
            </div>
            <div className="CardViewCardActions">
              <Link className="FlatButton" href={href}>
                {translatedContinueLabel}
              </Link>
              {selectn('properties.fvbook:introduction', item) && (
                <IconButton
                  style={{
                    padding: '0',
                    width: '24px',
                    height: '24px',
                  }}
                  onClick={() => this.setState({ showIntro: !this.state.showIntro })}
                >
                  <FlipToFrontIcon />
                </IconButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

const SongsStoriesCardView = connect(mapStateToProps)(_SongsStoriesCardView)

export {
  Introduction,
  SongsStoriesCardView,
}
