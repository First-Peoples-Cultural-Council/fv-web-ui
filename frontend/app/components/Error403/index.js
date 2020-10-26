import React from 'react'
import PropTypes from 'prop-types'
import NavigationHelpers from 'common/NavigationHelpers'

import '!style-loader!css-loader!./Error403.css'

const { object, string } = PropTypes
export class Error403 extends React.Component {
  static propTypes = {
    redirect: string,
    copy: object,
  }

  state = {
    copy: {},
  }

  async componentDidMount() {
    const copy =
      this.props.copy ||
      (await import(/* webpackChunkName: "Error403Copy" */ './copy').then((_module) => {
        return _module.default
      }))
    this.setState({
      copy,
    })
  }

  render() {
    const { copy } = this.state
    return (
      <div className="Error403">
        <h1 className="Error403__heading">{copy.heading}</h1>
        <div>
          <p>{copy.para1}</p>
          <p>
            <a
              className="RaisedButton RaisedButton--primary"
              style={{
                display: 'inline-flex',
                color: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
              href={`${NavigationHelpers.getBaseURL() + 'logout'}${
                this.props.redirect ? `?requestedUrl=..${this.props.redirect}` : ''
              }`}
            >
              {copy.loginBtn}
            </a>
            {copy.para2}
          </p>
        </div>
      </div>
    )
  }
}

export default Error403
