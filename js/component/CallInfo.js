import Eventable from './Eventable';

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
    }

    set(k, v) {
        if (this[k] === v) {
            return;
        }
        this[k] = v;
        this.fire('change', k, v, this);
    }
}

export default new CallInfo();

