import {
    FETCH_CATALOG, FETCH_CATALOG_SUCCESS, FETCH_CATALOG_FAILURE,
    FETCH_REPOSITORY, FETCH_REPOSITORY_SUCCESS, FETCH_REPOSITORY_FAILURE
} from "./actions";
import {combineReducers} from "redux";

function catalog(state = {
    isFetching: false,
    didInvalidate: false,
    lastUpdated: null,
    repositories: []
}, action) {
    switch (action.type) {
        case FETCH_CATALOG:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case FETCH_CATALOG_SUCCESS:
            const {repositories, receivedAt} = action;
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: receivedAt,
                repositories
            });
        case FETCH_CATALOG_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true
            });
        default:
            return state
    }
}

function repositories(state = {}, action) {
    switch (action.type) {
        case FETCH_REPOSITORY:
        case FETCH_REPOSITORY_SUCCESS:
        case FETCH_REPOSITORY_FAILURE:
            const {name} = action;
            return Object.assign({}, state, {
                [name]: images(state[name], action)
            });
        default:
            return state
    }
}

function images(state = {
    isFetching: false,
    didInvalidate: false,
    lastUpdated: null,
    name: "",
    tags: []
}, action) {
    switch (action.type) {
        case FETCH_REPOSITORY:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case FETCH_REPOSITORY_SUCCESS:
            const {repository, receivedAt} = action;
            const {name, tags} = repository;
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: receivedAt,
                name, tags
            });
        case FETCH_REPOSITORY_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true
            });
        default:
            return state
    }
}

export const rootReducer = combineReducers({
    catalog, repositories
});