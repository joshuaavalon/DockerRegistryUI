import React, {Component} from "react";
import {List, Avatar, Tag} from "antd";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import {loadRepository} from "../actions";

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
        const {repository} = this.props;
        console.log(this.props);
        return (
            <div>{repository ? repository.name : "!"}</div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    repository: state.repositories[props.match.params.repository]
});
export const RepositoryPage = withRouter(connect(mapStateToProps)(Page));

