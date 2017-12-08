import React, { Component, PropTypes } from 'react';

let style = {
    outline: 'none',
    width: '94%',
    height: '47px',
    border: '1px solid #e4e4e4',
    backgroundColor: '#eee',
    marginBottom: '7px',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer'
};

class KeyButtonComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <button style={style} onClick={this.onClick.bind(this)}>{this.props.number}</button>
        )
    }

    onClick() {
        this.props.onClick(this.props.number);
    }
}

export default KeyButtonComponent;