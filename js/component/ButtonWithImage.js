import React from 'react';
import tools from './Tools';

export default class ButtonWithImageComponent extends React.Component {
    constructor() {
        super();
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
                    return <span>{this.props.content}</span>
                } else if (this.props.state === 'cancel') {
                    return <span>{this.props.cancelText || '取消'}</span>
                }
            }).call(this)}
        </button>
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
}