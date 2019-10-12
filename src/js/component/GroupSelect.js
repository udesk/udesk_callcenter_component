import BaseSelect from './BaseSelect';
import { getGroups } from '../CallUtil';
import Alert from './Alert';
import merge from 'lodash/merge';
import concat from 'lodash/concat';
import filter from 'lodash/filter';

export default class GroupSelectComponent extends BaseSelect {
    constructor(props) {
        super(props);
        merge(this.state, {
            placeholder: '-请选择其他客服组-',
            optionLabelPath: 'name'
        });
    }

    loadMore() {
        getGroups({}, (res) => {
            if (this._isMounted) {
                this.setState({
                    content: concat(this.state.content, filter(res.queues, {linapp_queue_status: 'open'})),
                    loading: false
                });
            }
        }, () => {
            Alert.error('获取客服失败！');
            this.setState({loading: false});
        });
    }
}
