import React from 'react';
import BaseSelect from './BaseSelect';
import { getGroups } from '../CallUtil';
import Alert from './Alert';
import _ from 'lodash';

export default class GroupSelectComponent extends BaseSelect {
    constructor(props) {
        super(...arguments);
        _.merge(this.state, {
            placeholder: '-请选择其他客服组-',
            optionLabelPath: 'name'
        });
    }

    loadMore() {
        getGroups({}, (res) => {
            if (this._isMounted) {
                this.setState({
                    content: _.concat(this.state.content, _.filter(res.queues, {linapp_queue_status: 'open'})),
                    loading: false
                });
            }
        }, () => {
            Alert.error('获取客服失败！');
            this.setState({loading: false});
        });
    }
}
