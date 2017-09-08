import Const from './Const';
import Eventable from './Eventable';

class CallConfig extends Eventable {
    constructor() {
        super();
        this.agent_work_state = Const.OFFLINE;
        this.agent_work_way = Const.FIXED_VOIP_ONLINE;
    }

    setAgentWorkState(state) {
        if (this.agent_work_state === state) {
            return;
        }
        this.agent_work_state = state;
        this.fire('change', 'agent_work_state', state, this);
    }

    setAgentWorkWay(way) {
        if (this.agent_work_way === way) {
            return;
        }
        this.agent_work_way = way;
        this.fire('change', 'agent_work_way', way, this);
    }

    set(k, v) {
        if (this[k] === v) {
            return;
        }
        this[k] = v;
        this.fire('change', k, v, this);
    }
}

export default new CallConfig();
