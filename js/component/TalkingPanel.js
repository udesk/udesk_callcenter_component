import images from './images';
import UserHeadImage from './UserHeadImage';
import callInfo from './CallInfo';
import utils from './Tools';
import Hr from './HorizontalRule';
import ButtonWithImage from './ButtonWithImage';
import AgentSelect from './AgentSelect';
import AjaxUtils from './AjaxUtils';
import Alert from './Alert';

var doc = document;
var TalkingPanel = function(options) {
    this.agentSelectType = '';
    this.userHeadImg = new UserHeadImage();
    //var muteBtn = new ButtonWithImage(images.mute, '静音');
    var transferBtn = new ButtonWithImage(images.transfer, '转移');
    var consultBtn = new ButtonWithImage(images.consult, '咨询');
    var threeWayCallingBtn = new ButtonWithImage(images.threeWayCalling, '三方');
    var hr = new Hr();
    var agentSelect = this.agentSelect = new AgentSelect();

    var contentEle = this.element = doc.createElement('div');
    var numberInfo = doc.createElement('div');
    var descInfo = doc.createElement('div');
    var timeEle = this.timeEle = doc.createElement('div');
    var bottomBtnsBar = doc.createElement('div');
    var agentSelectWrapper = this.agentSelectWrapper = doc.createElement('div');

    contentEle.style.textAlign = 'center';
    numberInfo.style.padding = '5px 0';
    descInfo.style.marginBottom = '50px';
    timeEle.style.marginBottom = '25px';
    bottomBtnsBar.style.marginBottom = '12px';
    threeWayCallingBtn.element.style.borderRightWidth = '1px';
    agentSelectWrapper.style.padding = '0 30px';
    agentSelectWrapper.style.marginBottom = '24px';
    agentSelectWrapper.style.display = 'none';

    numberInfo.innerHTML = callInfo.customer_phone + '&nbsp;&nbsp;' + callInfo.phone_location;

    //bottomBtnsBar.appendChild(muteBtn.element);
    bottomBtnsBar.appendChild(transferBtn.element);
    bottomBtnsBar.appendChild(consultBtn.element);
    bottomBtnsBar.appendChild(threeWayCallingBtn.element);
    agentSelectWrapper.appendChild(agentSelect.element);

    contentEle.appendChild(this.userHeadImg.element);
    contentEle.appendChild(numberInfo);
    contentEle.appendChild(hr.element);
    contentEle.appendChild(descInfo);
    contentEle.appendChild(timeEle);
    contentEle.appendChild(agentSelectWrapper);
    contentEle.appendChild(bottomBtnsBar);

    var self = this;
    transferBtn.cancelHandler = function() {
        self.hideAgentSelect();
        transferBtn.toNormalState();
    };
    transferBtn.normalHandler = function() {
        self.showAgentSelect();
        transferBtn.toCancelState();
        consultBtn.toNormalState();
        threeWayCallingBtn.toNormalState();
        self.agentSelectType = 'transfer';
    };

    consultBtn.cancelHandler = function() {
        self.hideAgentSelect();
        consultBtn.toNormalState();
    };
    consultBtn.normalHandler = function() {
        self.showAgentSelect();
        consultBtn.toCancelState();
        transferBtn.toNormalState();
        threeWayCallingBtn.toNormalState();
        self.agentSelectType = 'consult';
    };

    threeWayCallingBtn.cancelHandler = function() {
        self.hideAgentSelect();
        threeWayCallingBtn.toNormalState();
    };
    threeWayCallingBtn.normalHandler = function() {
        self.showAgentSelect();
        threeWayCallingBtn.toCancelState();
        transferBtn.toNormalState();
        consultBtn.toNormalState();
        self.agentSelectType = 'threeWayCalling';
    };

    agentSelect.onSelected = function(agent) {
        self[self.agentSelectType](agent);
    };

    callInfo.on('change', function() {
        if (callInfo.call_type !== '呼入') {
            transferBtn.element.style.display = 'none';
            consultBtn.element.style.display = 'none';
            threeWayCallingBtn.element.style.display = 'none';
            agentSelect.element.style.display = 'none';
        }
        if (callInfo.queue_desc) {
            descInfo.innerHTML = '来源：' + callInfo.queue_desc;
        } else {
            descInfo.innerHTML = '';
        }
    });
};

TalkingPanel.prototype.stopTiming = function() {
    clearInterval(this.intervalId);
};

TalkingPanel.prototype.clearAndStopTiming = function() {
    this.stopTiming();
    callInfo.talkingTime = 0;
};

TalkingPanel.prototype.startTiming = function() {
    var self = this;
    this.intervalId = setInterval(function() {
        callInfo.talkingTime += 1;
        self.timeEle.innerText = utils.humanizeTime(callInfo.talkingTime);
    }, 1000);
};

TalkingPanel.prototype.showAgentSelect = function() {
    var self = this;
    this.agentSelectWrapper.style.display = 'block';
    this.agentSelect.clearValue();
    self.agentSelectWrapper.appendChild(self.agentSelect.element);
};

TalkingPanel.prototype.hideAgentSelect = function() {
    this.agentSelectWrapper.style.display = 'none';
};

TalkingPanel.prototype.transfer = function(agent) {
    AjaxUtils.post('/agent_api/v1/desktop/transfer_call', { agent_no: agent.id }, function(res) {
        switch (res.code) {
            case 1001:
                Alert.success('转移的请求已经发送！');
                break;
            default:
                Alert.error(res.message || '转移失败！');
        }
    }, function() {
        Alert.error('转移失败');
    });
};

TalkingPanel.prototype.consult = function(agent) {
    AjaxUtils.post('/agent_api/v1/desktop/start_consult', { agent_no: agent.id }, function(res) {
        switch (res.code) {
            case 1001:
                Alert.success('咨询的请求已经发送！');
                break;
            default:
                Alert.error(res.message || '咨询失败');
        }
    }, function() {
        Alert.error('咨询失败');
    });
};

TalkingPanel.prototype.threeWayCalling = function(agent) {
    AjaxUtils.post('/agent_api/v1/desktop/three_party', { agent_no: agent.id }, function(res) {
        switch (res.code) {
            case 1001:
                Alert.success('三方的请求已经发送！');
                break;
            default:
                Alert.error(res.message || '三方失败！');
        }
    }, function() {
        Alert.error('三方失败');
    });
};

module.exports = TalkingPanel;
