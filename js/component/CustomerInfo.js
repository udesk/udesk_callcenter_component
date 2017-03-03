import React, { Component, PropTypes } from 'react';
import CallInfo from '../CallInfo';

class CustomerInfoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_phone: CallInfo.customer_phone,
            phone_location: CallInfo.phone_location
        };

        let self = this;
        CallInfo.on('change', this.onCallInfoChange = function(k, v) {
            let obj = {};
            obj[k] = v;
            self.setState(obj);
        });
    }

    render() {
        return (
            <div className="customer-info">
                <span className="number-content">{this.state.customer_phone}</span>
                <span className="location-content">{this.state.phone_location}</span>
            </div>
        )
    }

    componentWillUnmount() {
        CallInfo.off('change', this.onCallInfoChange);
    }
}

export default CustomerInfoComponent;