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
import PropTypes from 'prop-types';

import React, { Component } from 'react';

import Immutable, {List} from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import UIHelpers from 'common/UIHelpers';

import DOMPurify from 'dompurify';

import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';

import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import CanadaGeoJSON from 'json-loader!models/data/map.geojson';

import {Map, Marker, Popup, Tooltip, TileLayer, GeoJSON} from 'react-leaflet';

import L from 'leaflet';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
require('!style-loader!css-loader!leaflet/dist/leaflet.css');

const position = [64.4115405, -110.5384721];

const defaultStyle = {marginBottom: '20px'};

export default class Index extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            width: 800,
            height: 700,
            translate: [0, 0],
            scale: 1,
            zoom: 1,
            currentBounds: [[83.100354, -144.257421], [40.677028, -47.828260]]
        };

        //['_zoom'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    render() {

// maxBounds={[[83.100354, -144.257421], [40.677028, -47.828260]]}
// minZoom={2.2}
        return <Map center={position} zoom={this.state.zoom} bounds={this.state.currentBounds}>
            <GeoJSON
                style={function (feature) {
                    switch (selectn('properties.CODE', feature)) {
                        case 'BC':
                            return {color: "#ff0000"};
                        case 'YT':
                            return {color: "#0000ff"};
                    }
                }}
                onEachFeature={function (feature, layer) {
                    //layer.bindPopup('Hello world!');
                    layer.bindTooltip(selectn('properties.NAME', feature));
                    layer.on('click', function (e) {
                        //console.log(feature);
                        //console.log(e.target.getBounds());
                        this.setState({
                            //zoom: this.state.zoom * 2,
                            currentBounds: e.target.getBounds()
                        })
                    }.bind(this))
                }.bind(this)}
                data={CanadaGeoJSON}/>
            <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {(this.props.dialects || []).map(function (dialect, i) {

                let myIcon = L.icon({
                    iconUrl: UIHelpers.getThumbnail(selectn('contextParameters.portal.fv-portal:logo', dialect), 'Thumbnail') || '/assets/images/cover.png',
                    iconSize: [25, 25],
                });

                let location = '';
                let region = selectn('contextParameters.ancestry.dialect.fvdialect:region', dialect);
                let country = selectn('contextParameters.ancestry.dialect.fvdialect:country', dialect);
                let coords = selectn('properties.fv-portal:map_marker_coords', dialect).split(',').map((v) => parseInt(v));

                if (country && region) {
                    location = region + ', ' + country;
                } else if (region) {
                    location = region;
                }

                if (coords.length > 1) {
                    return <Marker key={i} icon={myIcon} position={coords}>
                        <Popup>
                            <span>{selectn('contextParameters.ancestry.dialect.dc:title', dialect)}<br/>{location}<br/><a
                                href={"/explore" + selectn('contextParameters.ancestry.dialect.path', dialect)}>{intl.trans('views.components.go_to_dialect', 'Go to dialect', 'first')}</a></span>
                        </Popup>
                    </Marker>;
                }

            })}

        </Map>;
    }
}