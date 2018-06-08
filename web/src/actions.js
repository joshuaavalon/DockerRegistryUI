import fetch from "cross-fetch";
import {message} from "antd";

export const FETCH_CATALOG = "FETCH_CATALOG";
export const FETCH_CATALOG_SUCCESS = "FETCH_CATALOG_SUCCESS";
export const FETCH_CATALOG_FAILURE = "FETCH_CATALOG_FAILURE";

export const FETCH_REPOSITORY = "FETCH_REPOSITORY";
export const FETCH_REPOSITORY_SUCCESS = "FETCH_REPOSITORY_SUCCESS";
export const FETCH_REPOSITORY_FAILURE = "FETCH_REPOSITORY_FAILURE";

export const DELETE_IMAGE_SUCCESS = "DELETE_IMAGE_SUCCESS";
export const DELETE_IMAGE_FAILURE = "DELETE_IMAGE_FAILURE";


export const INVALIDATE_CATALOG = "INVALIDATE_CATALOG";
export const INVALIDATE_REPOSITORY = "INVALIDATE_REPOSITORY";


function fetchCatalog() {
    return {type: FETCH_CATALOG}
}

function fetchCatalogSuccess(json) {
    const {repositories} = json;
    return {
        type: FETCH_CATALOG_SUCCESS,
        repositories,
        receivedAt: Date.now()
    }
}

function fetchCatalogFailure() {
    return {type: FETCH_CATALOG_FAILURE}
}

function invalidateCatalog() {
    return {type: INVALIDATE_CATALOG}
}

function fetchRepository(name) {
    return {type: FETCH_REPOSITORY, name}
}

function fetchRepositorySuccess(name, json) {
    return {
        type: FETCH_REPOSITORY_SUCCESS,
        name,
        repository: json,
        receivedAt: Date.now()
    }
}

function fetchRepositoryFailure(name) {
    return {type: FETCH_REPOSITORY_FAILURE, name}
}

function invalidateRepository(name) {
    return {type: INVALIDATE_REPOSITORY, name}
}

function deleteImageSuccess(name, digest) {
    return {type: DELETE_IMAGE_SUCCESS, name, digest}
}

function deleteImageFailure(name, digest) {
    return {type: DELETE_IMAGE_FAILURE, name, digest}
}

function shouldUpdateCatalog(state) {
    const {catalog} = state;
    if (!catalog) {
        return true;
    } else if (catalog.isFetching) {
        return false;
    } else if (!catalog.lastUpdated || (catalog.lastUpdated && catalog.lastUpdated - Date.now() > 60000)) { // 1 min
        return true;
    } else {
        return catalog.didInvalidate;
    }
}

function shouldUpdateRepository(state, name) {
    const {repositories} = state;
    if (!repositories || !repositories[name]) {
        return true;
    }
    const repository = repositories[name];
    if (repository.isFetching) {
        return false;
    } else if (!repository.lastUpdated || (repository.lastUpdated && repository.lastUpdated - Date.now() > 60000)) { // 1 min
        return true;
    } else {
        return repository.didInvalidate;
    }
}

function shouldRemoveImage(state, name, digest) {
    const {repositories} = state;
    return repositories && repositories[name];
}

export function loadCatalog() {
    return (dispatch, getState) => {
        if (shouldUpdateCatalog(getState())) {
            dispatch(fetchCatalog());
            return fetch("/catalog/")
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then(
                    json => {
                        dispatch(fetchCatalogSuccess(json));
                    },
                    error => {
                        console.log("An error occurred.", error);
                        dispatch(fetchCatalogFailure());
                    }
                )
        } else {
            return Promise.resolve();
        }
    }
}

export function loadRepository(name) {
    return (dispatch, getState) => {
        if (shouldUpdateRepository(getState(), name)) {
            dispatch(fetchRepository(name));
            return fetch(`/repository/${name}/`)
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then(
                    json => {
                        dispatch(fetchRepositorySuccess(name, json));
                    },
                    error => {
                        console.log("An error occurred.", error);
                        dispatch(fetchRepositoryFailure(name));
                    }
                )
        } else {
            return Promise.resolve();
        }
    }
}

export function removeImage(name, digest) {
    return (dispatch, getState) => {
        if (shouldRemoveImage(getState(), name, digest)) {
            return fetch(`/repository/${name}/${digest}/`, {method: "delete"})
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(
                    response => {
                        dispatch(deleteImageSuccess(name, digest));
                        message.success(`Delete success: ${digest}`);
                    },
                    error => {
                        console.log("An error occurred.", error);
                        dispatch(deleteImageFailure(name, digest));
                        message.error(`Delete failure: ${digest}`);
                    }
                )
                .then(() => {
                    dispatch(loadRepository(name));
                })
        } else {
            return Promise.resolve();
        }
    }
}

export function resetCatalog() {
    return (dispatch) => {
        dispatch(invalidateCatalog());
    }
}

export function resetRepository(name) {
    return (dispatch) => {
        dispatch(invalidateRepository(name));
    }
}