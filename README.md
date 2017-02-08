使用方法
-----

#### 1、html中引入dist目录下的callcenter-component.js

```html
<script src='./dist/callcenter-component.js'></script>
```

#### 2、初始化组件

```javascript
new UdeskCallcenterComponent({
    container: document.body,    //组件的容器
    token: 'xxxxxxxx',  //通过登录接口获取的客服token，接口文档在doc/登录.md
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



