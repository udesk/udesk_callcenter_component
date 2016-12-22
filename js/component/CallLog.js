var CallLog = function(opt) {
    this.state = opt.state;
    this.call_id = opt.call_id;
    this.conversation_id = opt.conversation_id;
    this.agent_work_way = opt.agent_work_way;
    this.direction = opt.direction;
    this.can_transfer = opt.can_transfer;
};

CallLog.prototype.update = function(callLog) {
    if (callLog.conversation_id !== this.conversation_id) {
        console.warn('CallLog.update:conversation_id不一致，无法更新');
        return;
    }
    this.state = callLog.state;
    this.agent_work_way = callLog.agent_work_way;
    this.direction = callLog.direction;
    this.can_transfer = callLog.can_transfer;
    return this;
};

module.exports = CallLog;