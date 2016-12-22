var doc = document;

import '!style-loader!css-loader?minimize!sass-loader!../css/style.scss';
import 'font-awesome-webpack';
import './component/ie8-child-elements';
import AgentStatePanel from './component/AgentStatePanel.js';
import Header from './component/Header.js';
import HangupPanel from './component/HangupPanel';
import RingingPanel from './component/RingingPanel';
import TalkingPanel from './component/TalkingPanel';
import Const from './component/Const';
import images from './component/images';
import Socket from './component/socket';
import callQueue from './component/CallQueue';
import CallLog from './component/CallLog';
import AjaxUtils from './component/AjaxUtils';
import Alert from './component/Alert';
import CallInfo from './component/CallInfo';
import Utils from './component/Tools';
import AgentSelect from './component/AgentSelect';

var UdeskCallcenterComponent = function(options) {
    var token = options.token; //用于验证
    AjaxUtils.token = token;
    AjaxUtils.host = 'http://' + options.subDomain + '.udeskcat.com';

    var container = options.container;
    var allAgents = this.allAgents = [];
    var subDomain = this.subDomain = options.subDomain;
    var body = doc.body;
    var self = this;

    var headerNode = new Header();
    var agentStatePanel = this.agentStatePanel = new AgentStatePanel();
    var hangupPanel = this.hangupPanel = new HangupPanel();
    var talkingPanel = this.talkingPanel = new TalkingPanel();
    var ringingPanel = this.ringingPanel = new RingingPanel();

    var element = this.element = doc.createElement('div');
    var contentEle = this.contentEle = doc.createElement('div');

    element.className = 'udesk-callcenter-component';
    contentEle.className = 'content-wrapper';

    //窗口收起与展开
    headerNode.toggleBtn.addEventListener('click', function() {
        if (headerNode.open) {
            contentEle.style.display = 'none';
            headerNode.open = false;
            headerNode.toggleBtnImg.src = images.minimize;
            agentStatePanel.setDropMenuDirection('up');
        } else {
            contentEle.style.display = 'block';
            headerNode.open = true;
            headerNode.toggleBtnImg.src = images.maximize;
            agentStatePanel.setDropMenuDirection('down');
        }
    });

    hangupPanel.onMakeCallFailure = function(error) {
        Alert.error(error.message || '外呼失败');
        self.switchHangupState();
        Utils.isFunction(self.stopCallOutTimeout) && self.stopCallOutTimeout();
    };

    hangupPanel.onMakeCallSuccess = function() {
    };

    //外呼请求发出，进入等待页面，等待websocket消息，10秒后没收到外呼请求，则为外呼失败
    hangupPanel.onBeforeCalling = function() {
        self.switchLoading('正在外呼...');
        var timeoutId = setTimeout(function() {
            Alert.error('外呼失败');
            self.switchHangupState();
        }, 10000);
        self.stopCallOutTimeout = function() {
            clearTimeout(timeoutId);
        }
    };

    this.switchLoading();

    AjaxUtils.get('/agent_api/v1/init_data', null, function(res) {
        agentStatePanel.setAgentWorkState(res.agent_work_state);
        agentStatePanel.setAgentWorkWay(res.agent_work_way);
        self.seatToken = res.seatToken;
        self.tower_url = res.tower_host;
        self.user_id = res.user_id;
        self.connectWebSocket();
        self.switchHangupState();
        //self.switchTalkingState();
    }, function() {
        console.log('wolegequ', arguments);
    });

    element.appendChild(headerNode.element);
    element.appendChild(agentStatePanel.element);
    element.appendChild(contentEle);
    container.appendChild(element);

    var setTimeoutId;
    callQueue.on('change', function(calllog) {
        clearTimeout(setTimeoutId);
        self.switchLoading();

        CallInfo.conversation_id = calllog.conversation_id;
        CallInfo.agent_work_way = calllog.agent_work_way;
        CallInfo.call_id = calllog.call_id;
        CallInfo.can_consult = calllog.can_consult;
        CallInfo.can_three_party = calllog.can_three_party;
        CallInfo.can_transfer = calllog.can_transfer;
        CallInfo.conversation_id = calllog.conversation_id;
        CallInfo.direction = calllog.direction;
        CallInfo.is_consult = calllog.is_consult;
        CallInfo.state = calllog.state;

        setTimeoutId = setTimeout(function() {
            if (calllog.state === Const.RINGING) {
                self.switchRingingState();
            } else if (calllog.state === Const.TALKING) {
                self.switchTalkingState();
            } else if (calllog.state === Const.HANGUP) {
                self.switchHangupState();
            }
        }, 3000);
    });
};

//切换到拨号界面
UdeskCallcenterComponent.prototype.switchHangupState = function() {
    this.contentEle.innerHTML = '';
    this.contentEle.appendChild(this.hangupPanel.element);
    this.ringingPanel.clearAndStopTiming();
    this.talkingPanel.clearAndStopTiming();
    this.agentStatePanel.setCallState(Const.HANGUP);

    //var agentSelect = new AgentSelect();
    //this.contentEle.appendChild(agentSelect.element);
    //agentSelect.fetchData();
};

//切换到振铃页面
UdeskCallcenterComponent.prototype.switchRingingState = function() {
    this.contentEle.innerHTML = '';
    this.ringingPanel.startTiming();
    this.contentEle.appendChild(this.ringingPanel.element);
    this.agentStatePanel.setCallState(Const.RINGING);
    AjaxUtils.get("/agent_api/v1/desktop/conversation", { conversation_id: CallInfo.conversation_id }, function(res) {
        CallInfo.set('call_type', res.call_type);
        CallInfo.set('queue_desc', res.queue_desc);

        console.log('conversation', res);
    });
    Utils.isFunction(this.stopCallOutTimeout) && this.stopCallOutTimeout();
};

//切换到通话页面
UdeskCallcenterComponent.prototype.switchTalkingState = function() {
    this.contentEle.innerHTML = '';
    this.talkingPanel.startTiming();
    this.contentEle.appendChild(this.talkingPanel.element);
    this.agentStatePanel.setCallState(Const.TALKING);
    Utils.isFunction(this.stopCallOutTimeout) && this.stopCallOutTimeout();
};

// Loading界面
UdeskCallcenterComponent.prototype.switchLoading = function(loadingText) {
    this.contentEle.innerHTML = '';
    var p = doc.createElement('p');
    p.style.textAlign = 'center';
    p.innerText = loadingText || '正在加载...';
    this.contentEle.appendChild(p);
    p.style.margin = '30px 0';
};

UdeskCallcenterComponent.prototype.connectWebSocket = function() {
    var self = this;
    this.socket = new Socket(this.tower_url, this.user_id, this.seatToken);

    //websocket
    this.socket.onNotice(function(msg) {
        switch (msg.type) {
            case 'call_log':
                callQueue.put(new CallLog(msg));
                break;
            case 'seat_status':
                var workWay = msg.agent_work_way;
                var workState = msg.agent_work_state;
                self.agentStatePanel.setAgentWorkState(workState);
                self.agentStatePanel.setAgentWorkWay(workWay);
                break;
        }
    });

    this.socket.onException(function(msg) {
        switch (msg.error) {
            case 'connected_at_other_place':
                Alert.error(msg.message);
        }
    });
};

window.UdeskCallcenterComponent = UdeskCallcenterComponent;
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
