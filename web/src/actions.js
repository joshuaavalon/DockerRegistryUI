import fetch from "cross-fetch";

export const FETCH_CATALOG = "FETCH_CATALOG";
export const FETCH_CATALOG_SUCCESS = "FETCH_CATALOG_SUCCESS";
export const FETCH_CATALOG_FAILURE = "FETCH_CATALOG_FAILURE";

export const FETCH_REPOSITORY = "FETCH_REPOSITORY";
export const FETCH_REPOSITORY_SUCCESS = "FETCH_REPOSITORY_SUCCESS";
export const FETCH_REPOSITORY_FAILURE = "FETCH_REPOSITORY_FAILURE";


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

function shouldUpdateCatalog(state) {
    const {catalog} = state;
    if (!catalog) {
        return true;
    } else if (catalog.isFetching) {
        return false;
    } else if (!catalog.lastUpdated || (catalog.lastUpdated && catalog.lastUpdated - Date.now() > 60000)) { // 1 min
        return true;
    }
    else {
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

export function loadCatalog(force=false) {
    return (dispatch, getState) => {
        if (force ||shouldUpdateCatalog(getState())) {
            dispatch(fetchCatalog());
            return fetch("http://localhost/catalog/")
                .then(
                    response => {
                        Promise.resolve(response.json())
                            .then(json => {
                                dispatch(fetchCatalogSuccess(json));
                            });
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

export function loadRepository(name, force=false) {
    return (dispatch, getState) => {
        if (force || shouldUpdateRepository(getState(), name)) {
            dispatch(fetchRepository(name));
            return fetch(`http://localhost/repository/${name}/`)
                .then(
                    response => {
                        Promise.resolve(response.json())
                            .then(json => {
                                dispatch(fetchRepositorySuccess(name, json));
                            });
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