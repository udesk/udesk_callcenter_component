//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
import * as Const from './Const';
import Eventable from './Eventable';
import _ from 'lodash';
import AjaxUtils from './AjaxUtils';
import Agent from './Agent';

class CallQueue extends Eventable {
    constructor() {
        super();
        this.queue = [];
        this.eventMap = {
            change: [],
            add: []
        };
    }

    put(callLog) {
        let existingCallLog = _.find(this.queue, {'conversation_id': callLog.conversation_id});
        let self = this;
        if (existingCallLog) {
            //如果通话已经挂断了，忽略所有的callLog
            // if (existingCallLog.state === Const.HANGUP) {
            //     return;
            // }
            //如果通话是talking，忽略ringing或者talking的callLog
            if (_.some([Const.RINGING, Const.TALKING], callLog.state) && existingCallLog.state === Const.TALKING) {
                return;
            }

            existingCallLog.update(callLog);
            this.trigger('change', existingCallLog);
            return;
        }
        self.queue.push(callLog);
        this.fetchConversation(callLog.conversation_id, function(res) {
            let conversation = _.assign(callLog, res);
            self.trigger('add', conversation);
        });
        return this;
    }

    get(conversationId) {
        return _.find(this.queue, (i) => i.conversation_id === conversationId);
    }

    fetchConversation(conversationId, callback) {
        AjaxUtils.get("/agent_api/v1/callcenter/desktop/conversation", { conversation_id: conversationId }, callback);
    }
}

export default new CallQueue();
