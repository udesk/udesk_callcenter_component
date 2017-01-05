//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
import Const from './Const';
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
        for (let i = 0, len = this.queue.length; i < len; i++) {
            let v = this.queue[i];
            if (v.conversation_id === callLog.conversation_id) {
                if (v.state === Const.HANGUP) {
                    return;
                }
                if (callLog.state === Const.RINGING) {
                    return;
                }
                v.update(callLog);
                this.fire('change', v);
                return;
            }
        }
        this.queue.push(callLog);
        this.fire('add', callLog);
        return this;
    }

    get(conversationId) {
        for (let i = 0, len = this.queue.length; i < len; i++) {
            if (conversationId === this.queue[i].conversation_id) {
                return this.queue[i];
            }
        }
    };
}

export default new CallQueue();