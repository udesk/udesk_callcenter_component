import '!style-loader!css-loader?minimize!sass-loader!../css/style.scss';
import 'font-awesome-webpack';
import './component/ie8-child-elements';
import AgentStatePanel from './component/AgentStatePanel.js';
import Header from './component/Header.js';
import Socket from './component/socket';
import callQueue from './component/CallQueue';
import CallLog from './component/CallLog';
import AjaxUtils from './component/AjaxUtils';
import Alert from './component/Alert';
import CallInfo from './component/CallInfo';
import CallConfig from './component/CallConfig';
import MainContent from './component/MainContent';
import React from 'react';
import { render } from 'react-dom';

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

            self.seatToken = res.seatToken;
            self.tower_url = res.tower_host;
            self.user_id = res.user_id;
            self.connectWebSocket();
        }, function() {
            Alert.error('获取初始化数据失败!');
        });
    }

    render() {
        return <div ref={(ele) => ele && (this.container = ele.parentElement)}>
            <Header onMinimize={this.collapse.bind(this)} onMaximize={this.expand.bind(this)}
                    onDrag={this.drag.bind(this)} ref={(ele) => ele && (this.headerComponent = ele)}/>
            <AgentStatePanel dropdownDirection={this.state.expand ? 'down' : 'up'}/>
            <MainContent className={this.state.expand ? '' : 'hide'}/>
        </div>
    }

    componentDidMount() {
        let self = this;
        clearInterval(this.intervaleId);
        this.intervaleId = setInterval(function() {
            let { top, height } = self.container.getBoundingClientRect();
            if (top < 0) {
                self.container.style.bottom = (window.innerHeight - height) + 'px';
                self.headerComponent.mouseDown = false;
            }
        }, 1000);
    }

    collapse() {
        this.setState({ expand: false });
    }

    expand() {
        this.setState({ expand: true });
    }

    drag(offsetX, offsetY) {
        let { right:containerRight, bottom:containerBottom } = this.container.getBoundingClientRect();
        this.container.style.right = (window.innerWidth - containerRight - offsetX) + 'px';
        this.container.style.bottom = (window.innerHeight - containerBottom - offsetY) + 'px';
    }

    connectWebSocket() {
        var self = this;
        this.socket = new Socket(this.tower_url, this.user_id, this.seatToken);

        //websocket
        this.socket.onNotice(function(msg) {
            switch (msg.type) {
                case 'call_log':
                    callQueue.put(new CallLog(msg));
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
    constructor({ container, subDomain, token }) {
        AjaxUtils.token = token;
        AjaxUtils.host = 'http://' + subDomain + '.udesktiger.com';

        let wrapper = document.createElement('div');
        wrapper.className = 'udesk-callcenter-component';
        container.appendChild(wrapper);
        render(<UdeskCallCenterComponent
            callConfig={CallConfig}
        />, wrapper);
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
