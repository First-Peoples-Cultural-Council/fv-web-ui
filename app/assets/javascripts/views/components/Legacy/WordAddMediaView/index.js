var PropTypes = require('prop-types');
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
var React = require('react');
var t = require('tcomb-form');
var Form = t.form.Form;

var _ = require('underscore');

var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var Word = require('models/Word');

class MediaUploader extends React.PureComponent {

  constructor(props) {
    super(props);

    this._change = this._change.bind(this);
    this._save = this._save.bind(this);

    var schema = t.struct({
      'file': t.form.File
    });

    this.state = {
      uploading: false,
      schema: schema,
      options: {
        fields: {
          'file': {
            label: 'File',
            type: 'file'
          }
        },
        config: {
          horizontal: {
            md: [3, 9],
            sm: [6, 6]
          }
        }
      },
      word: props.word,
    };
  }

  _change(value) {
    this.setState({value});
  }

  _save(evt) {

    this.setState({'uploading': true});

    var client = this.state.word.get('client');
    var value = this.refs.form.getValue();

    var self = this;

    // if validation fails, value will be null
    if (value) {
      var tempFileObj;
      var fd = new FormData();

      for (var k in value) {
        var v = value[k];
        if (t.form.File.is(v)) {
          fd.append(k, v, v.name);
          tempFileObj = v;
        } else {
          fd.append(k, v);
        }
      }

      var request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          var jsonResponse = JSON.parse(request.responseText);
          var nuxeoType = "File";

          switch(tempFileObj.type.substring(0, tempFileObj.type.indexOf('/'))) {
            case "image":
              nuxeoType = "Picture";
            break;
            case "audio":
              nuxeoType = "Audio";
            break;
            case "video":
              nuxeoType = "Video";
            break;
          }

          client.operation('Document.Create')
           .params({
             type: nuxeoType,
             name: tempFileObj.name,
           })
           .param('properties',
              {
                "dc:title": tempFileObj.name,
                "file:content": {"upload-batch":jsonResponse.batchId,"upload-fileId":"0"}
              }
            )
           .input(self.state.word.get('id'))
           .execute(function(error, doc) {
             if (error) {
               throw error;
             }

             location.reload();

           });
        }
      }

      request.open("POST", client._baseURL + "/site/automation/batch/upload");
      request.setRequestHeader("X-Batch-Id", 'batch-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000));
      request.setRequestHeader("X-File-Idx", 0);
      request.setRequestHeader("authorization", "Basic d2ViYXBwOjB2dldYMDlwNngwYTgzUw==");
      request.setRequestHeader("X-File-Name", encodeURIComponent(tempFileObj.name));
      request.setRequestHeader("X-File-Size", tempFileObj.size);
      request.setRequestHeader("X-File-Type", tempFileObj.type);
      request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      request.setRequestHeader("Content-Type", "binary/octet-stream");
      request.send(tempFileObj);
   }

   evt.preventDefault();    
  }

  render() {
    var form = "";

    if (this.state.schema != undefined){
     form = <form onSubmit={this._save} id="myForm" encType="multipart/form-data">
            <Form
              ref="form"
              options={this.state.options}
              type={this.state.schema} 
              value={this.state.value}
              onChange={this._change} />
              <button type="submit" className={classNames('btn', 'btn-primary')}>Upload Media</button>
          </form>;
    }

    var uploadText = "";

    if (this.state.uploading) {
      uploadText = <div className={classNames('alert', 'alert-info')} role="alert">Uploading... Please be patient...</div>
    }

      return (
        <div className="form-horizontal">
          {uploadText}
          {form}
        </div>
      );
    }
}

class WordAddMediaView extends React.PureComponent {

  constructor(props) {
    super(props);

   this.state = {
      word: props.word
   };

  }

  render() {

    return <div>
      <MediaUploader
        client={this.props.client}
        router={this.props.router}
        word={this.state.word} />
    </div>;
  }


}

WordAddMediaView.contextTypes = {
  router: PropTypes.func
};

module.exports = WordAddMediaView;