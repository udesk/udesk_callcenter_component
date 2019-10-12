import React from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';

export default class RadioBtnGroup extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value
        };
    }

    render() {
        let options = map(this.props.options, (item) => {
            let isActive = item.value === this.state.value;
            return <button onClick={() => this.setValue(item.value)}
                           className={isActive ? 'active' : ''} key={item.value}>{item.name}</button>;
        });
        return <div className="radio-btn-group">{options}</div>;
    }

    setValue(value) {
        this.setState({value: value});
        this.props.onChange(value);
    }
}

RadioBtnGroup.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func
};

RadioBtnGroup.defaultProps = {
    options: [],
    onChange: function() {
    }
};

