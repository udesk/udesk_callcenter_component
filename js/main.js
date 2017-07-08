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
import { render } from 'react-dom';
import Agent from './Agent';
import { makeCall } from './CallUtil';
require.context('../images', true, /\.(png|jpg|gif)$/);

class UdeskCallCenterComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            expand: false
        };

        let self = this;
        AjaxUtils.get('/agent_api/v1/callcenter/init_data', null, function(res) {
            CallConfig.set('agent_work_state', res.agent_work_state);
            CallConfig.set('agent_work_way', res.agent_work_way);

            self.tower_url = res.tower_host;
            self.user_id = res.user_id;

            Agent.id = res.user_id;
            Agent.name = res.user_name;

            self.connectWebSocket();
        }, function() {
            Alert.error('获取初始化数据失败!');
        });
    }

    render() {
        return <div ref={(ele) => ele && (this.container = ele.parentElement)}>
            <Header onMinimize={this.collapse.bind(this)} onMaximize={this.expand.bind(this)}
                    onDrag={this.drag.bind(this)} ref={(ele) => ele && (this.headerComponent = ele)}
                    onDrop={this.drop.bind(this)}
                    headerButtons={this.props.headerButtons}/>
            <AgentStatePanel dropdownDirection={this.state.expand ? 'down' : 'up'}/>
            <MainContent className={this.state.expand ? '' : 'hide'}/>
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
                    CallConfig.set('agent_work_state', workState);
                    break;
                case 'consult_result':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');

                    if (msg.code === '6005') {
                        Alert.success('咨询成功');
                    }
                    break;
                case 'three_party':
                    CallInfo.set('can_consult', msg.can_consult === 'true');
                    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
                    CallInfo.set('can_three_party', msg.can_three_party === 'true');
                    CallInfo.set('can_transfer', msg.can_transfer === 'true');

                    if (msg.code === '1000') {
                        Alert.success('三方成功');
                    }
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
}

class CallcenterComponent {
    constructor({container, subDomain, token, onScreenPop, onRinging, onTalking, onHangup, bottomExtension, headerButtons}) {
        AjaxUtils.token = token;
        AjaxUtils.host = 'https://' + subDomain + '.udesk.cn';
        //AjaxUtils.host = 'http://' + subDomain + '.udeskt1.com';

        let wrapper = this.wrapper = document.createElement('div');
        wrapper.className = 'udesk-callcenter-component';
        container.appendChild(wrapper);
        render(<UdeskCallCenterComponent callConfig={CallConfig} headerButtons={headerButtons}/>, wrapper);

        this.bottomExtensionElement = document.createElement('div');
        this.bottomExtensionElement.className = 'bottom-extension';
        switch (typeof bottomExtension) {
            case 'string':
                this.bottomExtensionElement.innerHTML = bottomExtension;
                break;
            case 'element':
                if (bottomExtension instanceof Document) {
                    this.bottomExtensionElement.appendChild(bottomExtension);
                }
                break;
        }
        wrapper.appendChild(this.bottomExtensionElement);

        let converter = (callLog) => {
            return {
                conversation_id: callLog.conversation_id,  //通话记录ID
                call_type: callLog.call_type,  //呼入呼出
                customer_phone_number: callLog.customer_phone, //客户号码
                queue_name: callLog.queue_desc,  //来源队列
                customer_phone_location: callLog.phone_location,  //归属地
                agent_id: Agent.id,
                agent_name: Agent.name,
                ring_time: callLog.ring_at
            };
        };

        if (onScreenPop) {
            CallInfo.on('screenPop', function(callLog) {
                onScreenPop(converter(callLog));
            });
        }
        if (onRinging) {
            CallInfo.on('ringing', function(callLog) {
                onRinging(converter(callLog));
            });
        }
        if (onTalking) {
            CallInfo.on('talking', function(callLog) {
                onTalking(converter(callLog));
            });
        }
        if (onHangup) {
            CallInfo.on('hangup', function(callLog) {
                let result = converter(callLog);
                result.hangup_time = new Date().toISOString();
                delete result.ring_time;
                onHangup(result);
            });
        }
    }

    makeCall(number, onSuccess, onFailure) {
        makeCall(number, onSuccess, onFailure);
    }
}

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
