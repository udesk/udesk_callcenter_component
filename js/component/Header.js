import React, { Component, PropTypes } from 'react';
import images from './images';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false
        };
        this.keyDown = false;
    }

    render() {
        let resizeBtn;
        if (this.state.expand) {
            resizeBtn = <div className="resize-btn" onClick={this.minimize.bind(this)}>
                <img src={images.minimize}/>
            </div>
        } else {
            resizeBtn = <div className="resize-btn" onClick={this.maximize.bind(this)}>
                <img src={images.maximize}/>
            </div>
        }
        return (
            <div className="top-bar" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}
                 onMouseMove={this.onMouseMove.bind(this)}>
                {resizeBtn}
                <div className="title">电话</div>
            </div>
        )
    }

    minimize() {
        this.setState({ expand: false });
        if (this.props.onMinimize) {
            this.props.onMinimize();
        }
    }

    maximize() {
        this.setState({ expand: true });
        if (this.props.onMaximize) {
            this.props.onMaximize();
        }
    }

    onMouseDown(e) {
        this.keyDown = true;
        this.screenX = e.screenX;
        this.screenY = e.screenY;
    }

    onMouseUp() {
        this.keyDown = false;
    }

    onMouseMove(e) {
        if (this.keyDown === true) {
            let offsetX = e.screenX - this.screenX;
            let offsetY = e.screenY - this.screenY;
            this.screenX = e.screenX;
            this.screenY = e.screenY;
            this.props.onDrag(offsetX, offsetY);
        }
    }
}

export default Header;