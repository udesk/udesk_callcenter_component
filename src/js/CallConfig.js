import * as Const from './Const';
import Eventable from './Eventable';

class CallConfig extends Eventable {
    constructor() {
        super();
        this.agent_work_state = Const.OFFLINE;
        this.agent_work_way = Const.FIXED_VOIP_ONLINE;
        this.default_callout_number = null;
        this.callout_numbers = [];
        this.enableVoipOnline = false;
    }

    setAgentWorkState(state) {
        if (this.agent_work_state === state) {
            return;
        }
        this.agent_work_state = state;
        this.trigger('change', 'agent_work_state', state, this);
    }

    setAgentWorkWay(way) {
        if (this.agent_work_way === way) {
            return;
        }
        this.agent_work_way = way;
        this.trigger('change', 'agent_work_way', way, this);
    }
    setDefaultCalloutNumber(num) {
        if (this.default_callout_number === num) {
            return;
        }
        this.default_callout_number = num;
        this.trigger('change', 'default_callout_number', num, this);
    }
    set(k, v) {
        if (this[k] === v) {
            return;
        }
        this[k] = v;
        this.trigger('change', k, v, this);
    }
    reset(){
        this.agent_work_state = Const.OFFLINE;
        this.agent_work_way = Const.FIXED_VOIP_ONLINE;
        this.enableVoipOnline = false;
    }
}

export default new CallConfig();
