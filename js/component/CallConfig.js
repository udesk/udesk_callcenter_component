import Const from './Const';
import Eventable from './Eventable';

class CallConfig extends Eventable {
    constructor() {
        super();
        this.agent_work_state = Const.OFFLINE;
        this.agent_work_way = Const.FIXED_VOIP_ONLINE;
    }

    setAgentWorkState(state) {
        this.agent_work_state = state;
        this.fire('change', this);
    }

    setAgentWorkWay(way) {
        this.agent_work_way = way;
        this.fire('change', this);
    }

    set(k, v) {
        this[k] = v;
        this.fire('change', k, v);
    }
}

export default new CallConfig();