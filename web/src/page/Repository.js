import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Image} from "../layout/Image";
import {loadRepository} from "../actions";
import {List} from "antd";


class Page extends Component {
    constructor(props) {
        super(props);
        const {match} = this.props;
        const {repository} = match.params;
        this.state = {
            name: repository
        };
    }

    componentDidMount() {
        this.updateRepository();
    }

    componentDidUpdate() {
        this.updateRepository();
    }

    updateRepository() {
        const {name} = this.state;
        const {dispatch} = this.props;
        dispatch(loadRepository(name));
    }

    render() {
        const {repository = {}} = this.props;
        const {name = "", tags = [], isFetching, isDeleting} = repository;
        return (
            <div>
                <h1>{name}</h1>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4
                    }}
                    loading={isFetching || isDeleting}
                    dataSource={tags}
                    renderItem={item => (
                        <List.Item>
                            <Image architecture={item.architecture}
                                   tag={item.tag}
                                   name={item.name}
                                   digest={item.digest}/>
                        </List.Item>
                    )}
                    className="repositoryList"
                />

            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    repository: state.repositories[props.match.params.repository]
});
export const RepositoryPage = withRouter(connect(mapStateToProps)(Page));

