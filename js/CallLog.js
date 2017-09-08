export default class CallLog {
    constructor(opt) {
        this.state = opt.state;
        this.call_id = opt.call_id;
        this.conversation_id = opt.conversation_id;
        this.agent_work_way = opt.agent_work_way;
        this.direction = opt.direction;
        this.can_transfer = opt.can_transfer === 'true';
        this.can_consult = opt.can_consult === 'true';
        this.can_three_party = opt.can_three_party === 'true';
        this.can_hangup = opt.can_hangup === 'true';
        this.is_consult = opt.is_consult === 'true';
    }

    update(callLog) {
        if (callLog.conversation_id !== this.conversation_id) {
            console.warn('CallLog.update:conversation_id不一致，无法更新');
            return;
        }
        this.state = callLog.state;
        this.agent_work_way = callLog.agent_work_way;
        this.direction = callLog.direction;
        this.can_transfer = callLog.can_transfer;
        this.can_consult = callLog.can_consult;
        this.can_three_party = callLog.can_three_party;
        this.can_hangup = callLog.can_hangup;
        this.is_consult = callLog.is_consult;
        return this;
    }
}
