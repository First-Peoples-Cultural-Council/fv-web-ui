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
import classNames from 'classnames';
import provide from 'react-redux-provide';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import DocumentOperations from 'operations/DocumentOperations';
import DocumentListView from 'views/components/Document/DocumentListView';

import CircularProgress from 'material-ui/lib/circular-progress';
import Doughnut from 'react-chartjs/lib/doughnut';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

@provide
export default class PageDialectReports extends React.PureComponent {

  static propTypes = {
	  pushWindowPath: PropTypes.func.isRequired,	  
	  splitWindowPath: PropTypes.array.isRequired,
  	  fetchReportDocuments: PropTypes.func.isRequired,
      computeReportDocuments: PropTypes.object.isRequired,
  	  fetchReportWordsAll: PropTypes.func.isRequired,
      computeReportWordsAll: PropTypes.object.isRequired,  	  
      fetchReportPhrasesAll: PropTypes.func.isRequired,
      computeReportPhrasesAll: PropTypes.object.isRequired,
      windowPath: PropTypes.string.isRequired,
      fetchReportSongsAll: PropTypes.func.isRequired,
      computeReportSongsAll: PropTypes.object.isRequired,
      fetchReportStoriesAll: PropTypes.func.isRequired,
      computeReportStoriesAll: PropTypes.object.isRequired
  };	
	
  constructor(props, context){
	  
	  super(props, context);
 
	    this.state = {
	      path : this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 1).join('/'),
	      queryName : '',
	      queryAppend : ''
	    };	  
	    // Bind methods to 'this'
	    ['_handleQueryDataRequest', '_handleRefetch', '_buildColumns', '_resetQueryData', '_onEntryNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) ); 
  }

  fetchData(newProps) {
	  // Retrieve the total number of words, phrases, songs and stories
	  newProps.fetchReportWordsAll(this.state.path);
	  newProps.fetchReportPhrasesAll(this.state.path);	  
	  newProps.fetchReportSongsAll(this.state.path);
	  newProps.fetchReportStoriesAll(this.state.path);	  
  }

  // Fetch data on initial render
  componentDidMount() {
	  this.fetchData(this.props);
  }
  
  _handleQueryDataRequest(queryName, queryAppend, dataGridProps) {	  
	this.state.queryName = queryName;
	this.state.queryAppend = queryAppend;
		
	let page = DEFAULT_PAGE;
	let pageSize = DEFAULT_PAGE_SIZE;
	if(dataGridProps.page != undefined) {
		page = dataGridProps.page;
	}
	if(dataGridProps.pageSize != undefined) {
		pageSize = dataGridProps.pageSize;
	}	

	this._buildColumns();  	
	this.props.fetchReportDocuments(this.state.path, this.state.queryAppend, page, pageSize);
  }  

  _handleRefetch(dataGridProps, page, pageSize) {
	
	this._buildColumns();  	  
	this.props.fetchReportDocuments(this.state.path, this.state.queryAppend, page, pageSize);
  }  
  
  // Render different columns based on the doctype in the query
  _buildColumns() {
	  if(this.state.queryAppend.indexOf("ecm:primaryType='FVWord'") != -1) {
		  this.state.queryDocType = "words";
		  this.state.columns = [
		    { name: 'title', title: 'Word', render: function(v, data, cellProps) { return v; }}
		  ]	 		  
	  }
	  else if(this.state.queryAppend.indexOf("ecm:primaryType='FVPhrase'") != -1) {
		  this.state.queryDocType = "phrases";		  
		  this.state.columns = [
		    { name: 'title', title: 'Phrase', render: function(v, data, cellProps) { return v; }}
		  ]
	  }
	  else if(this.state.queryAppend.indexOf("fvbook:type='song'") != -1) {
		  this.state.queryDocType = "songs";
		  this.state.columns = [
		    { name: 'title', title: 'Song', render: function(v, data, cellProps) { return v; }}
		  ]
	  }
	  else if(this.state.queryAppend.indexOf("fvbook:type='story'") != -1) {
		  this.state.queryDocType = "stories";
		  this.state.columns = [
		    { name: 'title', title: 'Story', render: function(v, data, cellProps) { return v; }}
		  ]
	  }		  
  }

  _resetQueryData() {
	  this.setState({queryDocType: '', queryName: '', queryAppend: ''});
  }
  
  _onEntryNavigateRequest(item) {

  	let addPath = '';
    let splitPath = item.path.split('/');

    switch(item.type) {
    	case 'FVWord':
    		addPath = '/learn/words/';
    	break;

    	case 'FVPhrase':
    		addPath = '/learn/phrases/';
    	break;

    	case 'FVBook':
    		addPath = '/learn/songs-stories/';
    	break;
    }

    this.props.pushWindowPath('/explore/' + this.state.path + addPath + splitPath[splitPath.length - 1]);
  }

  _generateDocTypeDoughnutData(wordsCount, phrasesCount, songsCount, storiesCount) {
	    let doughnutData = [];
	    doughnutData.push({ value: wordsCount, color: "#949FB1", highlight: "#A8B3C5", label: "Words" });      
	    doughnutData.push({ value: phrasesCount, color: "#FDB45C", highlight: "#FFC870", label: "Phrases" });   
	    doughnutData.push({ value: songsCount, color: "#46BFBD", highlight: "#5AD3D1", label: "Songs" }),
	    doughnutData.push({ value: storiesCount, color:"#F7464A", highlight: "#FF5A5E", label: "Stories" })   
	    return doughnutData;
  }   
  
  _generateTwoSliceDoughnutData(total, subset, labels) {
	    let doughnutData = [];
	    //let total = this.state.totalCounts[this.state.queryDocType];
	    let totalMinusSubset = total - subset;
	    doughnutData.push({ value: subset, color: "#46BFBD", highlight: "#5AD3D1", label: labels[1] });
	    doughnutData.push({ value: totalMinusSubset, color:"#F7464A", highlight: "#FF5A5E", label: labels[0] });
	    return doughnutData;
  }   
  
  render() {

	const { computeReportDocuments, computeReportWordsAll, computeReportPhrasesAll, computeReportSongsAll, computeReportStoriesAll } = this.props;

	if(computeReportWordsAll.isFetching || computeReportPhrasesAll.isFetching || computeReportSongsAll.isFetching || computeReportStoriesAll.isFetching) {
		return <CircularProgress mode="indeterminate" size={3} />;
	}	
	
	if(!computeReportWordsAll.success || !computeReportPhrasesAll.success || !computeReportSongsAll.success || !computeReportStoriesAll.success) {
		return <CircularProgress mode="indeterminate" size={3} />;
	}	

	let wordsCount = computeReportWordsAll.response.resultsCount;
	let phrasesCount = computeReportPhrasesAll.response.resultsCount;
	let songsCount = computeReportSongsAll.response.resultsCount;
	let storiesCount = computeReportStoriesAll.response.resultsCount;
	
	// If a report has been selected, display the query results
	if(this.state.queryName != '') {		
		if(computeReportDocuments.isFetching || !computeReportDocuments.success) {
			return <CircularProgress mode="indeterminate" size={3} />;
		}
        let docTypeCount;
		if(this.state.queryDocType == 'words') {
			docTypeCount = wordsCount;
        }
        else if(this.state.queryDocType == 'phrases') {
			docTypeCount = phrasesCount;        	
        }
        else if(this.state.queryDocType == 'songs') {
			docTypeCount = songsCount;        	
        }
        else if(this.state.queryDocType == 'stories') {
			docTypeCount = storiesCount;       	
        }        
		let doughnutData = this._generateTwoSliceDoughnutData(docTypeCount, computeReportDocuments.response.resultsCount, ["Other " + this.state.queryDocType, this.state.queryName]);		
		
		return <div className="row">
	        <div className="col-xs-12">
		        <h1>Reports - {this.state.queryName}</h1>
		        <a onTouchTap={this._resetQueryData}>Reset query data</a>
		        		    	
                <div className="col-xs-12">
	                <div className="col-xs-2 col-xs-offset-4">
			    		<Doughnut data={doughnutData} />		    			      		 
	    		    </div>
	                <div className="col-xs-2">
	                	{doughnutData.map((slice, i) =>
	  	    		  		<div key={slice.label}><span className={'glyphicon glyphicon-stop'} style={{color: slice.color}} /> {slice.label}: {slice.value}</div>
	    		    	)}	                                  	
	                </div>
	            </div>		    	
		    	
                <div className="col-xs-12">
			        <DocumentListView
			          data={this.props.computeReportDocuments}
			          refetcher={this._handleRefetch}
			          onSelectionChange={this._onEntryNavigateRequest}
			          columns={this.state.columns}
			          className="browseDataGrid" />
		        </div>
	       </div>
       </div>  
	}
	
	// If no report selected, display the reports index view	
	let docTypeDoughnutData = this._generateDocTypeDoughnutData(wordsCount, phrasesCount, songsCount, storiesCount);	
	
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Reports</h1>
                
                <div className="col-xs-12">
	                <div className="col-xs-2 col-xs-offset-4">
	                	<Doughnut data={docTypeDoughnutData} />
	    		    </div>
	                <div className="col-xs-2">
	                	{docTypeDoughnutData.map((slice, i) =>
	  	    		  		<div key={slice.label}><span className={'glyphicon glyphicon-stop'} style={{color: slice.color}} /> {slice.label}: {slice.value}</div>
	    		    	)}	                                  	
	                </div>
                </div>
                
                <div className="col-xs-3">
                	<h2>Words: {wordsCount}</h2>
                	<List>
            			<ListItem primaryText="List of words in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "Words in new status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New'")} />               	
                		<ListItem primaryText="List of words in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Words in enabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled'")} />
                		<ListItem primaryText="List of words in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "Words in published status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published'")} />
                		<ListItem primaryText="List of words in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Words in disabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled'")} />           			
                		
                		<ListItem primaryText="List of words without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without audio", " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of words without images" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without images", " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of words without video" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without video", " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL")} />
                		<ListItem primaryText="List of words without source" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without source", " AND ecm:primaryType='FVWord' AND fv:source/* IS NULL")} />               		

                		<ListItem primaryText="List of words without categories" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without categories", " AND ecm:primaryType='FVWord' AND fv-word:categories/* IS NULL")} />               		         		                		
                		<ListItem primaryText="List of words without part of speech" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without part of speech", " AND ecm:primaryType='FVWord' AND fv-word:part_of_speech=''")} />               		
                		<ListItem primaryText="List of words without pronunciation" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without pronunciation", " AND ecm:primaryType='FVWord' AND fv-word:pronunciation=''")} />               		
                		<ListItem primaryText="List of words without related phrases" onTouchTap={this._handleQueryDataRequest.bind(this, "Words without related phrases", " AND ecm:primaryType='FVWord' AND fv-word:related_phrases/* IS NULL")} />               		         		
                		
            			<ListItem primaryText="List of words in children's archive" onTouchTap={this._handleQueryDataRequest.bind(this, "Words in children's archive", " AND ecm:primaryType='FVWord' AND fv:available_in_childrens_archive=1" )} />               	
            		</List>

                </div>
	            <div className="col-xs-3">
                	<h2>Phrases: {phrasesCount}</h2>
                	<List>
                		<ListItem primaryText="List of phrases in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases in new status", " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='New'")} />               	
                		<ListItem primaryText="List of phrases in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases in enabled status", " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Enabled'")} />               	
                		<ListItem primaryText="List of phrases in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases in published status", " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Published'")} />               	
                		<ListItem primaryText="List of phrases in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases in disabled status", " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Disabled'")} />               	
                	
                		<ListItem primaryText="List of phrases without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases without audio", " AND ecm:primaryType='FVPhrase' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of phrases without images" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases without images", " AND ecm:primaryType='FVPhrase' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of phrases without video" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases without video", " AND ecm:primaryType='FVPhrase' AND fv:related_videos/* IS NULL")} />
                		<ListItem primaryText="List of phrases without source" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases without source", " AND ecm:primaryType='FVPhrase' AND fv:source/* IS NULL")} />               		
                	
                		<ListItem primaryText="List of phrases without phrase books" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases without phrase books", " AND ecm:primaryType='FVPhrase' AND fv-phrase:phrase_books/* IS NULL")} />               		         		                		                		
            			
                		<ListItem primaryText="List of phrases in children's archive" onTouchTap={this._handleQueryDataRequest.bind(this, "Phrases in children's archive", " AND ecm:primaryType='FVPhrase' AND fv:available_in_childrens_archive=1" )} />               	               		
                	</List>
                </div>
		        <div className="col-xs-3">
                	<h2>Songs: {songsCount}</h2>
                	<List>
            			<ListItem primaryText="List of songs in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs in new status", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='New'")} />               	
            			<ListItem primaryText="List of songs in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs in enabled status", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Enabled'")} />               	
            			<ListItem primaryText="List of songs in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs in pubilshed status", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Published'")} />               	
            			<ListItem primaryText="List of songs in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs in disabled status", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND ecm:currentLifeCycleState='Disabled'")} />               	

                		<ListItem primaryText="List of songs without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs without audio", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of songs without images" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs without images", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of songs without video" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs without video", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:related_videos/* IS NULL")} />
                		<ListItem primaryText="List of songs without source" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs without source", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:source/* IS NULL")} />               		                		

                		<ListItem primaryText="List of songs in children's archive" onTouchTap={this._handleQueryDataRequest.bind(this, "Songs in children's archive", " AND ecm:primaryType='FVBook' AND fvbook:type='song' AND fv:available_in_childrens_archive=1" )} />               	               		                		
            		</List>                	
                </div>
			    <div className="col-xs-3">
                	<h2>Stories: {storiesCount}</h2>
                	<List>
        				<ListItem primaryText="List of stories in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories in new status", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='New'")} />               	
        				<ListItem primaryText="List of stories in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories in enabled status", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Enabled'")} />               	
        				<ListItem primaryText="List of stories in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories in published status", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Published'")} />               	
        				<ListItem primaryText="List of stories in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories in disabled status", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND ecm:currentLifeCycleState='Disabled'")} />               	

                		<ListItem primaryText="List of stories without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories without audio", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of stories without images" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories without images", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of stories without video" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories without video", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:related_videos/* IS NULL")} />
                		<ListItem primaryText="List of stories without source" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories without source", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:source/* IS NULL")} />         				

                		<ListItem primaryText="List of stories in children's archive" onTouchTap={this._handleQueryDataRequest.bind(this, "Stories in children's archive", " AND ecm:primaryType='FVBook' AND fvbook:type='story' AND fv:available_in_childrens_archive=1" )} />               	               		                		       			
                	</List>                 	
                </div>		                
              </div>
            </div>
        </div>;	
	}
}