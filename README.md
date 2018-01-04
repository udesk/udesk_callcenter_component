[文档地址](http://www.udesk.cn/website/doc/thirdparty/callcomponent/)

[获取Open API Token](http://www.udesk.cn/website/doc/apiv2/intro/#token)

部署方法
-------
修改build/webpack.dev.conf.js配置__server__
修改index.html 93行94行，token和subDomain

部署命令
```
./deploy.sh
```


兼容ie8的nginx配置，已在proj项目中修改。
------
```
# tower配置改为与客户系统同域
upstream udesk_tower_app2 {
    server unix:/srv/www/udesk_tower/current/tmp/sockets/tower.sock max_fails=1;
    keepalive 512;
}

  location ~* \.io {
    #rewrite ^/tower(.*) $1 break;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://udesk_tower_app2;
    proxy_redirect off;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

location /tower/ {
  rewrite ^/tower(.*) $1 break;
  proxy_pass http://udesk_tower_app2/;
  proxy_set_header Host $http_host;
}
 location /cp/ {
   rewrite ^/cp(.*) /$1 break;
   root /srv/www/callcenter-component;
   index index.html;
 }
```


