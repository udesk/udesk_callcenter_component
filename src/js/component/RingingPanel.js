import CallInfo from '../CallInfo';
import { RINGING, VOIP_ONLINE } from '../Const';
import utils from '../Tools';
import CustomerInfo from './CustomerInfo';
import React from 'react';
import images from './images';
import HangupButton from './HangupButton';
import AcceptButton from './accept-button';

export default class RingingPanelComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            ringingTime: 0
        };
        let self = this;
        CallInfo.on('change', this.onCallInfoChange = function() {
            if (CallInfo.state === 'ringing') {
                self.setState(CallInfo);
            }
        });
    }

    render() {
        let descInfoContent = '';
        if (this.state.queue_desc) {
            descInfoContent = '来源:' + this.state.queue_desc;
        }
        return <div className="text-center">
            <img src={images.customer_head}/>
            <CustomerInfo/>
            <hr/>
            <div className="desc-info">
                {descInfoContent}
            </div>
            <div className="time-info">
                {utils.humanizeTime(this.state.ringingTime)}
            </div>
            {(() => {
                if (CallInfo.can_accept === 'in') {
                    return <div><AcceptButton/></div>;
                }
            })()}
            {(() => {
                if (CallInfo.can_hangup) {
                    return <div><HangupButton/></div>;
                }
            })()}
        </div>;
    }

    componentWillUnmount() {
        CallInfo.off('change', this.onCallInfoChange);
    }
}
