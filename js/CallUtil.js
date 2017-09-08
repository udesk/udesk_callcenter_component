import Alert from './component/Alert';
import AjaxUtils from './AjaxUtils';
import utils from './Tools';
import CallConfig from './CallConfig';
import Const from './Const';
import CallQueue from './CallQueue';
import _ from 'lodash';

let calling = false;

export function makeCall(callNumber, successCallback, failureCallback) {
    if (calling) {
        return;
    }
    calling = true;

    setTimeout(() => {
        calling = false;
    }, 3000);

    if (CallConfig.agent_work_state === Const.OFFLINE) {
        Alert.error('离线不可以拨打电话');
        utils.isFunction(failureCallback) && failureCallback(new Error('离线不可以外呼'));
        return;
    }
    if (/^[\d*#+]{4,}$/.test(callNumber)) {
        utils.isFunction(successCallback) && successCallback();
    } else {
        utils.isFunction(failureCallback) && failureCallback(new Error('电话号码格式不正确'));
        return;
    }

    AjaxUtils.post('/agent_api/v1/callcenter/desktop/make_call', {number: callNumber}, function(res) {
        switch (res.code) {
            case 1000:
                Alert.success('已发起外呼请求');
                utils.isFunction(successCallback) && successCallback();
                break;
            default:
                Alert.error(res.message || '外呼失败');
                utils.isFunction(failureCallback) && failureCallback(new Error('外呼失败'));
        }
    }, function() {
        Alert.error('外呼失败');
        utils.isFunction(failureCallback) && failureCallback(new Error('外呼失败'));
    });
}

export function setWorkStatus(workStatus, successCallback, failureCallback) {
    AjaxUtils.post('/agent_api/v1/callcenter/agents/agent_work_state', {agent_work_state: workStatus}, function() {
        utils.isFunction(successCallback) && successCallback(...arguments);
    }, function() {
        Alert.error('切换在线状态失败');
        utils.isFunction(failureCallback) && failureCallback(...arguments);
    });
}

export function hangup(successCallback, failureCallback) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/drop_call', null, function(res) {
        if (res.code === 2049) {
            _.forEach(CallQueue.queue, (i) => {
                if (i.state !== 'hangup') {
                    let callLogCopy = _.clone(i);
                    callLogCopy.state = 'hangup';
                    CallQueue.put(callLogCopy);
                }
            });
            return;
        }
        if (res.code !== 1001) {
            Alert.error(res.code_message || '挂断失败！');
            utils.isFunction(successCallback) && successCallback(...arguments);
        }
    }, function() {
        Alert.error('挂断失败！');
        utils.isFunction(failureCallback) && failureCallback(...arguments);
    });
}
