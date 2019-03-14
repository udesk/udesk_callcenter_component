import 'font-awesome/scss/font-awesome.scss';
import _ from 'lodash';
import React from 'react';
import {
    render,
    unmountComponentAtNode
} from 'react-dom';
import '../css/callcenter-component.scss';
import Agent from './Agent';
import AjaxUtils from './AjaxUtils';
import CallConfig from './CallConfig';
import CallInfo from './CallInfo';
import * as callUtil from './CallUtil';
import AgentStatePanel from './component/AgentStatePanel.js';
import Alert from './component/Alert';
import Header from './component/Header.js';
import './component/ie8-child-elements';
import MainContent from './component/MainContent';
import * as CONSTANT from './Const';
import {VOIP_ONLINE} from './Const';
import softPhone from './soft-phone';
import websocket from './websocket';

require.context('../assets/images', true, /\.(png|jpg|gif)$/);

class UdeskCallCenterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            customStates: [],
            callout_numbers: [{id: null, name: '--', option: '--'}],
            userDeleted: false
        };
    }

    render() {
        let {
            userDeleted
        } = this.state;
        return <div ref={(ele) => ele && (this.container = ele.parentElement)}>
            <Header onMinimize={this.collapse.bind(this)} onMaximize={this.expand.bind(this)}
                    onDrag={this.drag.bind(this)} ref={(ele) => ele && (this.headerComponent = ele)}
                    onDrop={this.drop.bind(this)}/>
            <AgentStatePanel dropdownDirection={this.state.expand ? 'down' : 'up'}
                             customStates={this.state.customStates}
                             callout_numbers={this.state.callout_numbers}/>
            <MainContent className={this.state.expand ? '' : 'hide'}
                         showManualScreenPop={this.props.showManualScreenPop}/>
            {(() => {
                if (userDeleted) {
                    return <div className='mask'>
                        <span>该坐席账号已删除，请联系系统管理员。</span>
                    </div>;
                }
                return null;
            })()}
        </div>;
    }

    collapse() {
        this.setState({expand: false});
    }

    expand() {
        this.setState({expand: true});
    }

    drag(offsetX, offsetY) {

    }

    drop() {
        this.dragging = false;
    }

    componentDidMount() {
        AjaxUtils.get('/agent_api/v1/callcenter/init_data', null, (res) => {
            if (res.code === 15000) {
                this.setState({userDeleted: true});
                return;
            }
            if (res.cc_custom_state_id) {
                CallConfig.set('agent_work_state', res.agent_work_state + '_' + res.cc_custom_state_id);
            } else {
                CallConfig.set('agent_work_state', res.agent_work_state);
            }
            CallConfig.set('agent_work_way', res.agent_work_way);
            CallConfig.set('enableVoipOnline', res.is_web_voip_open);
            if (res.is_web_voip_open) {
                softPhone.on('registrationFailed', function() {
                    Alert.error('软电话注册失败');
                });

                softPhone.on('callFailed', function(cause) {
                    if (cause === 'Canceled') {   //振铃时挂断，属于正常操作，不予提示
                        return;
                    }
                    cause = cause || '呼叫失败';
                    if (cause === 'User Denied Media Access') {
                        cause = '无法访问您的耳麦';
                    }
                    Alert.error(cause);
                    CallInfo.set('state', 'hangup');
                });
                softPhone.on('sessionProcess', function(originator) {
                    CallInfo.setProperties({
                        'state': 'ringing',
                        'call_type': originator === 'local' ? '呼入' : '呼出',
                        'can_accept': originator === 'local' ? 'in' : 'out',
                        'agent_work_way': VOIP_ONLINE
                    });
                });

                softPhone.on('sessionConfirmed', function() {
                    CallInfo.set('state', 'talking');
                });
                softPhone.on('sessionEnded', function() {
                    CallInfo.set('state', 'hangup');
                });
                softPhone.on('sessionFailed', function() {
                    CallInfo.set('state', 'hangup');
                });

                try {
                    softPhone.init({
                        host: res.web_voip_host,
                        port: res.web_voip_port_num,
                        username: res.web_voip_id,
                        password: res.web_voip_password
                    });
                    if (res.agent_work_way === VOIP_ONLINE) {
                        softPhone.start();
                    }
                } catch (err) {

                }
            }
            if (res.default_callout_number) {
                CallConfig.set('default_callout_number', res.default_callout_number);
            }
            CallConfig.set('callout_numbers', res.callout_numbers);

            Agent.id = res.user_id;
            Agent.name = res.user_name;
            Agent.group_id = res.group_id;
            Agent.permissions = res.permissions;

            let callout_numbers = _.map(res.callout_numbers || [], (item) => {
                return {
                    id: item.id,
                    name: item.name || item.number,
                    option: item.name ? item.name + '-' + item.number : item.number
                };
            });

            this.setState({
                'customStates': _.map(res.cc_custom_states || [], function(item) {
                    item.customStateId = item.id;
                    item.originalStateId = 'resting';
                    item.id = item.originalStateId + '_' + item.id;
                    return item;
                }),
                'callout_numbers': [{id: null, name: '--', option: '--'}].concat(callout_numbers)
            });

            this.props.onInitSuccess();
            websocket.init(res.tower_host, res.user_id);
        }, () => {
            this.props.onInitFailure();
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
     * @param {document} container
     * @param {string} subDomain
     * @param {string} token
     * @param {boolean} showManualScreenPop
     * @param {function} onScreenPop
     * @param {function} onRinging
     * @param {function} onTalking
     * @param {function} onHangup
     * @param {function} onWorkStatusChange
     * @param {function} onWorkWayChange
     * @param {function} onDropCall
     * @param {function} onTransferResult
     * @param {function} onInitSuccess
     * @param {function} onIvrCallResult
     * @param {function} onResumeAgentResult
     * @param {function} onConsultResult
     * @param {function} onThreeWayCallingResult
     * @param {function} onInitFailure
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
                                         onInitSuccess={onInitSuccess}
                                         onResumeAgentResult={onResumeAgentResult}
                                         onInitFailure={onInitFailure}/>, wrapper);

        websocket.on('consultResult', onConsultResult);
        websocket.on('threeWayCallingResult', onThreeWayCallingResult);
        websocket.on('transferResult', onTransferResult);
        websocket.on('dropCall', onDropCall);
        websocket.on('ivrCallResult', onIvrCallResult);
        websocket.on('resumeAgentResult', onResumeAgentResult);

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
        this.getAutomaticCallNumGroup = callUtil.getAutomaticCallNumGroup;
        this.setupDefaultNumber = callUtil.setupDefaultNumber;
        this.getCallNumbers = callUtil.getCalloutNumbers;
        this.transferAfterConsult = callUtil.transferAfterConsult;
        this.threeWayCallingAfterConsult = callUtil.threeWayCallingAfterConsult;
        this.transferAfterThreeWayCalling = callUtil.transferAfterThreeWayCalling;
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
        this.wrapper.parentNode.removeChild(this.wrapper);
        Alert.destroy();
        CallInfo.off('screenPop', this.onScreenPop);
        CallInfo.off('ringing', this.onRinging);
        CallInfo.off('talking', this.onTalking);
        CallInfo.off('hangup', this.onHangup);
        CallConfig.off('change', this.onCallConfigChange);
        CallConfig.reset();
        websocket.destroy();
        unmountComponentAtNode(this.wrapper);
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
