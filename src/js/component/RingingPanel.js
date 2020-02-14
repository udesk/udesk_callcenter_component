import React from 'react';
import CallConfig from '../CallConfig';
import CallInfo from '../CallInfo';
import {VOIP_ONLINE} from '../Const';
import * as utils from '../Tools';
import AcceptButton from './accept-button';
import CustomerInfo from './CustomerInfo';
import HangupButton from './HangupButton';
import images from './images';
import PropTypes from 'prop-types';
import { answer } from '../CallUtil';

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
                if (CallInfo.call_type === '呼出' && CallInfo.can_accept === 'in' && CallConfig.agent_work_way === VOIP_ONLINE && CallInfo.startCallTime < 6) {
                    answer();
                }
            }
        });
    }

    render() {
        let descInfoContent = '';
        let {isShow = false} = this.props;
        if (!isShow) {
            return null;
        }
        if (this.state.queue_desc) {
            descInfoContent = '来源:' + this.state.queue_desc;
        }
        return <div className='text-center'>
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
                if (CallInfo.can_accept === 'in' && CallConfig.agent_work_way === VOIP_ONLINE) {
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

    static propTypes = {
        isShow: PropTypes.bool
    }
}
