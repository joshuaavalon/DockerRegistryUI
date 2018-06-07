import React from "react";
import {Layout, Button} from "antd";
import {withRouter, Link} from "react-router-dom";
import {connect} from "react-redux";
import logo from "../image/docker.png"
import {loadCatalog, loadRepository, resetCatalog, resetRepository} from "../actions";

export const AppHeader = ({location, dispatch}) => {

    const pathSnippets = location.pathname.split("/").filter(i => i);
    let onClick;
    if (pathSnippets.length === 0) {
        onClick = () => {
            dispatch(resetCatalog());
            dispatch(loadCatalog());
        };
    } else if (pathSnippets.length === 2 && pathSnippets[0] === "registry") {
        onClick = () => {
            dispatch(resetRepository(pathSnippets[1]));
            dispatch(loadRepository(pathSnippets[1]));
        };
    } else {
        onClick = () => {
        };
    }
    return (
        <Layout.Header className="header">
            <div><Link to="/"><img src={logo} alt="logo" className="logo"/></Link></div>
            <div className="buttonBar">
                <Button shape="circle" icon="reload" ghost={true} onClick={onClick}/>
            </div>
        </Layout.Header>
    );
};

export const Header = withRouter(connect()(AppHeader));