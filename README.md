使用方法
-----

#### 1、html中引用callcenter-component.js

```html
<script src='./dist/callcenter-component.js'></script>
```

#### 2、初始化组件

```javascript
new UdeskCallcenterComponent({
    container: document.body,    //组件的容器
    token: 'xx*xxxxx',  //通过登录接口获取的客服token
    subDomain: 'udesk'  //在udesk注册的二级域名
});
```

如何编译
-----

项目用webpack打包，需要先安装webpack
```
npm install -g webpack
```

安装依赖
```
npm install
```

编译
```
webpack
```



