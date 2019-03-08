// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

/**
 * Single Document Actions
 */
const DIRECTORY_FETCH_START = "DIRECTORY_FETCH_START";
const DIRECTORY_FETCH_SUCCESS = "DIRECTORY_FETCH_SUCCESS";
const DIRECTORY_FETCH_ERROR = "DIRECTORY_FETCH_ERROR";

const fetchDirectory = function fetchDirectory(name, headers) {
    return function (dispatch) {

        dispatch({type: DIRECTORY_FETCH_START});

        return DirectoryOperations.getDirectory(name, {headers: headers})
            .then((response) => {

                let options = response.map(function (directoryEntry) {
                    return {value: directoryEntry.properties.id, text: directoryEntry.properties.label};
                });

                let directories = {};
                directories[name] = options;

                dispatch({type: DIRECTORY_FETCH_SUCCESS, directories: directories, directory: name})

            }).catch((error) => {
                dispatch({type: DIRECTORY_FETCH_ERROR, error: error})
            });
    }
};

const actions = {fetchDirectory};

const reducers = {
    computeDirectory(state = {isFetching: false, directories: {}, directory: null, success: false}, action) {
        switch (action.type) {
            case DIRECTORY_FETCH_START:
                return Object.assign({}, state, {isFetching: true, success: false, directory: action.name});
                break;

            case DIRECTORY_FETCH_SUCCESS:
                return Object.assign({}, state, {
                    directories: Object.assign(state.directories, action.directories),
                    directory: action.name,
                    isFetching: false,
                    success: true
                });
                break;

            case DIRECTORY_FETCH_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    directory: action.name
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false, directory: action.name});
                break;
        }
    }
};

const middleware = [thunk];

export default {actions, reducers, middleware};