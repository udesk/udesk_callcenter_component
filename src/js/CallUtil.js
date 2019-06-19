import _ from 'lodash';
import AjaxUtils from './AjaxUtils';
import CallConfig from './CallConfig';
import CallInfo from './CallInfo';
import CallQueue from './CallQueue';
import Alert from './component/Alert';
import * as Const from './Const';
import {VOIP_ONLINE} from './Const';
import softPhone from './soft-phone';
import utils from './Tools';

let calling = false;
const emptyFunction = function() {
};
let lastConsultType = 'agent';

/**
 * 外呼
 * @param callNumber
 */
export function makeCall(callNumber) {
    if (calling) {
        return;
    }
    calling = true;

    let options;
    let successCallback;
    let failureCallback;
    if (typeof arguments[1] === 'object') {
        options = arguments[1];
        successCallback = arguments[2];
        failureCallback = arguments[3];
    } else if (typeof arguments[1] === 'function') {
        successCallback = arguments[1];
        failureCallback = arguments[2];
    }

    setTimeout(() => {
        calling = false;
    }, 3000);

    if (CallConfig.agent_work_state === Const.OFFLINE) {
        Alert.error('离线不可以拨打电话');
        utils.isFunction(failureCallback) && failureCallback(new Error('离线不可以外呼'));
        return;
    }
    if (!/^[\d*#+]{4,}$/.test(callNumber)) {
        utils.isFunction(failureCallback) && failureCallback(new Error('电话号码格式不正确'));
        return;
    }

    if (CallConfig.agent_work_way === VOIP_ONLINE) {
        CallInfo.set('can_accept', 'out');
        softPhone.call(callNumber);
        return;
    }

    let params = {number: callNumber};
    if (options && options.biz_id) {
        params.biz_id = options.biz_id;
    }
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/make_call', params, function(res) {
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

export function answer() {
    let ishttps = 'https:' == document.location.protocol ? true : false;
    if (CallConfig.agent_work_way === VOIP_ONLINE && !ishttps) {
        alert('请在https://下登录使用网页电话');
        return;
    }
    if (CallConfig.agent_work_way === VOIP_ONLINE) {
        softPhone.answer();
    }
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
    let ishttps = 'https:' == document.location.protocol ? true : false;
    if (workingWay === 'voip_online' && !ishttps) {
        alert('请在https://下登录使用网页电话');
        return;
    }
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

export function hangup(successCallback = emptyFunction, failureCallback = emptyFunction) {
    if (CallConfig.agent_work_way === VOIP_ONLINE) {
        try {
            softPhone.hangupAllSessions();
            successCallback();
        } catch (e) {
            failureCallback(e);
        }
        return;
    }
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
    lastConsultType = 'agent';
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
    let url = '/agent_api/v1/callcenter/desktop/end_consult';
    if (lastConsultType !== 'agent') {
        url = '/agent_api/v1/callcenter/desktop/end_consult_outline';
    }
    AjaxUtils.post(url, null, function(res) {
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

/**
 * 检查电话号码是否有效
 * @param {string} phoneNumber
 * @return {boolean}
 */
export function phoneNumberCheck(phoneNumber) {
    return /^[\d*#+]{4,}$/.test(phoneNumber);
}

export function getAgents({workState, page, query}, successCallback, failureCallback) {
    let params = {page, callcenter_work_state: workState};
    if (query) {
        params.query = query;
    }
    AjaxUtils.get('/agent_api/v1/callcenter/agents', params, function(res) {
        successCallback(res);
    }, function(error) {
        failureCallback(error);
    });
}

export function getGroups(params, successCallback, failureCallback) {
    AjaxUtils.get('/agent_api/v1/callcenter/desktop/agent_groups', params, function(res) {
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

export function getExternalcontactsSearch(prefix_input = '', page = 1, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.get('/agent_api/v1/callcenter/desktop/external_contacts_prefix_search', {prefix_input: prefix_input, page: page}, function(res) {
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

/**
 * 转接客服组
 */
export function transferToGroup(targetId, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_call', {queue_type: targetId}, function(res) {
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

/**
 * 转接外部电话
 */
export function transferToExternalPhone(phoneNumber, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop//transfer_call_outline', {outline_phone_number: phoneNumber}, function(res) {
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

/**
 * 咨询外部电话
 */
export function startConsultingToExternalPhone(phoneNumber, successCallback = emptyFunction, failureCallback = emptyFunction) {
    lastConsultType = 'outline';
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/start_consult_outline', {outline_phone_number: phoneNumber}, function(res) {
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

/**
 * 三方外部电话
 */
export function startThreeWayCallingToExternalPhone(phoneNumber, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/three_party_outline', {outline_phone_number: phoneNumber}, function(res) {
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

/**
 * 获取自动外呼的值
 */
export function getAutomaticCallNumGroup() {
    return CallInfo.cc_ad_task;
}

/**
 * 更新中继号
 */
export function setupDefaultNumber(phoneNumber_id, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/agents/setup_default_number', {id: phoneNumber_id}, function(res) {
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

export function getCalloutNumbers() {
    return CallConfig.callout_numbers;
}

//咨询后转接
export function transferAfterConsult(agent_no, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_after_consult', {agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(error) {
            failureCallback(error);
        }
    );
}

//咨询后三方
export function threeWayCallingAfterConsult(agent_no, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/three_party_after_consult', {agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(error) {
            failureCallback(error);
        }
    );
}

//三方后转接
export function transferAfterThreeWayCalling(agent_no, successCallback = emptyFunction, failureCallback = emptyFunction) {
    AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_after_three_party', {agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(error) {
            failureCallback(error);
        }
    );
}
