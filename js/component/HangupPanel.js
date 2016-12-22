import utils from './Tools';
import AjaxUtils from './AjaxUtils';
import Alert from './Alert';

//挂断状态的界面
var NumberInput = require('./NumberInput');
var Keyboard = require('./Keyboard');
var CallBtn = require('./CallButton');
var eventTool = require('./event-tool');

var doc = document;

/**
 * @event onBeforeCalling 外呼之前触发
 * @event onMakeCallSuccess 外呼请求成功
 * @event onMakeCallFailure 外呼请求失败
 */
module.exports = function() {
    var self = this;
    var contentEle = this.element = doc.createElement('div');
    this.numberInput = new NumberInput();
    this.keyboard = new Keyboard(this.numberInput);
    this.callBtn = new CallBtn();
    this.numberInput.onKeyBtnClick = function() {
        self.keyboard.toggleVisible();
    };
    this.keyboard.element.style.marginBottom = '20px';
    this.numberInput.element.style.marginBottom = '20px';
    this.callBtn.element.style.height = '47px';

    contentEle.innerHTML = '';
    contentEle.append(this.numberInput.element);
    contentEle.append(this.keyboard.element);
    contentEle.append(this.callBtn.element);

    var self = this;
    this.callBtn.element.onclick = function(e) {
        utils.isFunction(self.onBeforeCalling) && self.onBeforeCalling();
        makeCall(self.numberInput.getValue(), self.onMakeCallSuccess, self.onMakeCallFailure);
    }
};

function makeCall(callNumber, successCallback, failureCallback) {
    console.log('拨打电话');
    if (/^[\d*#+]{4,}$/.test(callNumber)) {
        utils.isFunction(successCallback) && successCallback();
    } else {
        utils.isFunction(failureCallback) && failureCallback(new Error('电话号码格式不正确'));
        return;
    }

    AjaxUtils.post('/agent_api/v1/desktop/make_call', { number: callNumber }, function(res) {
        switch (res.code) {
            case 1000:
                Alert.success('已发起外呼请求');
                break;
            default:
                Alert.error(res.message || '外呼失败');
        }
    }, function() {
        Alert.error('外呼失败');
    });
}
