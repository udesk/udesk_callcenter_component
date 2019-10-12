import Alert from './Alert';
import React from 'react';
import merge from 'lodash/merge';
import concat from 'lodash/concat';
import { getAgents } from '../CallUtil';
import BaseSelect from './BaseSelect';

const DEFAULT_CONTENT = '-请选择其他客服-';
export default class AgentSelectComponent extends BaseSelect {
    constructor() {
        super(...arguments);
        merge(this.state, {
            placeholder: DEFAULT_CONTENT
        });
    }

    loadMore(query) {
        let self = this;
        this.setState({loading: true});
        getAgents({workState: 'idle', page: this.page, query: query}, function(res) {
            if (self._isMounted) {
                self.maxPage = res.meta.page_count;
                self.page = res.meta.current_page;
                self.setState({
                    content: concat(self.state.content, res.agents),
                    loading: false
                });
            }
        }, function() {
            Alert.error('获取客服失败！');
            self.setState({loading: false});
        });
    }
}
