import Eventable from './Eventable';
import CallQueue from './CallQueue';
import _ from 'lodash';
import AjaxUtils from './AjaxUtils';

class CallInfo extends Eventable {
    constructor() {
        super();
        this.queue_desc = '';
        this.customer_phone = '';
        this.phone_location = '';
        this.ringingTime = 0;
        this.talkingTime = 0;
        this.call_type = '呼入';
        this.queue_desc = '';
        this.state = 'hangup';

        let self = this;
        this.on('change', function(k, v, callInfo) {
            let state = self.state;
            if (k === 'state') {
                if (v === 'ringing') {
                    self.set('ringingTime', 0);
                    self.startRingingTiming();
                    clearInterval(self.talkingTimingIntervalId);
                } else if (v === 'talking') {
                    self.set('talkingTime', 0);
                    self.startTalkingTiming();
                    clearInterval(self.ringingTimingIntervalId);
                } else if (v === 'hangup') {
                    clearInterval(self.talkingTimingIntervalId);
                    clearInterval(self.ringingTimingIntervalId);
                }
            }
            if (k === 'conversation_id') {
                self.fetchConversation();
            }
        });

        CallQueue.on('change', function(v) {
            if (v.conversation_id === self.conversation_id) {
                _.forIn(v, function(v, k) {
                    self.set(k, v);
                });
            }
        });

        CallQueue.on('add', function(callLog) {
            _.forIn(callLog, function(v, k) {
                self.set(k, v);
            });
        });
    }

    startRingingTiming() {
        let self = this;
        clearInterval(this.ringingTimingIntervalId);
        this.ringingTimingIntervalId = setInterval(function() {
            self.set('ringingTime', self.ringingTime + 1);
        }, 1000);
    }

    startTalkingTiming() {
        let self = this;
        clearInterval(this.talkingTimingIntervalId);
        this.talkingTimingIntervalId = setInterval(function() {
            self.set('talkingTime', self.talkingTime + 1);
        }, 1000);
    }

    fetchConversation() {
        let self = this;
        AjaxUtils.get("/agent_api/v1/callcenter/desktop/conversation", { conversation_id: this.conversation_id }, function(res) {
            self.set('call_type', res.call_type);
            self.set('queue_desc', res.queue_desc);
            self.set('customer_phone', res.customer_phone);
            self.set('phone_location', res.phone_location);
        });
    }
}

export default new CallInfo();

