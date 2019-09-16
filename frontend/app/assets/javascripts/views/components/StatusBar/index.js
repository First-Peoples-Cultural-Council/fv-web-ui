import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'

export default class StatusBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  // componentDidUpdate() {
  // if (this.state.open !== true) {
  //   this.setState({
  //     open: true,
  //   })
  // }
  // }

  render() {
    if (this.props.message) {
      return (
        <div>
          <Snackbar
            open={this.state.open}
            message={this.props.message}
            autoHideDuration={5000}
            onClose={this.handleRequestClose}
          />
        </div>
      )
    }
    return <div />
  }
}
