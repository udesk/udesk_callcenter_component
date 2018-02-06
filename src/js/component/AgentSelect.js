import Alert from './Alert';
import React from 'react';
import _ from 'lodash';
import { getAgents } from '../CallUtil';
import BaseSelect from './BaseSelect';

const DEFAULT_CONTENT = '-请选择其他客服-';
export default class AgentSelectComponent extends BaseSelect {
    constructor() {
        super(...arguments);
        _.merge(this.state, {
            placeholder: DEFAULT_CONTENT
        });
    }

    loadMore() {
        let self = this;
        this.setState({loading: true});
        getAgents({workState: 'idle', page: this.page}, function(res) {
            if (self._isMounted) {
                self.maxPage = res.meta.page_count;
                self.page = res.meta.current_page;
                self.setState({
                    content: _.concat(self.state.content, res.agents),
                    loading: false
                });
            }
        }, function() {
            Alert.error('获取客服失败！');
            self.setState({loading: false});
        });
    }
}
