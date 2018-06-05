import React, {Component} from "react";
import {Route, BrowserRouter, Redirect} from "react-router-dom";
import {Page, CatalogPage, RepositoryPage} from "./page";
import "./App.css"

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Page>
                    <Route exact path="/" component={CatalogPage}/>
                    <Route exact path="/registry" render={() => (<Redirect to="/"/>)}/>
                    <Route exact path="/registry/:repository" component={RepositoryPage}/>
                </Page>
            </BrowserRouter>
        );
    }
}

export default App;
