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
// import PropTypes from 'prop-types'

import classNames from 'classnames'
import selectn from 'selectn'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import ClearIcon from '@material-ui/icons/Clear'
import FlipToFrontIcon from '@material-ui/icons/FlipToFront'
import FVLabel from 'components/FVLabel'
import { connect } from 'react-redux'

const defaultStyle = { marginBottom: '20px' }

class BrowsingCardView extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      showIntro: false,
    }
  }

  render() {
    // NOTE: `action` not being used,
    // defaultProps may be useful in this situation

    // If action is not defined
    /*
    let action

    if (this.props.hasOwnProperty('action') && typeof this.props.action === 'function') {
      action = this.props.action
    } else {
      action = () => {}
    }
    */

    let coverImage = null

    if (this.props.contextParamsKey) {
      coverImage = selectn(
        'contextParameters.' + this.props.contextParamsKey + '.related_pictures[0].views[2]',
        this.props.item
      )
    }

    coverImage = coverImage || { url: 'assets/images/cover.png' }

    const introduction = this.props.introduction ? React.cloneElement(this.props.introduction, { ...this.props }) : null

    return (
      <div
        style={Object.assign(defaultStyle, this.props.style)}
        key={this.props.item.uid}
        className={classNames('CardView', 'col-xs-12', 'col-md-' + Math.ceil(12 / this.props.cols))}
      >
        <Card className="CardViewCard" style={{ minHeight: '260px' }}>
          <div className="CardViewMediaContainer">
            <div
              style={{
                backgroundSize: selectn('width', coverImage) > 200 ? '100%' : 'cover',
                minWidth: 'inherit',
                width: '100%',
                height: '180px',
                textAlign: 'center',
                backgroundImage: "url('" + selectn('url', coverImage) + "?inline=true')",
              }}
            />
          </div>
          <CardContent style={{ padding: '4px' }}>
            <div className="CardViewCopy">
              <div className="CardViewTitles">
                <Typography className="CardViewTitle" variant="h5" component="h2">
                  <span>{this.props.intl.searchAndReplace(this.props.item.title)}</span>
                </Typography>
                <Typography className="CardViewSubtitle" variant="subtitle1" component="h3">
                  {this.props.intl.searchAndReplace(selectn('properties.dc:description', this.props.item))}
                </Typography>
              </div>

              <div
                style={{
                  position: 'absolute',
                  zIndex: this.state.showIntro ? 2 : -1,
                  top: '10px',
                  left: '10px',
                  width: '95%',
                  minWidth: 'auto',
                  padding: 0,
                  backgroundColor: '#fff',
                  height: '100%',
                  border: '1px solid #777777',
                  borderRadius: '0 0 10px 10px',
                }}
              >
                <IconButton
                  style={{ position: 'absolute', right: 0, zIndex: 1000 }}
                  onClick={() => this.setState({ showIntro: false })}
                >
                  <ClearIcon />
                </IconButton>

                {this.props.intl.searchAndReplace(introduction)}
              </div>
              <div className="CardViewCardActions">
                <button className="FlatButton" onClick={this.props.action.bind(this, this.props.item)} type="button">
                  <FVLabel
                    transKey="views.pages.dialect.learn.songs_stories.continue_to_entry"
                    defaultStr="Continue to Entry"
                    transform="words"
                  />
                </button>

                {(() => {
                  if (introduction) {
                    return (
                      <IconButton
                        style={{
                          verticalAlign: '-5px',
                          padding: '5px',
                          width: 'auto',
                          height: 'auto',
                          float: 'right',
                        }}
                        onClick={() => this.setState({ showIntro: !this.state.showIntro })}
                      >
                        <FlipToFrontIcon />
                      </IconButton>
                    )
                  }
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
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

export default connect(mapStateToProps)(BrowsingCardView)
