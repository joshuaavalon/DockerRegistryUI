import React, {Component} from "react";
import {Route, BrowserRouter, Redirect, Switch} from "react-router-dom";
import {Page, CatalogPage, RepositoryPage} from "./page";
import "./App.css"

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Page>
                    <Switch>
                        <Route exact path="/" component={CatalogPage}/>
                        <Route exact path="/registry/:repository" component={RepositoryPage}/>
                        <Redirect to="/"/>
                    </Switch>
                </Page>
            </BrowserRouter>
        );
    }
}

export default App;
