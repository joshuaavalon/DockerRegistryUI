import React from "react";
import thunkMiddleware from "redux-thunk";
import ReactDOM from "react-dom";
import App from "./App";
import {createStore, applyMiddleware, compose} from "redux"
import {rootReducer} from "./reducers";
import {Provider} from "react-redux";
import * as serviceWorker from "./serviceWorker";

let composeEnhancers;
// noinspection JSUnresolvedVariable
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // noinspection JSUnresolvedVariable
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
    composeEnhancers = compose;
}
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();