import '../css/callcenter-component.scss';
import 'font-awesome/scss/font-awesome.scss';
import './component/ie8-child-elements';
import AgentStatePanel from './component/AgentStatePanel.js';
import Header from './component/Header.js';
import Socket from './component/socket';
import CallQueue from './CallQueue';
import CallLog from './CallLog';
import AjaxUtils from './AjaxUtils';
import Alert from './component/Alert';
import CallInfo from './CallInfo';
import CallConfig from './CallConfig';
import MainContent from './component/MainContent';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Agent from './Agent';
import * as callUtil from './CallUtil';
import CONSTANT from './Const';
import _ from 'lodash';

require.context('../assets/images', true, /\.(png|jpg|gif)$/);

class UdeskCallCenterComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            expand: false,
            customStates: []
        };

        let self = this;
        AjaxUtils.get('/agent_api/v1/callcenter/init_data', null, function(res) {
            if (res.cc_custom_state_id) {
                CallConfig.set('agent_work_state', res.agent_work_state + '_' + res.cc_custom_state_id);
            } else {
                CallConfig.set('agent_work_state', res.agent_work_state);
            }
            CallConfig.set('agent_work_way', res.agent_work_way);

            self.tower_url = res.tower_host;
            self.user_id = res.user_id;

            Agent.id = res.user_id;
            Agent.name = res.user_name;
            Agent.group_id = res.group_id;
            Agent.permissions = res.permissions;

            self.setState({
                'customStates': _.map(res.cc_custom_states || [], function(item) {
                    item.customStateId = item.id;
                    item.originalStateId = 'resting';
                    item.id = item.originalStateId + '_' + item.id;
                    return item;
                })
            });

            self.props.onInitSuccess();

            self.connectWebSocket();
        }, function() {
            self.props.onInitFailure();
        });
    }

    render() {
        return <div ref={(ele) => ele && (this.container = ele.parentElement)}>
            <Header onMinimize={this.collapse.bind(this)} onMaximize={this.expand.bind(this)}
                    onDrag={this.drag.bind(this)} ref={(ele) => ele && (this.headerComponent = ele)}
                    onDrop={this.drop.bind(this)}/>
            <AgentStatePanel dropdownDirection={this.state.expand ? 'down' : 'up'}
                             customStates={this.state.customStates}/>
            <MainContent className={this.state.expand ? '' : 'hide'}
                         showManualScreenPop={this.props.showManualScreenPop}/>
        </div>;
    }

    //componentDidMount() {
    //    let self = this;
    //    clearInterval(this.intervaleId);
    //    this.intervaleId = setInterval(function() {
    //        if (self.dragging) {
    //            return;
    //        }
    //        let { top, bottom, left, right, height, width } = self.container.getBoundingClientRect();
    //        if (top < 0) {
    //            self.container.style.bottom = (window.innerHeight - height) + 'px';
    //            self.headerComponent.mouseDown = false;
    //        }
    //        if (bottom > window.innerHeight) {
    //            self.container.style.bottom = '0';
    //        }
    //        if (left < 0) {
    //            self.container.style.right = (window.innerWidth - width) + 'px';
    //        }
    //        if (right > window.innerWidth) {
    //            self.container.style.right = '0';
    //        }
    //    }, 1000);
    //}

    collapse() {
        this.setState({expand: false});
    }

    expand() {
        this.setState({expand: true});
    }

    drag(offsetX, offsetY) {
        //this.dragging = true;
        //let { right:containerRight, bottom:containerBottom } = this.container.getBoundingClientRect();
        //this.container.style.right = (window.innerWidth - containerRight - offsetX) + 'px';
        //this.container.style.bottom = (window.innerHeight - containerBottom - offsetY) + 'px';
    }

    drop() {
        this.dragging = false;
    }

    connectWebSocket() {
        var self = this;
        this.socket = new Socket(this.tower_url, this.user_id);

        //websocket
        this.socket.onNotice(function(msg) {
            switch (msg.type) {
                case 'call_log':
                    CallQueue.put(new CallLog(msg));
                    break;
                case 'seat_status':
                    let workWay = msg.agent_work_way;
                    let workState = msg.agent_work_state;
                    CallConfig.set('agent_work_way', workWay);
                    if (msg.cc_custom_state_id) {
                        CallConfig.set('agent_work_state', workState + '_' + msg.cc_custom_state_id);
                    } else {
                        CallConfig.set('agent_work_state', workState);
                    }
                    break;
                case 'consult_result':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');

                    self.props.onConsultResult(msg);
                    break;
                case 'three_party':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');

                    self.props.onThreeWayCallingResult(msg);
                    break;
                case 'transfer_result':
                    self.props.onTransferResult(msg);
                    break;
                case 'drop_call':
                    self.props.onDropCall(msg);
                    break;
                case 'transfer_ivr_result':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');
                    CallInfo.set('can_transfer_ivr', msg.can_transfer_ivr === 'true');
                    self.props.onIvrCallResult(msg);
                    // self.setState({});
                    break;
                case 'resume_agent_result':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');
                    CallInfo.set('can_transfer_ivr', msg.can_transfer_ivr === 'true');
                    self.props.onResumeAgentResult(msg);
                    // self.setState({});
                    break;
                case 'hold_call':
                case 'retrieval_call':
                    CallInfo.set('can_retrieval', msg.can_retrieval === 'true');
                    CallInfo.set('can_hold', msg.can_hold === 'true');
                    break;
            }
        });

        this.socket.onException(function(msg) {
            switch (msg.error) {
                case 'connected_at_other_place':
                    Alert.error(msg.message);
            }
        });
    }

    componentWillUnmount() {
        this.socket && this.socket.close();
    }
}

const emptyFunction = function() {
};

class CallcenterComponent {
    /**
     *
     * @param container
     * @param subDomain
     * @param token
     * @param showManualScreenPop
     * @param onScreenPop
     * @param onRinging
     * @param onTalking
     * @param onHangup
     * @param onWorkStatusChange
     * @param onWorkWayChange
     * @param onDropCall
     * @param onTransferResult
     * @param onInitSuccess
     * @param onConsultResult
     * @param onThreeWayCallingResult
     * @param onInitFailure
     * @param {function} onTokenExpired - 当token失效是触发，参数是一个回调函数，可以调用回调函数，参数是新的token实现刷新token的功能
     */
    constructor({
        container, subDomain, token,
        showManualScreenPop = false,
        onScreenPop = emptyFunction,
        onRinging = emptyFunction,
        onTalking = emptyFunction,
        onHangup = emptyFunction,
        onWorkStatusChange = emptyFunction,
        onWorkWayChange = emptyFunction,
        onDropCall = emptyFunction,
        onTransferResult = emptyFunction,
        onInitSuccess = emptyFunction,
        onIvrCallResult = emptyFunction,
        onResumeAgentResult = emptyFunction,
        onConsultResult = function(msg) {
            if (msg.code === '6005') Alert.success('成功从咨询中恢复!');
        },
        onThreeWayCallingResult = function(msg) {
            if (msg.code === '1000') Alert.success('三方成功');
        },
        onInitFailure = function() {
            Alert.error('获取初始化数据失败!');
        },
        onTokenExpired
    }) {
        AjaxUtils.token = token;
        AjaxUtils.host = __protocol__ + '://' + subDomain + __server__;
        AjaxUtils.refreshToken = onTokenExpired;
        //AjaxUtils.host = 'http://' + subDomain + '.udesktiger.com';

        let wrapper = this.wrapper = document.createElement('div');
        wrapper.className = 'udesk-callcenter-component';
        container.appendChild(wrapper);
        render(<UdeskCallCenterComponent callConfig={CallConfig}
                                         showManualScreenPop={showManualScreenPop}
                                         onDropCall={onDropCall}
                                         onTransferResult={onTransferResult}
                                         onConsultResult={onConsultResult}
                                         onThreeWayCallingResult={onThreeWayCallingResult}
                                         onInitSuccess={onInitSuccess}
                                         onResumeAgentResult={onResumeAgentResult}
                                         onIvrCallResult={onIvrCallResult}
                                         onInitFailure={onInitFailure}/>, wrapper);

        this.isDestroyed = false;

        let converter = (callLog) => {
            return {
                call_id: callLog.call_id,
                conversation_id: callLog.conversation_id || callLog.conversation_log_id,  //通话记录ID
                call_type: callLog.call_type,  //呼入呼出
                customer_phone_number: callLog.customer_phone, //客户号码
                queue_name: callLog.queue_desc,  //来源队列
                customer_phone_location: callLog.phone_location,  //归属地
                agent_id: Agent.id,
                agent_name: Agent.name,
                ring_time: callLog.ring_at
            };
        };

        this.onScreenPop = function(callLog) {
            try {
                onScreenPop(converter(callLog));
            } catch (e) {
                console.error(e);
            }
        };
        this.onRinging = function(callLog) {
            try {
                onRinging(converter(callLog));
            } catch (e) {
                console.error(e);
            }
        };
        this.onTalking = function(callLog) {
            try {
                onTalking(converter(callLog));
            } catch (e) {
                console.error(e);
            }
        };
        this.onHangup = function(callLog) {
            let result = converter(callLog);
            result.hangup_time = new Date().toISOString();
            delete result.ring_time;
            try {
                onHangup(result);
            } catch (e) {
                console.error(e);
            }
        };

        CallInfo.on('screenPop', this.onScreenPop);
        CallInfo.on('ringing', this.onRinging);
        CallInfo.on('talking', this.onTalking);
        CallInfo.on('hangup', this.onHangup);

        CallConfig.on('change', this.onCallConfigChange = function(k, v) {
            if (k === 'agent_work_state') {
                onWorkStatusChange(v);
            } else if (k === 'agent_work_way') {
                onWorkWayChange(v);
            }
        });

        this.transfer = callUtil.transfer;
        this.startConsult = callUtil.startConsult;
        this.startThreeWayCalling = callUtil.startThreeWayCalling;
        this.stopConsult = callUtil.stopConsult;
        this.holdCallSelect = callUtil.holdCallSelect;
        this.recoveryCallSelect = callUtil.recoveryCallSelect;
        this.makeCall = callUtil.makeCall;
        this.setWorkingWay = callUtil.setWorkingWay;
        this.startIvrCalling = callUtil.startIvrCalling;
        this.transferToGroup = callUtil.transferToGroup;
        this.transferToExternalPhone = callUtil.transferToExternalPhone;
        this.startConsultingToExternalPhone = callUtil.startConsultingToExternalPhone;
        this.startThreeWayCallingToExternalPhone = callUtil.startThreeWayCallingToExternalPhone;
    }

    setWorkStatus(workStatus, onSuccess, onFailure) {
        let allStatus = [CONSTANT.IDLE, CONSTANT.BUSY, CONSTANT.RESTING, CONSTANT.OFFLINE];
        if (!_.includes(allStatus, workStatus)) {
            throw new Error(`参数只能是以下四种:${allStatus.join(',')}`);
        }
        callUtil.setWorkStatus(workStatus, onSuccess, onFailure);
    }

    hangup(onSuccess, onFailure) {
        callUtil.hangup(onSuccess, onFailure);
    }

    destroy() {
        if (this.isDestroyed) {
            return;
        }
        unmountComponentAtNode(this.wrapper);
        this.wrapper.parentNode.removeChild(this.wrapper);
        Alert.destroy();
        CallInfo.off('screenPop', this.onScreenPop);
        CallInfo.off('ringing', this.onRinging);
        CallInfo.off('talking', this.onTalking);
        CallInfo.off('hangup', this.onHangup);
        CallConfig.off('change', this.onCallConfigChange);
        this.isDestroyed = true;
    }

    setToken(token) {
        AjaxUtils.token = token;
    }
}

CallcenterComponent.WORK_STATE_IDLE = CONSTANT.IDLE;
CallcenterComponent.WORK_STATE_BUSY = CONSTANT.BUSY;
CallcenterComponent.WORK_STATE_REST = CONSTANT.RESTING;
CallcenterComponent.WORK_STATE_OFFLINE = CONSTANT.OFFLINE;

window.UdeskCallcenterComponent = CallcenterComponent;
//{
//    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImYzN2ZhbmppYXdlaUBob3RtYWlsLmNvbSI.2miteFpPNfmKYGeQzvwuhA4LPOYGAAvhMwrI40GWISc',
//        uid: '10109',
//    clientId: new Date().getTime() + Math.random() + ''
//}

/**
 ["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
 ["notice",{"type":"call_log","state":"talking","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
 ["notice",{"type":"call_log","state":"hangup","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"false"}]
 ["notice",{"type":"seat_status","agent_work_way":"phone_online","agent_work_state":"neaten","autoswitch_at":"2016-12-05T15:49:52.383+08:00","server_time":"2016-12-05T15:49:32+08:00"}]
 ["notice",{"type":"call_log","state":"hangup","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"false"}]
 ["notice",{"type":"seat_status","agent_work_way":"phone_online","agent_work_state":"idle","autoswitch_at":"","server_time":"2016-12-05T15:49:52+08:00"}]
 **/
