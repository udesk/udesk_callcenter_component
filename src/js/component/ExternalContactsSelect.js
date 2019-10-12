import Alert from './Alert';
import React from 'react';
import merge from 'lodash/merge';
import concat from 'lodash/concat';
import {getExternalcontactsSearch} from '../CallUtil';
import BaseSelect from './BaseSelect';

const DEFAULT_CONTENT = '-请输入搜索外部联系人-';
export default class ExternalContactsSelect extends BaseSelect {
    constructor() {
        super(...arguments);
        merge(this.state, {
            placeholder: DEFAULT_CONTENT,
            customOptionDiv: true
        });
    }

    loadMore() {
        let page = this.page;
        let search = this.state.search;
        if (!search || search === '') {
            this.setState({
                content: [],
                loading: false
            });
            return;
        }
        this.setState({loading: true});
        getExternalcontactsSearch(search, page, (res) => {
            if (this._isMounted) {
                this.maxPage = res.meta.page_count;
                this.page = res.meta.current_page;
                this.setState({
                    content: concat(this.state.content, res.external_contacts),
                    loading: false,
                    expand: true
                });
            }
        }, (res) => {
            Alert.error('获取外部联系人列表失败！');
            this.setState({
                loading: false
            });
        });
    }

    onSearch(val) {
        if(val === ''){
            this.setState({
                loading: false,
                search: '',
                expand: false,
                content: []
            });
            return;
        }
        let page = 1;
        this.setState({loading: true});
        getExternalcontactsSearch(val, page, (res) => {
            res.external_contacts.push({
                cellphone: val,
                email: "",
                id: -1,
                nick_name: `使用${val}`
            });
            this.maxPage = res.meta.page_count;
            this.page = res.meta.current_page;
            this.setState({
                content: res.external_contacts,
                loading: false,
                search: val,
                expand: true
            });

        }, (res) => {
            Alert.error('获取外部联系人列表失败！');
            this.setState({
                loading: false
            });
        });
    }
    customOptionStructure(item, clickFun) {
        return <li key={item.id}  className="custom_option" onClick={clickFun}>
            <p>{item.nick_name}</p>
            <p>{item.cellphone}</p>
        </li>;
    }
}
