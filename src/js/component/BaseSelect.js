import images from './images';
import React from 'react';
import _ from 'lodash';

/**
 * @class
 * @property {string} placeholder - 默认的显示内容
 * @property {string} optionLabelPath - label来自于哪个属性
 * @property {number} maxPage - 最多页数
 * @property {number} page - 当前第几页
 */
export default class BaseSelect extends React.Component {
    componentDidMount() {
        this._isMounted = true;
        this.loadMore();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    constructor({
        optionLabelPath = 'nick_name',
        placeholder = ''
    }) {
        super();
        this.maxPage = 1;
        this.page = 1;
        this.state = {
            content: [],
            loading: true,
            expand: false,
            selectedItem: null,
            placeholder,
            optionLabelPath
        };
    }

    render() {
        let dropdownClass = 'dropdown';
        if (!this.state.expand) {
            dropdownClass = dropdownClass + ' hide';
        }
        return <div className="agent-select">
            <div className="display-frame" onClick={this.toggleExpand.bind(this)}>
                <span>{this.state.selectedItem ? this.state.selectedItem[this.state.optionLabelPath] : this.state.placeholder}</span>
                <img src={images.caret_down}/>
            </div>
            <ul onScroll={this.onScroll.bind(this)} className={dropdownClass}>
                {_.map(this.state.content, (item) => {
                    let self = this;
                    let onClickFun = function() {
                        self.props.onChange(item);
                        self.setState({expand: false, selectedItem: item});
                    };
                    return <li key={item.id} onClick={onClickFun}>{item[this.state.optionLabelPath]}</li>;
                })}
                {(() => {
                    if (this.state.loading) {
                        return <li className="text-center"><i className="fa fa-spinner fa-spin"/></li>;
                    }
                }).call(this)}
            </ul>
        </div>;
    }

    loadMore() {
        this.setState({
            content: [],
            loading: false
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
            this.loadMore();
        }
    }
}
