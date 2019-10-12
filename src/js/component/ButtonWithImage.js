import PropTypes from 'prop-types';
import React from 'react';
import * as tools from '../Tools';

export default class ButtonWithImageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 'normal'
        };
    }

    render() {
        let className = 'image-button common-btn ' + (this.props.className || '');
        return <button className={className} onClick={this.onClick.bind(this)}>
            <img src={this.props.image}/>
            {(() => {
                if (this.props.state === 'normal') {
                    return <p>{this.props.content}</p>;
                } else if (this.props.state === 'cancel') {
                    return <p>{this.props.cancelText || '取消'}</p>;
                }
            }).call(this)}
        </button>;
    }

    onClick() {
        if (this.props.state === 'normal') {
            if (this.props.normalHandler && tools.isFunction(this.props.normalHandler)) {
                this.props.normalHandler();
            }
        } else {
            if (this.props.cancelHandler && tools.isFunction(this.props.cancelHandler)) {
                this.props.cancelHandler();
            }
        }
    }

    static propTypes = {
        className: PropTypes.string,
        image: PropTypes.string,
        content: PropTypes.string,
        state: PropTypes.string,
        cancelText: PropTypes.string,
        normalHandler: PropTypes.func,
        cancelHandler: PropTypes.func
    };
}
