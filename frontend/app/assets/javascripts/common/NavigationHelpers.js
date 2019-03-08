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

import selectn from 'selectn';

const arrayPopImmutable = function (array, sizeToPop = 1) {
    return array.slice(0, array.length - sizeToPop);
}

export default {
    // Navigate to an absolute path, possibly URL encoding the last path part
    // If no NavigationFunc is provided, will return the path
    navigate: function (path, navigationFunc, encodeLastPart = false) {
        let pathArray = path.split('/');

        if (encodeLastPart) {
            pathArray[pathArray.length - 1] = encodeURIComponent(pathArray[pathArray.length - 1]);
        }

        let transformedPath = pathArray.join('/');

        if (!navigationFunc) {
            return transformedPath;
        } else {
            navigationFunc(transformedPath);
        }
    },
    // Navigate up by removing the last page from the URL
    navigateUp: function (currentPathArray, navigationFunc) {
        navigationFunc('/' + arrayPopImmutable(currentPathArray).join('/'));
    },
    // Navigate forward, replacing the current page within the URL
    navigateForwardReplace: function (currentPathArray, forwardPathArray, navigationFunc) {
        navigationFunc('/' + arrayPopImmutable(currentPathArray).concat(forwardPathArray).join('/'));
    },
    // Navigate forward, replacing the current page within the URL
    navigateForwardReplaceMultiple: function (currentPathArray, forwardPathArray, navigationFunc) {
        navigationFunc('/' + arrayPopImmutable(currentPathArray, forwardPathArray.length).concat(forwardPathArray).join('/'));
    },
    // Navigate forward by appending the forward path
    navigateForward: function (currentPathArray, forwardPathArray, navigationFunc) {
        navigationFunc('/' + currentPathArray.concat(forwardPathArray).join('/'));
    },
    // Navigate back to previous page
    navigateBack: function () {
        window.history.back();
    },
    // Generate a UID link from a Nuxeo document path
    generateUIDPath: function (theme, item, pluralPathId) {
        let path = '/' + theme + selectn('path', item);
        let type = selectn('type', item);

        switch (pluralPathId) {
            case "words":
            case "phrases":
                path = path.replace("/Dictionary/", "/learn/" + pluralPathId + "/");
            break;

            case "songs-stories":
            case "songs":
            case "stories":
                path = path.replace("/Stories & Songs/", "/learn/" + pluralPathId + "/");
            break;

            case "gallery":
                path = path.replace("/Portal/", "/" + pluralPathId + "/");
            break;

            case "media":
                // Resources can be in folders, so ensure everything after 'Resources' is ignored
                path = path.substring(0, path.lastIndexOf("/Resources/") + 11);
                path = path.replace("/Resources/", "/" + pluralPathId + "/");
            break;
        }

        return path = path.substring(0, path.lastIndexOf("/") + 1) + selectn('uid', item);
    },
    // Disable link
    disable: function (event) {
        event.preventDefault();
    }
}