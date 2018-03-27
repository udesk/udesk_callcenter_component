import Utils from './Tools';
import _ from 'lodash';

export default class Eventable {
    constructor() {
        this.eventMap = {
            'change': []
        };
    }

    set(k, v) {
        if (this[k] === v) {
            return;
        }
        this[k] = v;
        this.trigger('change', k, v, this);
    }

    setProperties(obj) {
        let changedFields = [];
        _.forIn(obj, (v, k) => {
            if (this[k] !== v) {
                this[k] = v;
                changedFields.push(k);
            }
        });
        _.forEach(changedFields, (i) => this.trigger('change', i, this[i]));
    }

    trigger() {
        let eventName = arguments[0];
        let events = this._getEvents(eventName);

        let args = [].splice.call(arguments, 1);
        for (let i = 0, len = events.length; i < len; i++) {
            Utils.isFunction(events[i]) && events[i].apply(this, args);
        }
    };

    on(eventName, callback) {
        this._getEvents(eventName).push(callback);
    }

    _getEvents(eventName) {
        let events = this.eventMap[eventName];
        if (!events) {
            events = this.eventMap[eventName] = [];
        }
        return events;
    }

    off(eventName, callback) {
        if (this.eventMap[eventName]) {
            _.remove(this.eventMap[eventName], (i) => i === callback);
        }
    }
}
