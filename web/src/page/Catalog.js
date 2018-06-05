import React, {Component} from "react";
import {List, Avatar, Tag} from "antd";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import image from "../image/docker.png"
import {loadCatalog} from "../actions";

class Page extends Component {
    componentDidMount() {
        this.updateCatalog();
    }

    componentDidUpdate() {
        this.updateCatalog();
    }

    updateCatalog() {
        const {dispatch} = this.props;
        dispatch(loadCatalog());
    }

    render() {
        const {catalog} = this.props;
        const {isFetching, repositories} = catalog;
        return (
            <List
                itemLayout="horizontal"
                loading={isFetching}
                dataSource={repositories}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={image}/>}
                            title={<Link to={`/registry/${item.name}/`}>{item.name}</Link>}
                            description={<div>
                                {item.tags.map((v, i) =>
                                    <Link to={`/registry/${item.name}/#${v}`} key={v + i}>
                                        <Tag color="cyan">{v}</Tag>
                                    </Link>
                                )}
                            </div>}/>
                    </List.Item>
                )}/>
        );
    }
}

const mapStateToProps = (state) => ({
    catalog: state.catalog
});
export const CatalogPage = withRouter(connect(mapStateToProps)(Page));

