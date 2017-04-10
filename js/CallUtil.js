import Alert from './component/Alert';
import AjaxUtils from './AjaxUtils';
import utils from './Tools';
import CallConfig from './CallConfig';
import Const from './Const';

export function makeCall(callNumber, successCallback, failureCallback) {
    if (CallConfig.agent_work_state !== Const.IDLE) {
        Alert.error('只能在空闲中拨打电话');
        return;
    }
    if (/^[\d*#+]{4,}$/.test(callNumber)) {
        utils.isFunction(successCallback) && successCallback();
    } else {
        utils.isFunction(failureCallback) && failureCallback(new Error('电话号码格式不正确'));
        return;
    }

    AjaxUtils.post('/agent_api/v1/callcenter/desktop/make_call', { number: callNumber }, function(res) {
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
