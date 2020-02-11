import React from 'react';
import { answer } from '../CallUtil';
import images from './images';

const style = {
    backgroundColor: '#49b34f',
    width: '50%',
    border: '0',
    height: '47px',
    marginBottom: '10px'
};

class AcceptButton extends React.Component {
    handleClick = () => {
        answer();
    }
    render() {
        return <button onClick={this.handleClick} style={style}>
            <img src={images.call_out}/>
        </button>;
    }
}

export default AcceptButton;
