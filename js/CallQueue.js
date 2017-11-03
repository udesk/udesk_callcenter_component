//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
import Const from './Const';
import Eventable from './Eventable';
import _ from 'lodash';
import AjaxUtils from './AjaxUtils';

class CallQueue extends Eventable {
    constructor() {
        super();
        this.queue = [];
        this.eventMap = {
            change: [],
            add: []
        };
        this.callLogCache = [];
    }

    put(callLog) {
        let existingCallLog = _.find(this.queue, ['conversation_id', callLog.conversation_id]);
        let self = this;

        if (existingCallLog) {
            //如果通话已经挂断了，忽略所有的callLog
            if (existingCallLog.state === Const.HANGUP) {
                return;
            }
            //如果通话是talking，忽略ringing或者talking的callLog
            if (_.some([Const.RINGING, Const.TALKING], callLog.state) && existingCallLog.state === Const.TALKING) {
                return;
            }

            existingCallLog.update(callLog);
            this.fire('change', existingCallLog);
            return;
        }

        if (this.fetching) {
            this.callLogCache.push(callLog);
            return;
        }

        this.fetching = true;
        this.queue.push(callLog);
        this.fetchConversation(callLog.conversation_id, function(res) {
            let conversation = _.assign(callLog, res);
            self.fire('add', conversation);
            self.fetching = false;
            self.readCache();
        }, () => {
            this.fetching = false;
            self.readCache();
        });
        return this;
    }

    readCache() {
        let lastCallLog = this.callLogCache.shift();
        if (lastCallLog) {
            this.put(lastCallLog);
        }
    }

    get(conversationId) {
        return _.find(this.queue, (i) => i.conversation_id === conversationId);
    }

    fetchConversation(conversationId, callback, failCallback) {
        AjaxUtils.get('/agent_api/v1/callcenter/desktop/conversation', {conversation_id: conversationId}, callback, failCallback);
    }
}

export default new CallQueue();
