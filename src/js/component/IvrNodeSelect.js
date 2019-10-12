import images from './images';
import Alert from './Alert';
import React from 'react';
import map from 'lodash/map';
import {getIvrNodes} from '../CallUtil';
import PropTypes from 'prop-types';

const DEFAULT_CONTENT = '-请选择节点-';

export default class AgentSelectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            loading: true,
            expand: false,
            selectedItem: null
        };
    }
    render() {
        var dropdownClass = 'dropdown';
        if (!this.state.expand) {
            dropdownClass = dropdownClass + ' hide';
        }
        return <div className="agent-select">
            <div className="display-frame"
                onClick={this.toggleExpand.bind(this)}>
                <span>{this.state.selectedItem ? this.state.selectedItem.name : DEFAULT_CONTENT}</span>
                <img src={images.caret_down}/>
            </div>
            <ul  className={dropdownClass}>
                {map(this.state.content, (item) => {

                    let onClickFun = () => {
                        this.props.onChange(item);
                        this.setState({expand: false, selectedItem: item});
                    };
                    return <li key={item.id} onClick={onClickFun}>{item.name}</li>;
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
        this.loadingContent();
    }

    loadingContent() {
        getIvrNodes((res) => {
            this.setState({
                content: res.ivr_nodes,
                loading: false
            });
        }, () => {
            Alert.error('获取节点失败！');
            this.setState({loading: false});
        });
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand});
    }

    static propTypes = {
        onChange: PropTypes.func
    }
}
