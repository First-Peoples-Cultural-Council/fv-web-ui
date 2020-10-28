import React, { Component } from 'react'
import selectn from 'selectn'
import { withTheme } from '@material-ui/core/styles'

export class TextHeader extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const primary1Color = selectn('theme.palette.primary1Color', this.props)
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
          }
        })()}

        <hr style={sectionHrStyle} />
      </div>
    )
  }
}

export default withTheme(TextHeader)
