import React from "react";
import {withRouter, Link} from "react-router-dom";
import {Breadcrumb, Icon } from "antd";

const BreadcrumbNavigation = ({location}) => {
    const pathSnippets = location.pathname.split("/").filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((pathSnippet, index) => {
        if (index === 0 && pathSnippet  === "registry") {
            return false;
        }
        const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{pathSnippet}</Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [(
        <Breadcrumb.Item key="home">
            <Link to="/"><Icon type="home" /></Link>
        </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    return (
        <Breadcrumb className="breadcrumbNavigation">
            {breadcrumbItems}
        </Breadcrumb>
    );
};

export const Navigation = withRouter(BreadcrumbNavigation);