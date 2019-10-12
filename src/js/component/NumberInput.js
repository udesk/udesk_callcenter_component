import PropTypes from 'prop-types';
import React from 'react';
import images from './images';

export default class NumberInputComponent extends React.Component {
    render() {
        return <div className="number-input">
            <img src={images.keyboard} onClick={this.props.onKeyboardBtnClick}/>
            <div>
                <input onChange={this.props.onChange} value={this.props.value}/>
            </div>
        </div>;
    }

    static propTypes = {
        onKeyboardBtnClick: PropTypes.func,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
}
