## Install ##
```bash
$ npm install weex-vue-router
```
## Useage ##
```html
<template>
    <div>
        <div @click="jump('/product/123')"><text>Jump</text></div>
    </div>
</template>
```

```javascript
import weexVueRouter from 'weex-vue-router'
import routes from './native-router'//web-router and native-router need to be defined separately。
Vue.use(weexVueRouter,{routes,weex})

export default {
    methods:{
        jump(url) {
            this.$router.push(url)
        },
        getParams(){
            return this.$route.params
        }
    }
}
```
## Construction options ##
```javascript
//native-router.js
const domain='http://domain.com';
const routes = [{
    path:'/product/:id';
    component:domain+'/dist/product/detail.js';//js bundle address，must end with '.js'
    name:'product';
}];
export default routes;
```
## Component injections ##
$router
- push()-only surport string featrue, like `/path/:foo/:bar`
- back()

$route
- path()
- params()
- query()
- hash()
- fullpath()
- matched()
- name()

## 原理(求翻译) ##
需编译成两套，web端使用`vue-router`做SPA架构，单独编译出一个js。

native端则对应`.vue`文件编译成js bundle。

在组件中写跳转`$this.router.push('/path/1')`，web端用vue-router跳转。

native端接收到`/path/1`，对应自己定义的routes匹配出js bundle地址，并使用`navigator.push()`方法跳转

## TODO ##
- 分模块&更严谨的逻辑
- 加单测
- example
- meta和别名
