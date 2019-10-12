import find from 'lodash/find';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import React from 'react';
import images from './images';

export default class DropdownComponent extends React.Component {
    constructor(props) {
        super(props);
        let {optionLabelPath = 'name'} = props;
        this.state = {
            expand: false,
            optionLabelPath
        };
    }

    render() {
        let {content, value} = this.props;
        let selected = find(content, {id: value});
        let dropdownClass = (this.state.expand && !this.props.disabled) ? '' : 'hide';
        dropdownClass += ' ' + this.props.direction;

        return <div className={(this.props.className || '') + ' ucm-dropdown'}>
            <img src={images.caret_down} onClick={this.toggleExpand.bind(this)}/>
            <div onClick={this.toggleExpand.bind(this)}>{selected ? selected.name : ''}</div>
            <ul className={dropdownClass}>
                {map(this.props.content, (item) => {
                    const onChangeCb = () => {
                        this.toggleExpand();
                        if (this.props.onChange) {
                            this.props.onChange(item);
                        }
                    };
                    if (!item.hide) {
                        return <li key={item.id} onClick={onChangeCb}>{item[this.state.optionLabelPath]}</li>;
                    }
                })}
            </ul>
        </div>;
    }

    toggleExpand() {
        if (this.props.disabled) {
            this.setState({expand: false});
            return;
        }
        this.setState({
            expand: !this.state.expand
        });
    }

    static propTypes = {
        optionLabelPath: PropTypes.string,
        content: PropTypes.string,
        value: PropTypes.string,
        disabled: PropTypes.bool,
        direction: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func
    };
}
