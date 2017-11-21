import images from './images';
import AjaxUtils from '../AjaxUtils';
import Alert from './Alert';
import React from 'react';
import _ from 'lodash';
import { getAgents } from '../CallUtil';

const DEFAULT_CONTENT = '-请选择其他客服-';

export default class AgentSelectComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            content: [],
            loading: true,
            expand: false,
            selectedItem: null
        };
        this.page = 1;
        this.maxPage = 1;
    }

    render() {
        var dropdownClass = 'dropdown';
        if (!this.state.expand) {
            dropdownClass = dropdownClass + ' hide';
        }
        return <div className="agent-select">
            <div className="display-frame"
                 onClick={this.toggleExpand.bind(this)}>
                <span>{this.state.selectedItem ? this.state.selectedItem.nick_name : DEFAULT_CONTENT}</span>
                <img src={images.caret_down}/>
            </div>
            <ul onScroll={this.onScroll.bind(this)} className={dropdownClass}>
                {_.map(this.state.content, (item) => {
                    let self = this;
                    let onClickFun = function() {
                        self.props.onChange(item);
                        self.setState({expand: false, selectedItem: item});
                    };
                    return <li key={item.id} onClick={onClickFun}>{item.nick_name}</li>;
                })}
                {(() => {
                    if (this.state.loading) {
                        return <li className="text-center"><i className="fa fa-spinner fa-spin"></i></li>;
                    }
                }).call(this)}
            </ul>
        </div>;
    }

    componentDidMount() {
        this.loadingAgents();
    }

    loadingAgents() {
        let self = this;
        self.setState({loading: true});
        AjaxUtils.get('/agent_api/v1/callcenter/agents', {
            page: this.page, callcenter_work_state: 'idle'
        }, function(res) {
            self.setState({
                content: _.concat(self.state.content, res.agents),
                page: res.meta.current_page,
                loading: false
            });
            self.maxPage = res.meta.page_count;
            self.page = res.meta.current_page;
        }, function() {
            Alert.error('获取客服失败！');
            self.setState({loading: false});
        });
        getAgents({workState: 'idle', page: this.page}, function() {

        }, function() {

        });
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand});
    }

    onScroll(event) {
        let target = event.target;
        if (this.page >= this.maxPage) {
            return;
        }
        if (target.scrollTop >= (target.scrollHeight - target.offsetHeight)) {
            this.page = this.page + 1;
            this.loadingAgents();
        }
    }
}
