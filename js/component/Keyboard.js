import KeyBtn from './KeyButton.js';
import React from 'react';
export default class KeyboardComponent extends React.Component {
    constructor() {
        super();
    }

    render() {

        return <div className={(this.props.className || '') + " keyboard"}>
            <div className="left">
                <KeyBtn number="1" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="4" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="7" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="*" onClick={this.onClickBtn.bind(this)}/>
            </div>
            <div className="center">
                <KeyBtn number="2" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="5" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="8" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="0" onClick={this.onClickBtn.bind(this)}/>
            </div>
            <div className="right">
                <KeyBtn number="3" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="6" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="9" onClick={this.onClickBtn.bind(this)}/>
                <KeyBtn number="#" onClick={this.onClickBtn.bind(this)}/>
            </div>
            <div className="clearfix"></div>
        </div>
    }

    onClickBtn(number) {
        this.props.onClick(number);
    }
}