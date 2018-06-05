import React, {Component} from "react";
import {List, Avatar, Tag} from "antd";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import image from "../image/docker.png"
import {loadCatalog} from "../actions";

const color = ["magenta", "red", "volcano", "orange", "cyan",  "gold", "lime", "green", "blue", "geekblue", "purple"];

function getColor(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash += value.charCodeAt(i);
    }
    return color[hash % color.length];
}

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
                dataSource={repositories.filter(r => r.tags.length > 0)}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={image}/>}
                            title={<Link to={`/registry/${item.name}/`}>{item.name}</Link>}
                            description={<div>
                                {item.tags.map((v, i) =>
                                    <Link to={`/registry/${item.name}/#${v}`} key={v + i}>
                                        <Tag color={getColor(v)}>{v}</Tag>
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

