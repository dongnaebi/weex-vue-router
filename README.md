## 原理 ##
需编译成两套，web端使用`vue-router`做SPA架构，单独编译出一个js。

native端则对应`.vue`文件编译成js bundle。

在组件中写跳转`$this.router.push('/path/1')`，web端用vue-router跳转。

native端接收到`/path/1`，对应自己定义的routes匹配出js bundle地址，并使用`navigator.push()`方法跳转
## 安装插件 ##
```javascript
//一般在mixins
import weexVueRouter from 'weex-vue-router'
import routes from './native-router'//web-router和native-router需分开定义，概念不同。
Vue.use(weexVueRouter,{routes,weex})
```
## 构造配置 ##
```javascript
//native-router.js
const routes = [{
  path:'/path/:id';
  component:'http://domain.com/dist/path/foo.js';//js bundle地址，必须以.js结尾
  name:'myName';
}]
```
## 注入组件 ##
$router
1. push()-目前仅支持`/path/:foo/:bar`的方式
2. back()

$route
1. path()
2. params()
3. query()
4. hash()
5. fullpath()
6. matched()
7. name()


## TODO ##
- 分模块&更严谨的逻辑
- 加单测
- example
- meta和别名
