import React from "react";
import {Layout} from "antd";
import {Footer, Header, Navigation} from "../layout";

const {Content} = Layout;

export const Page = ({children}) => {
    return (
        <Layout>
            <Header/>
            <Content>
                <Navigation/>
                <div className="content">{children}</div>
            </Content>
            <Footer/>
        </Layout>
    );
};


