import React, { Component } from 'react';
import { hangup } from '../CallUtil';
import images from  './images';

const style = {
    backgroundColor: '#e7443c',
    width: '50%',
    border: '0',
    height: '47px'
};

class HangupButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <button onClick={hangup} style={style}>
            <img src={images.hangup}/>
        </button>;
    }
}

export default HangupButton;
