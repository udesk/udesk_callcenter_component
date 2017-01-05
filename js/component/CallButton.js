import images from  './images';
import React from 'react';

const style = {
    width: '100%',
    backgroundColor: '#49b34f',
    border: '0',
    height: '47px'
};
export default class CallButtonComponent extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <button onClick={this.props.onClick} style={style}>
            <img src={this.props.type === 'hangup' ? images.hangup : images.call_out}/>
        </button>
    }
};