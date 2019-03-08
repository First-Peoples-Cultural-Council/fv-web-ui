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

import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

export default {
    renderComplexArrayRow(dataItems = [], render) {
        let rows = [];

        dataItems.map(function (entry, i) {
            rows.push(render(entry, i));
        });

        return <ol style={{
            'fontSize': '0.9em',
            'margin': 0,
            'padding': (rows.length == 1) ? '0' : '0 15px',
            'listStyle': (rows.length == 1) ? 'none' : 'decimal'
        }}>
            {rows}
        </ol>;
    },
    getPreferenceVal(key, preferences) {
        return selectn('preferences.values.' + key + '.' + selectn(key, preferences), ConfGlobal);
    },
    getThumbnail(imgObj, view = 'Thumbnail', returnObj = false) {

        let i = 0;

        switch (view) {
            case 'Thumbnail':
                i = 0;
                break;

            case 'Small':
                i = 1;
                break;

            case 'Medium':
                i = 2;
                break;

            case 'OriginalJpeg':
                i = 3;
                break;
        }

        if (selectn('views[' + i + ']', imgObj)) {
            return (returnObj) ? selectn('views[' + i + ']', imgObj) : selectn('views[' + i + '].url', imgObj);
        } else if (selectn('properties.picture:views[' + i + ']', imgObj)) {
            return (returnObj) ? selectn('properties.picture:views[' + i + ']', imgObj) : selectn('properties.picture:views[' + i + '].content.data', imgObj);
        } else if (selectn('properties.file:content.data', imgObj)) {
            return (returnObj) ? selectn('properties.file:content.data', imgObj) : selectn('properties.file:content.data', imgObj);
        } else if (selectn('path', imgObj)) {
            return ConfGlobal.baseURL + selectn('path', imgObj).replace("nxfile", "nxpicsfile").replace("file:", view + ":");
        } else if (selectn('data', imgObj)) {
            return selectn('data', imgObj);
        }

        return '/assets/images/cover.png';
    },
    playAudio(state, stateFunc, audioUrl, e) {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        let audioItem = new Audio(audioUrl);

        if (state.nowPlaying != null) {
            state.nowPlaying.pause();
            state.currentTime = 0;
        }

        stateFunc({
            nowPlaying: audioItem
        });

        audioItem.play();

        audioItem.onended = function () {
            stateFunc({
                nowPlaying: null
            });
        };

        return false;
    },
    stopAudio(state, stateFunc, e) {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (state.nowPlaying != null) {
            state.nowPlaying.pause();
            state.currentTime = 0;

            stateFunc({
                nowPlaying: null
            });
        }

        return false;
    },
    isViewSize(size) {
        switch (size) {
            case 'xs':
                return window.innerWidth <= 420
                break;
        }

        return false;
    }
}