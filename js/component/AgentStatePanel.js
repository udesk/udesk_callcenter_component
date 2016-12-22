var Const = require('./Const');
var DropdownBtn = require('./Dropdown.js');
var AjaxUtils = require('./AjaxUtils');
var Alert = require('./Alert');

var doc = document;
var agentStateMap = {};

agentStateMap[Const.IDLE] = '空闲';
agentStateMap[Const.BUSY] = '忙碌';
agentStateMap[Const.RESTING] = '小休';
agentStateMap[Const.OFFLINE] = '离线';
agentStateMap[Const.TALKING] = '通话中';
agentStateMap[Const.RINGING] = '振铃中';

function stateDropdownItem(id) {
    return function() {
        var ele = document.createElement('div');
        ele.className = 'work-state-' + id;
        ele.innerHTML = '<i></i>' + agentStateMap[id];
        return ele;
    }
}

//专门为振铃中和通话中写了一个类
function CallStatePanel(state) {
    this.element = doc.createElement('div');
    this.element.style.display = 'none';
    this.element.style.fontSize = '14px';
    this.element.style.float = 'right';
    this.element.innerHTML = '<div class="work-state-' + state + '"><i></i>' + agentStateMap[state] + '</div>';
}

var AgentStatePanel = function() {
    var wayDropdownBtn = this.wayDropdownBtn = new DropdownBtn({
        content: [
            { id: Const.FIXED_VOIP_ONLINE, name: 'IP话机' },
            { id: Const.PHONE_ONLINE, name: '手机' }
        ]
    });

    wayDropdownBtn.onDropdownItemClick = function(dropdown, ele) {
        var agentWorkWay = ele.getAttribute('data-id');
        AjaxUtils.post('/agent_api/v1/agents/agent_work_way', { agent_work_way: agentWorkWay }, function() {
            dropdown.setValue(agentWorkWay);
        }, function() {
            Alert.error('切换在线方式失败');
        });

    };

    var stateDropdownBtn = this.stateDropdownBtn = new DropdownBtn({
        content: [
            { id: Const.IDLE, name: stateDropdownItem('idle') },
            { id: Const.BUSY, name: stateDropdownItem('busy') },
            { id: Const.RESTING, name: stateDropdownItem('resting') },
            { id: Const.OFFLINE, name: stateDropdownItem('offline') }
        ]
    });

    stateDropdownBtn.onDropdownItemClick = function(dropdown, ele) {
        var agentWorkState = ele.getAttribute('data-id');
        AjaxUtils.post('/agent_api/v1/agents/agent_work_state', { agent_work_state: agentWorkState }, function() {
            dropdown.setValue(agentWorkState);
        }, function() {
            Alert.error('切换在线状态失败');
        });
    };

    this.element = doc.createElement('div');
    this.element.style.backgroundColor = '#f2f2f2';
    this.element.style.padding = '15px';

    this.talkingStateBtn = new CallStatePanel(Const.TALKING);
    this.ringingStateBtn = new CallStatePanel(Const.RINGING);
    this.element.appendChild(this.talkingStateBtn.element);
    this.element.appendChild(this.ringingStateBtn.element);

    var wayBtnEle = wayDropdownBtn.element;
    var stateBtnEle = stateDropdownBtn.element;
    wayBtnEle.style.width = '50px';
    stateBtnEle.style.width = '50px';
    stateBtnEle.style.float = 'right';

    this.element.appendChild(stateBtnEle);
    this.element.appendChild(wayBtnEle);
};

AgentStatePanel.prototype.setCallState = function(state) {
    this.ringingStateBtn.element.style.display = 'none';
    this.talkingStateBtn.element.style.display = 'none';
    this.stateDropdownBtn.element.style.display = 'none';
    if (state === Const.RINGING) {
        this.ringingStateBtn.element.style.display = 'block';
    } else if (state === Const.TALKING) {
        this.talkingStateBtn.element.style.display = 'block';
    } else {
        this.stateDropdownBtn.element.style.display = 'block';
    }
};

AgentStatePanel.prototype.setDropMenuDirection = function(direction) {
    this.wayDropdownBtn.direction = direction;
    this.stateDropdownBtn.direction = direction;
};

AgentStatePanel.prototype.setAgentWorkWay = function(agentWorkWay) {
    this.wayDropdownBtn.setValue(agentWorkWay);
};

AgentStatePanel.prototype.setAgentWorkState = function(agentWorkState) {
    this.stateDropdownBtn.setValue(agentWorkState);
};

module.exports = AgentStatePanel;