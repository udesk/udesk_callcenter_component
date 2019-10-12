import Eventable from './Eventable';
import CallQueue from './CallQueue';
import find from 'lodash/find';
import remove from 'lodash/remove';
import * as Const from './Const';
import Alert from './component/Alert';
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
        this.cache = [];  //如果正在通话，缓存新的未挂断的通话。
        this.eventMap = {
            change: [],
            ringing: [],
            talking: [],
            hangup: [],
            screenPop: []
        };
        this.cc_ad_task = null;  // { ad_task_id: 1, #任务ID, customer_id: 3, # 用户ID numbers: ["18812345678", "18712345678"] # 号码/号码组}
        let self = this;
        this.on('change', function(k, v, callInfo) {
            let state = self.state;
            if (k === 'state') {
                if (v === 'ringing') {
                    self.set('ringingTime', 0);
                    self.startRingingTiming();
                    clearInterval(self.talkingTimingIntervalId);
                    self.trigger('ringing', self);
                } else if (v === 'talking') {
                    self.set('talkingTime', 0);
                    self.startTalkingTiming();
                    clearInterval(self.ringingTimingIntervalId);
                    self.trigger('talking', self);
                } else if (v === 'hangup') {
                    clearInterval(self.talkingTimingIntervalId);
                    clearInterval(self.ringingTimingIntervalId);
                    self.trigger('hangup', self);
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
        let conversation = find(this.cache, ['conversation_id', callLog.conversation_id]);
        if (conversation) {
            if (callLog.state === Const.HANGUP) {
                remove(this.cache, (i) => i === conversation);
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
        this.setProperties(callLog);
    }

    /**
     * 弹屏
     */
    screenPop() {
        this.readCache();
        this.trigger('screenPop', this);
    }

    manualScreenPop() {
        this.fetchCurrentConversation((res) => {
            if (res.code === 1000) {
                this.trigger('screenPop', res);
            } else {
                Alert.error(res.code_message || '手动弹屏失败');
            }
        });
    }

    fetchCurrentConversation(callback) {
        AjaxUtils.get('/agent_api/v1/callcenter/desktop/current_conversation', null, callback);
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

