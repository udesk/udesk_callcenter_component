import Eventable from './Eventable';
import CallQueue from './CallQueue';
import _ from 'lodash';
import AjaxUtils from './AjaxUtils';
import Const from './Const';
import Agent from './Agent';

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
        this.cache = [];  //如果正在通话，缓存新的未挂断的通话。
        this.eventMap = {
            change: [],
            ringing: [],
            talking: [],
            hangup: [],
            screenPop: []
        };

        let self = this;
        this.on('change', function(k, v, callInfo) {
            let state = self.state;
            if (k === 'state') {
                if (v === 'ringing') {
                    self.set('ringingTime', 0);
                    self.startRingingTiming();
                    clearInterval(self.talkingTimingIntervalId);
                    self.fire('ringing', self);
                } else if (v === 'talking') {
                    self.set('talkingTime', 0);
                    self.startTalkingTiming();
                    clearInterval(self.ringingTimingIntervalId);
                    self.fire('talking', self);
                } else if (v === 'hangup') {
                    clearInterval(self.talkingTimingIntervalId);
                    clearInterval(self.ringingTimingIntervalId);
                    self.fire('hangup', self);
                }
            }
            //if (k === 'conversation_id') {
            //    self.set('call_type', res.call_type);
            //    self.set('queue_desc', res.queue_desc);
            //    self.set('customer_phone', res.customer_phone);
            //    self.set('phone_location', res.phone_location);
            //}
        });

        CallQueue.on('change', function(v) {
            //当新消息到来并且与当前弹屏的conversation_id一致，跳过cache，直接更新callInfo
            if (v.conversation_id === self.conversation_id) {
                self.updateFromCallLog(v);
            } else {
                self.updateCache(v);
                self.screenPop(v);
            }
        });

        //当有新的callLog时，放到cache中
        CallQueue.on('add', function(callLog) {
            if (callLog.state !== 'hangup') {
                self.updateCache(callLog);
                self.screenPop(callLog);
            }
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

    /**
     * 更新cache
     * @param callLog
     */
    updateCache(callLog) {
        let conversation = _.find(this.cache, ['conversation_id', callLog.conversation_id]);
        if (conversation) {
            if (callLog.state === Const.HANGUP) {
                _.remove(this.cache, (i) => i === conversation);
            }
        } else {
            if (callLog.state === Const.HANGUP) {
                return;
            }
            this.cache.push(callLog);
        }
    }

    /**
     * 读取缓存的第一条callLog
     */
    readCache() {
        this.updateFromCallLog(this.cache.shift());
    }

    /**
     * 更新弹屏信息
     * @param callLog
     */
    updateFromCallLog(callLog) {
        let self = this;
        _.forIn(callLog, function(v, k) {
            self.set(k, v);
        });
    }

    /**
     * 弹屏
     */
    screenPop() {
        if (this.state === Const.HANGUP) {
            this.readCache();
        }
        this.fire('screenPop', this);
    }

    //fetchConversation() {
    //    let self = this;
    //    AjaxUtils.get("/agent_api/v1/callcenter/desktop/conversation", { conversation_id: this.conversation_id }, function(res) {
    //        self.set('call_type', res.call_type);
    //        self.set('queue_desc', res.queue_desc);
    //        self.set('customer_phone', res.customer_phone);
    //        self.set('phone_location', res.phone_location);
    //    });
    //}
}

export default new CallInfo();

