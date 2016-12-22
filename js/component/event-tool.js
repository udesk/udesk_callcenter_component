var EventCenter = function() {
};

EventCenter.prototype.addEventListener = function(obj, eventName, handler) {
    if (!obj.__eventMap) {
        obj.__eventMap = {};
    }

    var eventHandlers = obj.__eventMap[eventName];
    if (eventHandlers) {
        eventHandlers.push(handler);
    } else {
        obj.__eventMap[eventName] = [handler];
    }
};

EventCenter.prototype.fire = function() {
    if (arguments.length < 2) {
        throw new Error('参数不正确，至少两个参数，1、触发事件的目标，2、触发的事件名称');
    }
    var target = arguments[0];
    var eventMap = target.__eventMap;
    var eventName = arguments[1];
    var handlers = eventMap[eventName];
    if (!handlers) {
        throw new Error('找不到名称为"' + eventName + '"的事件');
    }

    for (var i, len = handlers.length; i < len; i++) {
        handlers[i].apply(target, arguments.splice(1));
    }
};

module.exports = new EventCenter();