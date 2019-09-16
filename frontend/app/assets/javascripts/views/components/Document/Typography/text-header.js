import React, { Component } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import { withTheme } from '@material-ui/core/styles'

export class TextHeader extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const primary1Color = selectn('theme.v0.palette.primary1Color', this.props)
    const sectionHrStyle = { backgroundColor: primary1Color, width: '100%', height: '2px', margin: '0 0 10px 0' }

    return (
      <div>
        {(() => {
          switch (this.props.tag) {
            case 'h2':
              return (
                <h2 style={{ margin: '15px 0 10px 0' }}>
                  {this.props.title} {this.props.appendToTitle}
                </h2>
              )
              break

            default:
              return (
                <h1
                  style={{
                    fontWeight: 500,
                    margin: '15px 0 10px 0',
                  }}
                >
                  {this.props.title} {this.props.appendToTitle}
                </h1>
              )
              break
          }
        })()}

        <hr style={sectionHrStyle} />
      </div>
    )
  }
}

export default withTheme()(TextHeader)
