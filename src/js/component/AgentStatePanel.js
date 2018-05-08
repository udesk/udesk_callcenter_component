import * as Const from '../Const';
import Alert from './Alert';
import CallConfig from '../CallConfig';
import React from 'react';
import Dropdown from './Dropdown';
import CallInfo from '../CallInfo';
import * as callUtil from '../CallUtil';

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
    constructor(props) {
        super();

        this.agentWayMap = [
            {id: Const.FIXED_VOIP_ONLINE, name: 'IP话机'},
            {id: Const.PHONE_ONLINE, name: '手机'}
        ];


        this.state = {
            agent_work_state: CallConfig.agent_work_state,
            agent_work_way: CallConfig.agent_work_way,
            callState: Const.HANGUP
        };

        let self = this;
        CallConfig.on('change', this.callConfigChangCb = function(k, v) {
            if (k === 'agent_work_state') {
                self.setState({
                    agent_work_state: v
                });
            } else if (k === 'agent_work_way') {
                self.setState({
                    agent_work_way: v
                });
            } else if (k === 'enableVoipOnline') {
                if(v) {
                    self.agentWayMap.push({id: Const.VOIP_ONLINE, name: '网页电话'});
                    self.forceUpdate();
                }
            }
        });
        CallInfo.on('change', this.callInfoChangeCb = function(k, v) {
            if (k === 'state') {
                self.setState({callState: v});
            }
        });
    }

    render() {
        this.agentStateMap = [
            {id: Const.IDLE, name: <div className={'work-state-' + Const.IDLE}><i></i>空闲</div>},
            {id: Const.BUSY, name: <div className={'work-state-' + Const.BUSY}><i></i>忙碌</div>},
            {id: Const.RESTING, name: <div className={'work-state-' + Const.RESTING}><i></i>小休</div>},
            ..._.map(this.props.customStates, (item) => {
                if (typeof item.name === 'string') {
                    item.name = <div className={'work-state-' + item.originalStateId}><i></i>{item.name}</div>;
                }
                return item;
            }),
            {id: Const.OFFLINE, name: <div className={'work-state-' + Const.OFFLINE}><i></i>离线</div>},
            {id: Const.NEATEN, name: <div className={'work-state-' + Const.BUSY}><i></i>整理中</div>, hide: true}
        ];

        return <div className="agent-state-panel">
            {
                (function() {
                    if (this.state.callState === Const.HANGUP) {
                        return <Dropdown direction={this.props.dropdownDirection} content={this.agentStateMap}
                                         value={this.state.agent_work_state} className="state-select"
                                         onChange={this.updateAgentWorkState}
                        />;
                    } else if (this.state.callState === Const.TALKING) {
                        return <div className="pull-right working">
                            <div className={'work-state-' + Const.TALKING}><i></i>通话中</div>
                        </div>;
                    } else if (this.state.callState === Const.RINGING) {
                        return <div className="pull-right working">
                            <div className={'work-state-' + Const.RINGING}><i></i>振铃中</div>
                        </div>;
                    }
                }).call(this)
            }

            <Dropdown direction={this.props.dropdownDirection} content={this.agentWayMap}
                      value={this.state.agent_work_way} className="way-select"
                      onChange={this.updateAgentWorkWay.bind(this)}
                      disabled={this.state.callState !== Const.HANGUP}
            />
        </div>;
    }

    updateAgentWorkState(state) {
        if (state.originalStateId) {
            callUtil.setCustomWorkStatus(state.originalStateId, state.customStateId);
        } else {
            callUtil.setWorkStatus(state.id);
        }
    }

    updateAgentWorkWay(way) {
        if (this.state.callState !== Const.HANGUP) {
            Alert.error('只能在挂断的时候切换在线方式');
            return;
        }
        callUtil.setWorkingWay(way.id, function() {
        }, function() {
            Alert.error('切换在线方式失败');
        });
    }

    componentWillUnmount() {
        CallConfig.off('change', this.callConfigChangCb);
        CallInfo.off('change', this.callInfoChangeCb);
    }
};
