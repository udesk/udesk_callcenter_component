/**
 * CallLog创建来自于conversation和tower消息，
 * 但是update时仅处理tower消息
 */
export default class CallLog {
    constructor(opt) {
        for (let i in opt) {
            if (opt.hasOwnProperty(i)) {
                this[i] = opt[i];
            }
        }

        this.can_retrieval = opt.can_retrieval === 'true';
        this.can_hold = opt.can_hold === 'true';
        this.can_transfer = opt.can_transfer === 'true';
        this.can_consult = opt.can_consult === 'true';
        this.can_three_party = opt.can_three_party === 'true';
        this.can_transfer_ivr = opt.can_transfer_ivr === 'true';
        this.can_hangup = opt.can_hangup === 'true';
        this.is_consult = opt.is_consult === 'true';

        //可否咨询后转接
        this.can_transfer_after_consult = this.can_transfer_after_consult === 'true';
        //可否咨询后三方
        this.can_party_after_consult = this.can_party_after_consult === 'true';
        //可否三方后转接
        this.call_transfer_after_party = this.call_transfer_after_party === 'true';
    }

    update(callLog) {
        if (callLog.conversation_id !== this.conversation_id) {
            console.warn('CallLog.update:conversation_id不一致，无法更新');
            return;
        }
        for (let i in callLog) {
            if (callLog.hasOwnProperty(i)) {
                this[i] = callLog[i];
            }
        }

        return this;
    }
}
