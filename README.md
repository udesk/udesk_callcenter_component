dist目录下是已经编译压缩以后的代码，可以直接放到你的项目里使用。
如果修改了我的代码，则需要先编译，编译方法在[这里](#user-content-如何编译)。

直接使用
----

#### 1、将dist目录下的内容引入你自己的项目，fonts目录拷贝到你的项目静态资源目录下。

```html
<!--  引入css-->
<link rel="stylesheet" type="text/css" href="./css/style.css">
<!--  引入js-->
<script src='./callcenter-component.js'></script>
```

#### 2、初始化组件

```html
<script>
new UdeskCallcenterComponent({
    container: document.body,    //组件的容器
    token: 'xxxxxxxx',           //通过登录接口获取的客服token，接口文档在doc/登录.md
    subDomain: 'udesk'           //在udesk注册的二级域名
});
</script>
```

如何编译
----

#### 1、安装nodejs

[下载后安装](https://nodejs.org/zh-cn/download/)

#### 2、安装webpack

项目用webpack打包，需要先安装webpack
```
npm install -g webpack
```

#### 3、下载依赖

进入项目目录，运行下面的命令
```
npm install
```

#### 4、编译

```
webpack
```



