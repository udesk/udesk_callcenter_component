import { RINGING, VOIP_ONLINE } from './Const';

export default class CallLog {
    constructor(opt) {
        this.state = opt.state;
        this.call_id = opt.call_id;
        this.conversation_id = opt.conversation_id;
        this.agent_work_way = opt.agent_work_way;
        this.direction = opt.direction;
        this.can_retrieval = opt.can_retrieval === 'true';
        this.can_hold = opt.can_hold === 'true';
        this.can_transfer = opt.can_transfer === 'true';
        this.can_consult = opt.can_consult === 'true';
        this.can_three_party = opt.can_three_party === 'true';
        this.can_transfer_ivr = opt.can_transfer_ivr === 'true';
        this.can_hangup = opt.can_hangup === 'true';
        this.is_consult = opt.is_consult === 'true';
        this.customer = opt.customer;
        this.customer_id = opt.customer_id;
        this.ad_task_id = opt.ad_task_id;
        this.ad_task_numbers = opt.ad_task_numbers;
        this.customer_open_id = opt.customer_open_id;
    }

    update(callLog) {
        if (callLog.conversation_id !== this.conversation_id) {
            console.warn('CallLog.update:conversation_id不一致，无法更新');
            return;
        }
        this.state = callLog.state;
        this.agent_work_way = callLog.agent_work_way;
        this.direction = callLog.direction;
        this.can_retrieval = callLog.can_retrieval;
        this.can_hold = callLog.can_hold;
        this.can_transfer = callLog.can_transfer;
        this.can_consult = callLog.can_consult;
        this.can_three_party = callLog.can_three_party;
        this.can_transfer_ivr = callLog.can_transfer_ivr;
        this.can_hangup = callLog.can_hangup;
        this.is_consult = callLog.is_consult;
        this.customer = callLog.customer;
        this.customer_id = callLog.customer_id;
        this.ad_task_id = callLog.ad_task_id;
        this.ad_task_numbers = callLog.ad_task_numbers;
        this.customer_open_id = callLog.customer_open_id;
        return this;
    }
}
