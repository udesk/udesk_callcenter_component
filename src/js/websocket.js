import Socket from './socket';
import softPhone from './soft-phone';
import CallQueue from './CallQueue';
import CallLog from './CallLog';
import Alert from './component/Alert';
import CallConfig from './CallConfig';
import { VOIP_ONLINE } from './Const';
import CallInfo from './CallInfo';
import { isFunction } from './Tools';
import Eventable from './Eventable';

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
        CallInfo.set('can_consult', msg.can_consult === 'true');
        CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
        CallInfo.set('can_three_party', msg.can_three_party === 'true');
        CallInfo.set('can_transfer', msg.can_transfer === 'true');

        this.trigger('consultResult', msg);
    }

    three_party(msg) {
        CallInfo.set('can_consult', msg.can_consult === 'true');
        CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
        CallInfo.set('can_three_party', msg.can_three_party === 'true');
        CallInfo.set('can_transfer', msg.can_transfer === 'true');

        this.trigger('threeWayCallingResult', msg);
    }

    transfer_result(msg) {
        this.trigger('transferResult', msg);
    }

    drop_call(msg) {
        this.trigger('dropCall', msg);
    }

    transfer_ivr_result(msg) {
        CallInfo.set('can_consult', msg.can_consult === 'true');
        CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
        CallInfo.set('can_three_party', msg.can_three_party === 'true');
        CallInfo.set('can_transfer', msg.can_transfer === 'true');
        CallInfo.set('can_transfer_ivr', msg.can_transfer_ivr === 'true');

        this.trigger('ivrCallResult', msg);
    }

    resume_agent_result(msg) {
        CallInfo.set('can_consult', msg.can_consult === 'true');
        CallInfo.set('can_end_consult', msg.can_end_consult === 'true');
        CallInfo.set('can_three_party', msg.can_three_party === 'true');
        CallInfo.set('can_transfer', msg.can_transfer === 'true');
        CallInfo.set('can_transfer_ivr', msg.can_transfer_ivr === 'true');

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
}

export default new WebsocketConnection();
