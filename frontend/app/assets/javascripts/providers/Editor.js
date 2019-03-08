import {FV_PORTAL_UPDATE_SUCCESS} from './FVPortal'

// UI
const DISMISS_ERROR = 'DISMISS_ERROR';

// Action Constants
const ENABLE_EDIT_MODE = 'ENABLE_EDIT_MODE';
const DISABLE_EDIT_MODE = 'DISABLE_EDIT_MODE';

// EDITING
const REQUEST_SAVE_FIELD = 'REQUEST_SAVE_FIELD';


/**
 * Actions: Represent that something happened
 */
const actions = {

    dismissError(error) {
        return {type: DISMISS_ERROR};
    },

    enableEditMode(field) {
        return {type: ENABLE_EDIT_MODE, field: field};
    },

    disableEditMode(field = null) {
        return {type: DISABLE_EDIT_MODE, field: field};
    }
}


/**
 * Reducers: Handle state changes based on an action
 */
const reducers = {

    computeEditMode(state = {initiatingField: null}, action) {

        let enabledField = {};
        enabledField[action.field] = true;
        switch (action.type) {
            case ENABLE_EDIT_MODE:
                return Object.assign({}, state, enabledField, {initiatingField: action.field});
            case DISABLE_EDIT_MODE:
                return Object.assign({}, state, {initiatingField: action.field});
            case FV_PORTAL_UPDATE_SUCCESS:
                console.log('success');
                let {[action.field]: deletedItem, ...rest} = Object.assign({}, state, {initiatingField: action.field}) // See http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35367927
                console.log(action.field);
                console.log(rest);
                return rest;
        }

        return state;
    },

    properties(state = null) {
        return state;
    },

    saveField(state = false, action) {
        switch (action.type) {
            case REQUEST_SAVE_FIELD:
                return !state;
        }

        return state;
    }
};

export default {actions, reducers};

