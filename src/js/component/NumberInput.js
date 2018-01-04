import images from  './images';
import React from 'react';

var doc = document;

export default class NumberInputComponent extends React.Component {
    constructor() {
        super();

    }

    render() {
        return <div className="number-input">
            <img src={images.keyboard} onClick={this.props.onKeyboardBtnClick}/>
            <div>
                <input onKeyUp={this.props.onChange} value={this.props.value}/>
            </div>
        </div>
    }
}
