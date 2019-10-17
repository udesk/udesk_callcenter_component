import map from 'lodash/map';
import React from 'react';
import CallConfig from '../CallConfig';
import CallInfo from '../CallInfo';
import * as callUtil from '../CallUtil';
import * as Const from '../Const';
import Alert from './Alert';
import Dropdown from './Dropdown';
import PropTypes from 'prop-types';

export default class AgentStatePanelComponent extends React.Component {
    constructor(props) {
        super(props);
        this.agentWayMap = [
            {id: Const.FIXED_VOIP_ONLINE, name: 'IP话机'},
            {id: Const.PHONE_ONLINE, name: '手机'}
        ];
        this.state = {
            agent_work_state: CallConfig.agent_work_state,
            agent_work_way: CallConfig.agent_work_way,
            default_callout_number: CallConfig.default_callout_number,
            callState: Const.HANGUP
        };
        let self = this;
        CallConfig.on('change', this.callConfigChangCb = function(k, v) {
            switch (k) {
                case 'agent_work_state':
                case 'agent_work_way':
                case 'default_callout_number':
                    self.setState({[k]: v});
                    break;
                case 'enableVoipOnline':
                    if (v) {
                        self.agentWayMap.push({id: Const.VOIP_ONLINE, name: '网页电话'});
                        self.forceUpdate();
                    }
                    break;
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
            ...map(this.props.customStates, (item) => {
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
                      value={this.state.agent_work_way} className="state-select"
                      onChange={this.updateAgentWorkWay.bind(this)}
                      disabled={this.state.callState !== Const.HANGUP}
            />
            <Dropdown direction={this.props.dropdownDirection} content={this.props.callout_numbers}
                      value={this.state.default_callout_number} className="way-select ucm-dropdown-long"
                      optionLabelPath={'option'}
                      onChange={this.updateCalloutNumbers.bind(this)}
                      disabled={this.state.callState !== Const.HANGUP}
            />
        </div>;
    }
    updateAgentWorkState(state) {
        if (state.originalStateId) {
            callUtil.setCustomWorkStatus(state.originalStateId, state.customStateId, null, function(data){
                if(data && data.code === 11008){
                    Alert.error('员工没有呼叫中心权限');
                }
            });
        } else {
            callUtil.setWorkStatus(state.id, null, function(data){
                if(data && data.code === 11008){
                    Alert.error('员工没有呼叫中心权限');
                }
            });
        }
    }
    
    updateCalloutNumbers(number) {
        var id = number.id === null ? '' : number.id;
        if (this.state.callState !== Const.HANGUP) {
            Alert.error('只能在挂断的时候切换中继号');
            return;
        }
        callUtil.setupDefaultNumber(id, () => {
            CallConfig.set('default_callout_number', number.id);
        }, () => {
            Alert.error('切换中继号失败');
        });
    }

    updateAgentWorkWay(way) {
        if (this.state.callState !== Const.HANGUP) {
            Alert.error('只能在挂断的时候切换在线方式');
            return;
        }
        callUtil.setWorkingWay(way.id, () => {
        }, () => {
            Alert.error('切换在线方式失败');
        });
    }

    componentWillUnmount() {
        CallConfig.off('change', this.callConfigChangCb);
        CallInfo.off('change', this.callInfoChangeCb);
    }

    static propTypes = {
        customStates: PropTypes.array,
        dropdownDirection: PropTypes.string,
        callout_numbers: PropTypes.string
    };
}
