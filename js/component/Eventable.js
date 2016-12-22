import Utils from './Tools';

export default class Eventable {
    constructor() {
        this.eventMap = {
            'change': []
        }
    }

    set(k, v) {
        if (this[k] === v) {
            return;
        }
        this[k] = v;
        this.fire('change', k, v, this);
    };

    fire() {
        var eventName = arguments[0];
        var events = this.eventMap[eventName];
        for (var i = 0, len = events.length; i < len; i++) {
            Utils.isFunction(events[i]) && events[i].apply(this, [].splice.call(arguments, 1));
        }
    };

    on(eventName, callback) {
        this.eventMap[eventName].push(callback);
    }
}
