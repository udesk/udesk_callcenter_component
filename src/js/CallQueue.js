//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
import _ from 'lodash';
import AjaxUtils from './AjaxUtils';
import * as Const from './Const';
import Eventable from './Eventable';

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
        let existingCallLog = _.find(this.queue, ['conversation_id', callLog.conversation_id]);
        let self = this;
        this.fetchConversation(callLog.conversation_id, function(res) {
            if (existingCallLog) {
                //忽略错过的通知
                if (_.some([Const.RINGING], callLog.state) && existingCallLog.state === Const.TALKING) {
                    return;
                }
                if (_.some([Const.HANGUP], callLog.state) && (existingCallLog.state === Const.TALKING || existingCallLog.state === Const.RINGING)) {
                    return;
                }

                existingCallLog.update(_.assign(res, callLog));
                self.trigger('change', existingCallLog);
            } else {
                let conversation = _.assign(callLog, res);
                self.queue.push(conversation);
                self.trigger('add', conversation);
            }
        });
        return this;
    }

    get(conversationId) {
        return _.find(this.queue, (i) => i.conversation_id === conversationId);
    }

    fetchConversation(conversationId, callback) {
        AjaxUtils.get('/agent_api/v1/callcenter/desktop/conversation', {conversation_id: conversationId}, callback);
    }
}

export default new CallQueue();
