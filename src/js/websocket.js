import CallConfig from './CallConfig';
import CallInfo from './CallInfo';
import CallLog from './CallLog';
import CallQueue from './CallQueue';
import Alert from './component/Alert';
import {VOIP_ONLINE} from './Const';
import Eventable from './Eventable';
import Socket from './socket';
import softPhone from './soft-phone';
import {isFunction} from './Tools';

function updateCallInfo(msg) {
    CallInfo.set('can_consult', msg.can_consult === 'true');
    CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
    CallInfo.set('can_three_party', msg.can_three_party === 'true');
    CallInfo.set('can_transfer', msg.can_transfer === 'true');
    CallInfo.set('can_transfer_ivr', msg.can_transfer_ivr === 'true');

    //可否咨询后转接
    CallInfo.set('can_transfer_after_consult', msg.can_transfer_after_consult === 'true');
    //可否咨询后三方
    CallInfo.set('can_party_after_consult', msg.can_party_after_consult === 'true');
    //可否三方后转接
    CallInfo.set('can_transfer_after_party', msg.can_transfer_after_party === 'true');
}

class WebsocketConnection extends Eventable {
    init(tower_url, user_id) {
        this._socket = new Socket(tower_url, user_id);
        this._socket.onNotice((msg) => {
            if (isFunction(this[msg.type])) {
                this[msg.type](msg);
            }
        });
        this._socket.onException(function(msg) {
            switch (msg.error) {
            case 'connected_at_other_place':
                Alert.error(msg.message);
            }
        });
    }

    call_log(msg) {

        if (msg.state === 'ringing' && msg.ad_task_id) {
            CallInfo.set('cc_ad_task', {ad_task_id: msg.ad_task_id, customer_id: msg.customer_id, numbers: msg.ad_task_numbers.split(',')});
        }

        CallQueue.put(new CallLog(msg));
    }

    seat_status(msg) {
        let workWay = msg.agent_work_way;
        let workState = msg.agent_work_state;
        CallConfig.set('agent_work_way', workWay);
        if (workWay === VOIP_ONLINE) {
            softPhone.start();
        } else {
            softPhone.stop();
        }
        if (msg.cc_custom_state_id) {
            CallConfig.set('agent_work_state', workState + '_' + msg.cc_custom_state_id);
        } else {
            CallConfig.set('agent_work_state', workState);
        }
    }

    consult_result(msg) {
        updateCallInfo(msg);

        this.trigger('consultResult', msg);
    }

    three_party(msg) {
        updateCallInfo(msg);

        this.trigger('threeWayCallingResult', msg);
    }

    transfer_result(msg) {
        this.trigger('transferResult', msg);
    }

    drop_call(msg) {
        this.trigger('dropCall', msg);
    }

    transfer_ivr_result(msg) {
        updateCallInfo(msg);
        this.trigger('ivrCallResult', msg);
    }

    resume_agent_result(msg) {
        updateCallInfo(msg);

        this.trigger('resumeAgentResult', msg);
    }

    hold_call(msg) {
        CallInfo.set('can_retrieval', msg.can_retrieval === 'true');
        CallInfo.set('can_hold', msg.can_hold === 'true');
    }

    retrieval_call(msg) {
        CallInfo.set('can_retrieval', msg.can_retrieval === 'true');
        CallInfo.set('can_hold', msg.can_hold === 'true');
    }

    barge_in(data) {
        switch (data.code) {
        case '1000':
            Alert.success('强插成功');
            break;
        default:
            Alert.error('强插失败');
        }
    }

    listening_result(data) {
        switch (data.code) {
        case '1000':
            Alert.success('监听成功');
            break;
        default:
            Alert.error('监听失败');
        }
    }

    substitute_result(data) {

        switch (data.code) {
        case '1000':
            Alert.success('拦截成功');
            break;
        default:
            Alert.error('拦截失败');
        }
    }

    destroy() {
        if (this._socket) {
            this._socket.destroy();
            this._socket = null;
        }
    }
}

export default new WebsocketConnection();
