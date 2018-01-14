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
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import provide from 'react-redux-provide';
import selectn from 'selectn';

// Components
import Popover from 'material-ui/lib/popover/popover';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import ActionExitToAppIcon from 'material-ui/lib/svg-icons/action/exit-to-app';

import CircularProgress from 'material-ui/lib/circular-progress';

@provide
export default class Login extends Component {

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    computeLogout: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    routeParams: PropTypes.object
  };

  componentDidUpdate(prevProps) {
    //if (prevProps.userStore.currentUser !== this.props.userStore.currentUser) {
    //  this._handleClose();
    //}
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      loginAttempted: false,
      loginAttemptCleared: false
    };

    this.anchorEl = null;

    ['_handleOpen','_handleClose','_handleLogin','_handleLogout','_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _handleOpen(event){

    event.preventDefault();

    this.setState({
      open: true
    });
  }

  _handleClose(){
    this.setState({
      open: false
    });
  }

  _handleLogin() {

    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    
    if ( username !== null && password !== null) {
      this.setState({loginAttempted: true});
      this.props.login(username, password);
    }

    this._handleClose();
  }

  _handleLogout() {

    this.setState({loginAttempted: false});
    this.props.logout();
  }

  _onNavigateRequest(path) {

    let dest = '/' + path + '/';

    if (selectn("routeParams.dialect_path", this.props) && path === 'register') {
      dest = '/explore' + this.props.routeParams.dialect_path + '/' + path;
    }

    this._handleClose();
    this.props.pushWindowPath(dest);
  }

  render() {

    const themePalette = this.props.properties.theme.palette.rawTheme.palette;
    const TextFieldStyle = { border: '1px solid', borderColor: '#a2291d', width: '100%', paddingLeft: '5px', height: '34px', lineHeight: '10px', fontSize: '14px' };

    let loginFeedbackMessage = "";

    if (this.props.computeLogin.isFetching || this.props.computeLogout.isFetching) {
      return <div style={{display: "inline-block", paddingRight: "10px", color: '#fff'}}>Processing request...</div>;
    }

    // Handle success (anonymous or actual)
    if (this.props.computeLogin.success && this.props.computeLogin.isConnected) {
        return (
          <div className="hidden-xs" style={{display: "inline-block", paddingRight: '15px'}}>
            WELCOME, <a style={{color: '#fff', textTransform: 'uppercase', cursor: 'pointer'}} onTouchTap={this._onNavigateRequest.bind(this, 'profile')}>{selectn("response.properties.firstName", this.props.computeLogin)}</a>
          </div>
        );
    } else {
      if (this.state.loginAttempted) {
          loginFeedbackMessage = "Username or password incorrect.";

        if (this.props.computeLogin.isError) {
          loginFeedbackMessage = this.props.computeLogin.error;
        }
      }
    }

    return (
      <div style={{display: "inline-block", paddingTop: '15px', maxWidth: '205px'}}>
        <FlatButton ref={(el)=>{this.anchorEl = el}}  label={this.props.label} style={{color: themePalette.alternateTextColor}} onTouchTap={this._handleOpen} />

        <Popover open={this.state.open}
          anchorEl={ReactDOM.findDOMNode(this.anchorEl)}
          useLayerForClickAway={false}
          style={{marginTop: '-14px', backgroundColor: 'transparent', boxShadow: 'none'}}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
          onRequestClose={this._handleClose}>

          <div style={{width: '205px'}}>

            <img style={{position: 'relative', top: '14px', zIndex: 999999, left: '65%'}} src="/assets/images/popover-arrow.png" alt="" />

            <div style={{backgroundColor: '#fff', padding:'10px', width: '100%'}}>
              <h6>Sign In Below <a style={{cursor: 'pointer', fontWeight: 100}} onTouchTap={this._onNavigateRequest.bind(this, 'forgotpassword')} className="pull-right">Forgot?</a></h6>

              <div><TextField style={Object.assign({}, TextFieldStyle, {margin: '15px 0'})} underlineShow={false} ref="username" hintText="Username" /></div>
              <div><TextField style={TextFieldStyle} underlineShow={false} ref="password" type="password" hintText="Password" /></div>

              <p style={{margin: '10px 0', fontSize: '12px', backgroundColor: themePalette.primary4ColorLightest, padding: '0 3px'}}>{loginFeedbackMessage}</p>

              <RaisedButton style={{width: '100%'}} secondary={true} onTouchTap={this._handleLogin} label="Sign in"/>

              <h6 style={{fontWeight: 500, paddingTop: '10px'}}>New to FirstVoices?</h6>

              <RaisedButton style={{width: '100%'}} primary={true} onTouchTap={this._onNavigateRequest.bind(this, 'register')} label="Register"/>
            </div>

          </div>

        </Popover>

      </div>
    );
  }
}