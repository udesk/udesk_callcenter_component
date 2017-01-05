import Const from './Const';
import DropdownBtn from './Dropdown.js';
import AjaxUtils from './AjaxUtils';
import Alert from './Alert';
import CallConfig from './CallConfig';
import React from 'react';
import Dropdown from './Dropdown';
import CallInfo from './CallInfo';

var doc = document;
var agentStateMap = {};

agentStateMap[Const.IDLE] = '空闲';
agentStateMap[Const.BUSY] = '忙碌';
agentStateMap[Const.RESTING] = '小休';
agentStateMap[Const.OFFLINE] = '离线';
agentStateMap[Const.NEATEN] = '整理中';
agentStateMap[Const.TALKING] = '通话中';
agentStateMap[Const.RINGING] = '振铃中';

export default class AgentStatePanelComponent extends React.Component {
    constructor() {
        super();
        this.agentStateMap = [
            { id: Const.IDLE, value: <div className={'work-state-' + Const.IDLE}><i></i>空闲</div> },
            { id: Const.BUSY, value: <div className={'work-state-' + Const.BUSY}><i></i>忙碌</div> },
            { id: Const.RESTING, value: <div className={'work-state-' + Const.RESTING}><i></i>小休</div> },
            { id: Const.OFFLINE, value: <div className={'work-state-' + Const.OFFLINE}><i></i>离线</div> },
            { id: Const.NEATEN, value: <div className={'work-state-' + Const.BUSY}><i></i>整理中</div>, hide: true }
        ];

        this.agentWayMap = [
            { id: Const.FIXED_VOIP_ONLINE, value: 'IP话机' },
            { id: Const.PHONE_ONLINE, value: '手机' }
        ];

        this.state = {
            agent_work_state: CallConfig.agent_work_state,
            agent_work_way: CallConfig.agent_work_way,
            callState: Const.HANGUP
        };

        let self = this;
        CallConfig.on('change', function(k, v) {
            if (k === 'agent_work_state') {
                self.setState({
                    agent_work_state: v
                });
            } else if (k === 'agent_work_way') {
                self.setState({
                    agent_work_way: v
                });
            }
        });

        CallInfo.on('change', function(k, v) {
            if (k === 'state') {
                self.setState({ callState: v });
            }
        })
    }

    render() {
        return <div className="agent-state-panel">
            {
                (function() {
                    if (this.state.callState === Const.HANGUP) {
                        return <Dropdown direction={this.props.dropdownDirection} content={this.agentStateMap}
                                         value={this.state.agent_work_state} className="state-select"
                                         onChange={this.updateAgentWorkState}
                        />
                    } else if (this.state.callState === Const.TALKING) {
                        return <div className="pull-right working">
                            <div className={'work-state-' + Const.TALKING}><i></i>通话中</div>
                        </div>
                    } else if (this.state.callState === Const.RINGING) {
                        return <div className="pull-right working">
                            <div className={'work-state-' + Const.RINGING}><i></i>振铃中</div>
                        </div>
                    }
                }).call(this)
            }

            <Dropdown direction={this.props.dropdownDirection} content={this.agentWayMap}
                      value={this.state.agent_work_way} className="way-select"
                      onChange={this.updateAgentWorkWay.bind(this)}
            />
        </div>
    }

    updateAgentWorkState(state) {
        AjaxUtils.post('/agent_api/v1/callcenter/agents/agent_work_state', { agent_work_state: state.id }, function() {
        }, function() {
            Alert.error('切换在线状态失败');
        });
    }

    updateAgentWorkWay(way) {
        if (this.state.callState !== Const.HANGUP) {
            Alert.error('只能在挂断的时候切换在线方式');
            return;
        }
        AjaxUtils.post('/agent_api/v1/callcenter/agents/agent_work_way', { agent_work_way: way.id }, function() {
        }, function() {
            Alert.error('切换在线方式失败');
        });
    }
};