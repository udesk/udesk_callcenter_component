//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
import _ from 'lodash';
import {decrypt} from './aes-256-cbc';
import AjaxUtils from './AjaxUtils';
import CallConfig from './CallConfig';
import * as Const from './Const';
import Eventable from './Eventable';

function fetchConversation(conversationId, callback) {
    AjaxUtils.get('/agent_api/v1/callcenter/desktop/conversation', {conversation_id: conversationId}, callback);
}

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
        fetchConversation(callLog.conversation_id, function(res) {
            if (CallConfig.encrypt_cellphone_number) {
                res.customer_phone = decrypt(res.customer_phone, res.key);
            }
            if (existingCallLog) {
                //忽略错过的通知
                if (_.some([Const.RINGING], callLog.state) && existingCallLog.state === Const.TALKING) {
                    return;
                }
                if (_.some([Const.HANGUP], callLog.state) && (existingCallLog.state === Const.TALKING || existingCallLog.state === Const.RINGING)) {
                    return;
                }

                existingCallLog.update(_.assign(callLog, res));
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

}

export default new CallQueue();
