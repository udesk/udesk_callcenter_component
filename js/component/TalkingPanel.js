import images from './images';
import CallInfo from '../CallInfo';
import utils from '../Tools';
import ButtonWithImage from './ButtonWithImage';
import AgentSelect from './AgentSelect';
import AjaxUtils from '../AjaxUtils';
import Alert from './Alert';
import CustomerInfo from './CustomerInfo';
import React from 'react';
import HangupButton from './HangupButton';

export default class TalkingPanelComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            talkingTime: 0,
            agentSelectType: null,
            queue_desc: CallInfo.queue_desc,
            can_end_consult: false
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
            (!this.state.can_consult && !this.state.can_transfer && !this.state.can_three_party)) {
            agentSelectWrapperClass += ' hide';
        }

        return <div className="text-center talking-panel">
            <img src={images.customer_head}/>
            <CustomerInfo/>
            <hr/>
            <div className="desc-info">{descInfoContent}</div>
            <div className="time-info">{utils.humanizeTime(this.state.talkingTime)}</div>
            <div className={agentSelectWrapperClass}>
                <AgentSelect onChange={this.selectAgent.bind(this)}/>
            </div>
            <div className='bottom-btns'>
                <div className="btn-group">
                    <ButtonWithImage image={images.transfer} normalHandler={this.showTransferAgentSelect.bind(this)}
                                     content="转移"
                                     className={this.state.can_transfer ? '' : 'hide'}
                                     state={this.state.agentSelectType !== 'transfer' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideAgentSelect.bind(this)}/>
                    <ButtonWithImage image={images.consult} normalHandler={this.showConsultAgentSelect.bind(this)}
                                     content="咨询"
                                     className={this.state.can_consult ? '' : 'hide'}
                                     state={this.state.agentSelectType !== 'consult' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideAgentSelect.bind(this)}/>
                    <ButtonWithImage image={images.threeWayCalling}
                                     normalHandler={this.showThreeWayAgentSelect.bind(this)}
                                     content="三方"
                                     className={this.state.can_three_party ? '' : 'hide'}
                                     state={this.state.agentSelectType !== 'threeWay' ? 'normal' : 'cancel'}
                                     cancelHandler={this.hideAgentSelect.bind(this)}/>
                    <ButtonWithImage image={images.consult} normalHandler={this.endConsult.bind(this)}
                                     className={this.state.can_end_consult ? '' : 'hide'}
                                     state='normal' content="恢复"
                    />
                </div>
            </div>
            {(() => {
                if (CallInfo.can_hangup) {
                    return <div><HangupButton/></div>;
                }
            })()}
        </div>;
    }

    selectAgent(agent) {
        if (this.state.agentSelectType === 'transfer') {
            AjaxUtils.post('/agent_api/v1/callcenter/desktop/transfer_call', {agent_no: agent.id}, function(res) {
                switch (res.code) {
                    case 1001:
                        Alert.success('转移的请求已经发送！');
                        break;
                    default:
                        Alert.error(res.message || '转移失败！');
                }
            }, function() {
                Alert.error('转移失败');
            });
        } else if (this.state.agentSelectType === 'consult') {
            AjaxUtils.post('/agent_api/v1/callcenter/desktop/start_consult', {agent_no: agent.id}, function(res) {
                switch (res.code) {
                    case 1001:
                        Alert.success('咨询的请求已经发送！');
                        break;
                    default:
                        Alert.error(res.message || '咨询失败');
                }
            }, function() {
                Alert.error('咨询失败');
            });
        } else if (this.state.agentSelectType === 'threeWay') {
            AjaxUtils.post('/agent_api/v1/callcenter/desktop/three_party', {agent_no: agent.id}, function(res) {
                switch (res.code) {
                    case 1001:
                        Alert.success('三方的请求已经发送！');
                        break;
                    default:
                        Alert.error(res.message || '三方失败！');
                }
            }, function() {
                Alert.error('三方失败');
            });
        }
    }

    endConsult() {
        AjaxUtils.post('/agent_api/v1/callcenter/desktop/end_consult', function(res) {
            switch (res.code) {
                case 1001:
                    Alert.success('正在取消咨询');
                    break;
                default:
                    Alert.error(res.message || '取消咨询失败');
            }
        });
    }

    showTransferAgentSelect() {
        this.setState({agentSelectType: 'transfer', showAgentSelect: true});
    }

    showConsultAgentSelect() {
        this.setState({agentSelectType: 'consult', showAgentSelect: true});
    }

    showThreeWayAgentSelect() {
        this.setState({agentSelectType: 'threeWay', showAgentSelect: true});
    }

    hideAgentSelect() {
        this.setState({agentSelectType: null, showAgentSelect: false});
    }

    componentWillUnmount() {
        CallInfo.off('change', this.onCallInfoChange);
    }
}
