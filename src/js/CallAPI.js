'use strict';
import AjaxUtils from './AjaxUtils';
// import utils from './Tools';
import Alert from './component/Alert';
const emptyFunction = function() {
};
class CallAPI {
    tokenInit(token,subDomain,onTokenExpired){
        AjaxUtils.token = token;
        AjaxUtils.host = __protocol__ + '://' + subDomain + __server__;
        AjaxUtils.refreshToken = onTokenExpired;
    }
    _updateAgentWorkState(agent_no,workStatus,cc_custom_state_id,successCallback = emptyFunction, failureCallback = emptyFunction) {
        let params = {};
        if (cc_custom_state_id !== undefined) {
            params.cc_custom_state_id = cc_custom_state_id;
        }
        params.agent_work_state = workStatus;
        params.agent_no = agent_no;

        AjaxUtils.post('/agent_api/v1/callcenter/agents/update_agent_work_state', params, function(res) {
            switch (res.code) {
                case 1000:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(res) {
            failureCallback(res);
        });
    }
    setMonitorWorkStatus(agent_no,workStatus, successCallback = emptyFunction, failureCallback = emptyFunction) {
        this._updateAgentWorkState(agent_no,workStatus,undefined,successCallback,failureCallback)
    }
    setMonitorWorkRestingStatus(agent_no,cc_custom_state_id, successCallback = emptyFunction, failureCallback = emptyFunction) {
        this._updateAgentWorkState(agent_no,'resting',cc_custom_state_id,successCallback,failureCallback)
    }
    setMonitorAgentWorkWay(agent_no,agent_work_way, successCallback = emptyFunction, failureCallback = emptyFunction) {
        AjaxUtils.post('/agent_api/v1/callcenter/agents/update_agent_work_way', {agent_no:agent_no,agent_work_way:agent_work_way}, function(res) {
            switch (res.code) {
                case 1000:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(res) {
            failureCallback(res);
        });
    }
    monitorAgentListening(agent_no,successCallback = emptyFunction, failureCallback = emptyFunction){
        AjaxUtils.post('/agent_api/v1/callcenter/desktop/listeing', {agent_no:agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(res) {
            failureCallback(res);
        });
    }
    monitorAgentInterpose(agent_no,successCallback = emptyFunction, failureCallback = emptyFunction){
        AjaxUtils.post('/agent_api/v1/callcenter/desktop/interpose', {agent_no:agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(res) {
            failureCallback(res);
        });
    }
    monitorAgentSubstitute(agent_no,successCallback = emptyFunction, failureCallback = emptyFunction){
        AjaxUtils.post('/agent_api/v1/callcenter/desktop/substitute', {agent_no:agent_no}, function(res) {
            switch (res.code) {
                case 1001:
                    successCallback(res);
                    break;
                default:
                    failureCallback(res);
            }
        }, function(res) {
            failureCallback(res);
        });
    }
}

window.callAPI = new CallAPI();
