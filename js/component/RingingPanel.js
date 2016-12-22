import UserHeadImage from './UserHeadImage';
import callInfo from './CallInfo';
import HorizontalRule from './HorizontalRule';
import utils from './Tools';
import CallBtn from './CallButton';

var doc = document;
var RingingPanel = function() {
    var contentEle = doc.createElement('div');
    var hr = new HorizontalRule().element;
    var numberInfo = doc.createElement('div');

    this.userHeadImage = new UserHeadImage();

    contentEle.appendChild(this.userHeadImage.element);
    contentEle.style.textAlign = 'center';
    numberInfo.style.padding = '5px 0';
    numberInfo.innerHTML = callInfo.customer_phone + '&nbsp;&nbsp;' + callInfo.phone_location;
    var descInfo = this.descInfo = doc.createElement('div');
    descInfo.innerHTML = '&nbsp;';
    descInfo.style.marginBottom = '50px';
    contentEle.appendChild(numberInfo);
    contentEle.appendChild(hr);
    contentEle.appendChild(descInfo);

    var timeEle = this.timeEle = doc.createElement('div');
    timeEle.style.marginBottom = '70px';

    callInfo.ringingTime = 0;
    timeEle.innerText = utils.humanizeTime(callInfo.ringingTime);
    contentEle.appendChild(timeEle);
    //var callBtn = this.callBtn = new CallBtn('hangup');
    //contentEle.appendChild(callBtn.element);
    this.element = contentEle;

    var self = this;
    callInfo.on('change', function() {
        self.setQueueDesc(callInfo.queue_desc);
    });
};

RingingPanel.prototype.stopTiming = function() {
    clearInterval(this.intervalId);
};

RingingPanel.prototype.clearAndStopTiming = function() {
    this.stopTiming();
    callInfo.ringingTime = 0;
};

RingingPanel.prototype.startTiming = function() {
    var self = this;
    this.intervalId = setInterval(function() {
        callInfo.ringingTime += 1;
        self.timeEle.innerText = utils.humanizeTime(callInfo.ringingTime);
    }, 1000);
};

RingingPanel.prototype.setQueueDesc = function(queue_desc) {
    if (queue_desc) {
        this.descInfo.innerHTML = '来源：' + queue_desc;
    } else {
        this.descInfo.innerHTML = '';
    }
};

module.exports = RingingPanel;
