import Alert from './component/Alert';
import AjaxUtils from './AjaxUtils';
import utils from './Tools';
import CallConfig from './CallConfig';
import Const from './Const';
import CallQueue from './CallQueue';
import _ from 'lodash';

let calling = false;
const emptyFunction = function() {
};

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

export function setCustomWorkStatus(originalWorkStatus, customStateId, successCallback, failureCallback) {
    AjaxUtils.post('/agent_api/v1/callcenter/agents/agent_work_state', {
        agent_work_state: originalWorkStatus, cc_custom_state_id: customStateId
    }, function() {
        utils.isFunction(successCallback) && successCallback(...arguments);
    }, function() {
        Alert.error('切换在线状态失败');
        utils.isFunction(failureCallback) && failureCallback(...arguments);
    });
}

export function setWorkingWay(workingWay, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/agents/agent_work_way', {agent_work_way: workingWay}, function(res) {
        if (res.code === 1000) {
            successCallback(res);
        } else {
            failureCallback(res);
        }
    }, function() {
        failureCallback(...arguments);
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
            utils.isFunction(failureCallback) && failureCallback(...arguments);
        } else {
            utils.isFunction(successCallback) && successCallback(...arguments);
        }
    }, function() {
        Alert.error('挂断失败！');
        utils.isFunction(failureCallback) && failureCallback(...arguments);
    });
}

export function maskPhoneNumber(phoneNumber) {
    let length = phoneNumber.length;
    let left = phoneNumber.substring(0, (length - 4) / 2);
    let right = phoneNumber.substr(left.length + 4);
    return left + '****' + right;
}

export function showPhoneNumber(customer, agent) {
    if (!customer) {
        return false;
    }

    let permissions = agent.permissions;
    let groups = agent.group_id;
    let agentId = agent.id;
    let customerGroupId = customer.owner_group_id;
    let customerOwnerId = customer.owner_id;

    if (permissions.customer_show_cellphone_all) {
        return true;
    }

    if (permissions.customer_show_cellphone_group && _.includes(groups, customerGroupId)) {
        return true;
    }

    if (permissions.customer_show_cellphone_personal && customerOwnerId === agentId) {
        return true;
    }

    return false;
}

export function transfer(targetId, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_call', {agent_no: targetId}, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function startConsult(targetId, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/start_consult', {agent_no: targetId}, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

//{"code":2050,"message":"目标坐席通话中"}
//{"code":2038,"message":"发起坐席不在通话中"}
//{"code":2034,"message":"目标座席不存在"}
//{"code":2036,"message":"已经有三方参与"}
export function startThreeWayCalling(targetId, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/three_party', {agent_no: targetId}, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function startIvrCalling(node, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_ivr', {
        node_id: node.id, transfer_mode: node.transfer_mode
    }, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function stopConsult(successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/end_consult', null, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function getAgents({workState, page}, successCallback, failureCallback) {
    AjaxUtils.get('/agent_api/v1/callcenter/agents', {page: page, callcenter_work_state: workState}, function(res) {
        successCallback(res);
    }, function(error) {
        failureCallback(error);
    });
}

export function getIvrNodes(successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.get('/agent_api/v1/callcenter/desktop/ivr_nodes', null, function(res) {
        switch (res.code) {
            case 1000:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function holdCallSelect(successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/hold_call', null, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}

export function recoveryCallSelect(successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/retrieval_call', null, function(res) {
        switch (res.code) {
            case 1001:
                successCallback(res);
                break;
            default:
                failureCallback(res);
        }
    }, function(error) {
        failureCallback(error);
    });
}
