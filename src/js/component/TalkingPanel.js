import images from './images';
import CallInfo from '../CallInfo';
import utils from '../Tools';
import ButtonWithImage from './ButtonWithImage';
import AgentSelect from './AgentSelect';
import GroupSelect from './GroupSelect';
import Alert from './Alert';
import CustomerInfo from './CustomerInfo';
import React from 'react';
import HangupButton from './HangupButton';
import IvrNodeSelect from './IvrNodeSelect';
import _ from 'lodash';
import {
    holdCallSelect,
    phoneNumberCheck,
    recoveryCallSelect,
    startConsult,
    startConsultingToExternalPhone,
    startIvrCalling,
    startThreeWayCalling,
    startThreeWayCallingToExternalPhone,
    stopConsult,
    transfer,
    transferToExternalPhone,
    transferToGroup
} from '../CallUtil';

export default class TalkingPanelComponent extends React.Component {
    constructor() {
        super();
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
        let agentSelectWrapperClass = 'agent-select-wrapper';
        let descInfoContent = '';
        if (this.state.queue_desc) {
            descInfoContent = '来源:' + this.state.queue_desc;
        }
        if (!this.state.showAgentSelect || this.state.direction === 'out' || this.state.can_end_consult ||
            (!this.state.can_consult && !this.state.can_transfer && !this.state.can_three_party &&
             !this.state.can_transfer_ivr)) {
            agentSelectWrapperClass += ' hide';
        }

        return <div className="text-center talking-panel">
            <img src={images.customer_head}/>
            <CustomerInfo/>
            <hr/>
            <div className="desc-info">{descInfoContent}</div>
            <div className="time-info">{utils.humanizeTime(this.state.talkingTime)}</div>
            {(() => {
                if (this.state.type === 'ivr_node') {
                    return <div className={agentSelectWrapperClass}><IvrNodeSelect
                        onChange={this._selectAgent.bind(this)}/></div>;
                } else {
                    return <div className={agentSelectWrapperClass}>
                        {(() => {
                            if (this.state.type !== 'ivr_node') {
                                return <select value={this.state.targetType}
                                               onChange={event => this.setState({targetType: event.target.value})}>
                                    {_.map(this.state.targetTypes, (i) => <option key={i.value}
                                                                                  value={i.value}>{i.name}</option>)}
                                </select>;
                            }
                        })()}

                        {(() => {
                            if (this.state.type === 'ivr_node') {
                                return <IvrNodeSelect onChange={this._selectIvrNode.bind(this)}/>;
                            } else {
                                switch (this.state.targetType) {
                                    case 'agent':
                                        return <AgentSelect onChange={this._selectAgent.bind(this)}/>;
                                    case 'group':
                                        return <GroupSelect onChange={this._selectGroup.bind(this)}/>;
                                    case 'externalPhone':
                                        return <div className="external-phone">
                                            <input onKeyPress={this._enterExternalPhone.bind(this)} onChange={(e) => {
                                                this.setState({
                                                    externalPhoneNumber: e.target.value
                                                });
                                            }}/>
                                            <button onClick={this._onClickExternalPhone.bind(this)}><i
                                                className="fa fa-phone"/></button>
                                        </div>;
                                }
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

    _selectAgent(agent) {
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

        }
    }

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

    _enterExternalPhone(e) {
        if (e.key === 'Enter') {
            let value = e.target.value.trim();
            if (!phoneNumberCheck(value)) {
                Alert.error('不是有效的电话号码');
                return;
            }

            this.transfer(this.state.type, value);
        }

    }

    _onClickExternalPhone() {
        if (this.state.externalPhoneNumber) {
            this.transfer(this.state.type, this.state.externalPhoneNumber);
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
        holdCallSelect(function(){
            Alert.success('正在保持通话');
        },function(res){
            Alert.error(res.message || '保持通话失败');
        })
    }
    recoveryCallSelect() {
        recoveryCallSelect(()=>{
            Alert.success('正在取回通话');
        },function(res){
            Alert.error(res.message || '取回通话失败');
        })
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
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '客服组', value: 'group'},
                {name: '外线', value: 'externalPhone'}]
        });
    }

    showConsultAgentSelect() {
        this.setState({
            type: 'consult', showAgentSelect: true,
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '外线', value: 'externalPhone'}]
        });
    }

    showThreeWayAgentSelect() {
        this.setState({
            type: 'threeWay', showAgentSelect: true,
            targetTypes: [
                {name: '客服', value: 'agent'},
                {name: '外线', value: 'externalPhone'}]
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
}
