//["notice",{"type":"call_log","state":"ringing","call_id":"161205154856651300010177000a1772","conversation_id":"3274167","agent_work_way":"phone_online","direction":"in","can_transfer":"true"}]
var Const = require('./Const');
var CallLog = require('./CallLog');

var CallQueue = function() {
    this.queue = [];
    this.eventMap = {
        change: []
    };
};

CallQueue.prototype.on = function(eventName, callback) {
    this.eventMap[eventName].push(callback);
};

CallQueue.prototype.fire = function() {
    var eventName = arguments[0];
    var args = [].splice.call(arguments, 1);
    var callbacks = this.eventMap[eventName];

    for (var i = 0, len = callbacks.length; i < len; i++) {
        callbacks[i].apply(this, args);
    }
};

CallQueue.prototype.put = function(callLog) {
    for (var i = 0, len = this.queue.length; i < len; i++) {
        var v = this.queue[i];
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
    this.fire('change', callLog);
    return this;
};

CallQueue.prototype.get = function(conversationId) {
    for (var i = 0, len = this.queue.length; i < len; i++) {
        if (conversationId === this.queue[i].conversation_id) {
            return this.queue[i];
        }
    }
};

module.exports = new CallQueue();