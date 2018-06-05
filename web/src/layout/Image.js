import React from "react";
import {connect} from "react-redux";
import {Card, Icon} from "antd";
import {removeImage} from "../actions";

const {Meta} = Card;

export const ImageCard = ({name, architecture, digest, tag, dispatch, id = tag}) => {
    return (
        <Card
            id={id}
            style={{width: 300}}
            hoverable={true}
            actions={[<Icon type="delete"
                            onClick={() => {
                                dispatch(removeImage(name, digest));
                            }}/>
            ]}>
            <Meta
                title={tag}
                description={
                    <div>
                        <h5>Architecture</h5>
                        <p>{architecture}</p>
                        <h5>Digest</h5>
                        <p className="digest">{digest}</p>
                    </div>
                }/>
        </Card>
    );
};

export const Image = connect()(ImageCard);