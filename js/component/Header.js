import React, { Component } from 'react';
import images from './images';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false
        };
        this.MouseDown = false;
    }

    render() {
        let resizeBtn;
        if (this.state.expand) {
            resizeBtn = <div className="resize-btn" onClick={this.minimize.bind(this)}>
                <img src={images.minimize}/>
            </div>;
        } else {
            resizeBtn = <div className="resize-btn" onClick={this.maximize.bind(this)}>
                <img src={images.maximize}/>
            </div>;
        }
        let headerBtns = [];
        if (this.props.headerButtons) {
            headerBtns = _.map(this.props.headerButtons, (i) => {
                let iconEle;
                if (i.icon) {
                    iconEle = <img src={i.icon} />
                }
                return <div className="" onClick={i.handler}>{iconEle}{i.text}</div>;
            });
        }
        return (
            <div className="top-bar" onDragStart={() => false} onDrop={() => false}
                 unselectable="on"
                 onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
                <div className="buttons">
                    {resizeBtn}
                    {headerBtns}
                </div>
                <div className="title">电话</div>
            </div>
        );
    }

    componentDidMount() {
        let self = this;
        document.onmousemove = function(e) {
            if (self.MouseDown === true) {
                let offsetX = e.screenX - self.screenX;
                let offsetY = e.screenY - self.screenY;
                self.screenX = e.screenX;
                self.screenY = e.screenY;
                self.props.onDrag(offsetX, offsetY);
            }
        };
        document.onmouseup = function(e) {
            self.MouseDown = false;
            self.props.onDrop();
        };
    }

    minimize() {
        this.setState({expand: false});
        if (this.props.onMinimize) {
            this.props.onMinimize();
        }
    }

    maximize() {
        this.setState({expand: true});
        if (this.props.onMaximize) {
            this.props.onMaximize();
        }
    }

    onMouseDown(e) {
        this.MouseDown = true;
        this.screenX = e.screenX;
        this.screenY = e.screenY;
    }

    onMouseUp() {
        this.MouseDown = false;
    }

    onMouseMove(e) {

    }
}

export default Header;
