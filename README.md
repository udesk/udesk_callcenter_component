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
    token: '9b30d8acb1684dec5907b84887e91c9b1553b3cbdd703417691c0567f60515fc35c32403d612d400fa7ccd4591517566403b5675645154e915238c17f33f4a93585b3311',  //通过登录接口获取的客服token
    subDomain: 'ucpapp'  //在udesk注册的二级域名
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



