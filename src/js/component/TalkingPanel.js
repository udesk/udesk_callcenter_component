import map from 'lodash/map';
import React from 'react';
import CallInfo from '../CallInfo';
import {
    holdCallSelect,
    recoveryCallSelect,
    startConsult,
    startConsultingToExternalPhone,
    startIvrCalling,
    startThreeWayCalling,
    startThreeWayCallingToExternalPhone,
    stopConsult,
    threeWayCallingAfterConsult,
    transfer,
    transferAfterConsult,
    transferAfterThreeWayCalling,
    transferToExternalPhone,
    transferToGroup
} from '../CallUtil';
import * as utils from '../Tools';
import AgentSelect from './AgentSelect';
import Alert from './Alert';
import ButtonWithImage from './ButtonWithImage';
import CustomerInfo from './CustomerInfo';
import ExternalContactsSelect from './ExternalContactsSelect';
import GroupSelect from './GroupSelect';
import HangupButton from './HangupButton';
import images from './images';
import IvrNodeSelect from './IvrNodeSelect';
import PropTypes from 'prop-types';

export default class TalkingPanelComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            talkingTime: 0,
            type: null,
            queue_desc: CallInfo.queue_desc,
            can_end_consult: false,
            targetType: 'agent',
            externalPhoneNumber: ''
        };
        let self = this;
        CallInfo.on('change', this.onCallInfoChange = function(k, v) {
            let obj = {};
            obj[k] = v;
            self.setState(obj);
        });
    }

    render() {
        let {
            can_transfer_after_consult,
            can_party_after_consult,
            can_transfer_after_party
        } = this.state;
        let {isShow = false} = this.props;
        if (!isShow) {
            return null;
        }

        let agentSelectWrapperClass = 'agent-select-wrapper';
        let descInfoContent = '';
        if (this.state.queue_desc) {
            descInfoContent = '来源:' + this.state.queue_desc;
        }

        return <div className='text-center talking-panel'>
            <img src={images.customer_head}/>
            <CustomerInfo/>
            <hr/>
            <div className="desc-info">{descInfoContent}</div>
            <div className="time-info">{utils.humanizeTime(this.state.talkingTime)}</div>
            {(() => {
                if (this.state.type === 'ivr_node') {
                    return <div className={agentSelectWrapperClass}><IvrNodeSelect
                        onChange={this._selectAgent}/></div>;
                } else {
                    if (!this.state.showAgentSelect || this.state.can_end_consult ||
                        (!this.state.can_consult && !this.state.can_transfer && !this.state.can_three_party &&
                         !this.state.can_transfer_ivr)) {
                        return null;
                    }
                    return <div className={agentSelectWrapperClass}>
                        <select value={this.state.targetType}
                                onChange={event => this.setState({targetType: event.target.value})}>
                            {map(this.state.targetTypes, (i) => <option key={i.value}
                                                                          value={i.value}>{i.name}</option>)}
                        </select>
                        {(() => {
                            switch (this.state.targetType) {
                                case 'agent':
                                    return <AgentSelect onChange={this._selectAgent} showSearch={true}/>;
                                case 'group':
                                    return <GroupSelect onChange={this._selectGroup.bind(this)}/>;
                                case 'externalPhone':
                                    return <ExternalContactsSelect mode='input_search' onChange={this._onClickExternalPhone.bind(this)}/>;
                            }
                        })()}
                    </div>;
                }
            })()}
            <div className='bottom-btns'>
                <div className="btn-group">
                    <ButtonWithImage image={images.call_retain} normalHandler={this.holdCallSelect.bind(this)}
                                     content="保持"
                                     className={this.state.can_hold ? '' : 'hide'}
                                     state='normal'
                                     cancelHandler={this.hideTargetSelect.bind(this)}/>
                    <ButtonWithImage image={images.call_recovery} normalHandler={this.recoveryCallSelect.bind(this)}
                                     content="取回"
                                     className={this.state.can_retrieval ? '' : 'hide'}
                                     state='normal'/>
                    <ButtonWithImage image={images.ivrIcon} normalHandler={this.showIvrSelect.bind(this)}
                                     content="IVR"
                                     className={this.state.can_transfer_ivr ? '' : 'hide'}
                                     state={this.state.type !== 'ivr_node' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideTargetSelect.bind(this)}/>
                    <ButtonWithImage image={images.transfer} normalHandler={this.showTransferAgentSelect.bind(this)}
                                     content="转移"
                                     className={this.state.can_transfer ? '' : 'hide'}
                                     state={this.state.type !== 'transfer' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideTargetSelect.bind(this)}/>
                    <ButtonWithImage image={images.consult} normalHandler={this.showConsultAgentSelect.bind(this)}
                                     content="咨询"
                                     className={this.state.can_consult ? '' : 'hide'}
                                     state={this.state.type !== 'consult' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideTargetSelect.bind(this)}/>
                    <ButtonWithImage image={images.consult} normalHandler={this.stopConsult.bind(this)}
                                     className={this.state.can_end_consult ? '' : 'hide'}
                                     state='normal' content="恢复"/>
                    <ButtonWithImage image={images.threeWayCalling}
                                     normalHandler={this.showThreeWayAgentSelect.bind(this)}
                                     content="三方"
                                     className={this.state.can_three_party ? '' : 'hide'}
                                     state={this.state.type !== 'threeWay' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideTargetSelect.bind(this)}/>
                    {can_transfer_after_consult &&
                     <ButtonWithImage image={images.transfer}
                                      normalHandler={this._transferAfterConsult}
                                      content="咨询后转接"
                                      state='normal'/>}
                    {can_party_after_consult &&
                     <ButtonWithImage image={images.threeWayCalling}
                                      normalHandler={this._threeWayCallingAfterConsult}
                                      content="咨询后三方"
                                      state='normal'/>}
                    {can_transfer_after_party &&
                     <ButtonWithImage image={images.transfer}
                                      normalHandler={this._transferAfterThreeWayCalling}
                                      content="三方后转接"
                                      state='normal'/>}
                </div>
            </div>
            {(() => {
                if (CallInfo.can_hangup) {
                    return <div><HangupButton/></div>;
                }
            })()}
        </div>;
    }

    _selectIvrNode(node) {
        startIvrCalling(node, () => {
            this.hideTargetSelect();
            Alert.success('ivr的请求已经发送！');
        }, function(res) {
            Alert.error(res.message || '转接ivr失败！');
        });
    }

    _selectAgent = (agent) => {
        if (this.state.type === 'transfer') {
            transfer(agent.id, function() {
                Alert.success('转移的请求已经发送！');
            }, function(res) {
                Alert.error(res.message || '转移失败！');
            });
        } else if (this.state.type === 'consult') {
            startConsult(agent.id, function() {
                Alert.success('咨询的请求已经发送！');
            }, function(res) {
                Alert.error(res.message || '咨询失败');
            });
        } else if (this.state.type === 'threeWay') {
            startThreeWayCalling(agent.id, function() {
                Alert.success('三方的请求已经发送！');
            }, function(res) {
                Alert.error(res.message || '三方失败！');
            });
        } else if (this.state.type === 'ivr_node') {
            // no empty block
        }
        this._lastSelectedAgentId = agent.id;
    };

    _selectGroup(group) {
        if (this.state.type === 'transfer') {
            transferToGroup(group.linapp_queue_id, function() {
                Alert.success('转移的请求已经发送！');
            }, function(res) {
                Alert.error(res.message || '转移失败！');
            });
        } else if (this.state.type === 'ivr_node') {
            startIvrCalling(group.linapp_queue_id, function() {
                self.hideTargetSelect();
                Alert.success('ivr的请求已经发送！');
            }, function(res) {
                Alert.error(res.message || '转接ivr失败！');
            });
        }
    }

    _onClickExternalPhone(external) {
        if (external.cellphone) {
            this.transfer(this.state.type, external.cellphone);
        } else {
            Alert.error('选择的外部联系人没有电话号码');
        }
    }

    transfer(type, value) {
        if (type === 'transfer') {
            transferToExternalPhone(value, () => {
                this.hideTargetSelect();
                Alert.success('转接外线的请求已经发送');
            }, (res) => Alert.error(res.message || '转接外线失败'));
        } else if (type === 'consult') {
            startConsultingToExternalPhone(value, () => {
                this.hideTargetSelect();
                Alert.success('咨询外线的请求已经发送');
            }, (res) => Alert.error(res.message || '咨询外线失败'));
        } else if (type === 'threeWay') {
            startThreeWayCallingToExternalPhone(value, () => {
                this.hideTargetSelect();
                Alert.success('三方外线的请求已经发送');
            }, (res) => Alert.error(res.message || '三方外线失败'));
        }
    }

    stopConsult() {
        stopConsult(function() {
            Alert.success('正在取消咨询');
        }, function(res) {
            Alert.error(res.message || '取消咨询失败');
        });
    }

    holdCallSelect() {
        holdCallSelect(function() {
            Alert.success('正在保持通话');
        }, function(res) {
            Alert.error(res.message || '保持通话失败');
        });
    }

    recoveryCallSelect() {
        recoveryCallSelect(() => {
            Alert.success('正在取回通话');
        }, function(res) {
            Alert.error(res.message || '取回通话失败');
        });
    }

    showTransferAgentSelect() {
        this.setState({
            type: 'transfer', showAgentSelect: true,
            targetType: 'agent',
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '客服组', value: 'group'},
                {name: '外线', value: 'externalPhone'}
            ]
        });
    }

    showConsultAgentSelect() {
        this.setState({
            type: 'consult', showAgentSelect: true,
            targetType: 'agent',
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '外线', value: 'externalPhone'}
            ]
        });
    }

    showThreeWayAgentSelect() {
        this.setState({
            type: 'threeWay', showAgentSelect: true,
            targetType: 'agent',
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '外线', value: 'externalPhone'}
            ]
        });
    }

    showIvrSelect() {
        this.setState({type: 'ivr_node', showAgentSelect: true});
    }

    hideTargetSelect() {
        this.setState({type: null, showAgentSelect: false});
    }

    componentWillUnmount() {
        CallInfo.off('change', this.onCallInfoChange);
    }

    _transferAfterConsult = () => {
        if (this._lastSelectedAgentId) {
            transferAfterConsult(this._lastSelectedAgentId);
        }
    };

    _threeWayCallingAfterConsult = () => {
        if (this._lastSelectedAgentId) {
            threeWayCallingAfterConsult(this._lastSelectedAgentId);
        }
    };

    _transferAfterThreeWayCalling = () => {
        if (this._lastSelectedAgentId) {
            transferAfterThreeWayCalling(this._lastSelectedAgentId);
        }
    };

    static propTypes = {
        isShow: PropTypes.bool
    }
}
