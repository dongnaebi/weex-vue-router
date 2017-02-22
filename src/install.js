/**
 * Created by ebi on 2017/2/14.
 */
import pathToRegexp from 'path-to-regexp'
const weexVueRouter = {
    install(Vue, {routes, weex}){
        let platform = weex.config.env ? weex.config.env.platform : weex.config.platform;
        if (platform.toLowerCase() == 'web')return;
        const navigator = weex.requireModule('navigator');
        let bundleUrl = weex.config.bundleUrl;
        const route = bundleToPath(bundleUrl, routes);
        Object.defineProperty(Vue.prototype, "$router", {
            value: {
                push(url){
                    let bundle = pathToBundle(url, routes);
                    if (navigator) {
                        console.log(bundle);
                        navigator.push({
                            'url': bundle,
                            'animated': 'true'
                        }, function () {
                            console.log('skip complete')
                        });
                    }
                },
                back(){
                    if (navigator) {
                        navigator.pop();
                    }
                }
            },
            configurable: false
        });
        Object.defineProperty(Vue.prototype, '$route', {
            configurable: false,
            value: {
                path: route.path,
                params: route.params,
                query: route.query,
                hash: route.hash,
                fullPath: route.fullPath,
                matched: route.matched,
                name: route.name
            }
        });
    }
}
function pathToBundle(url,routes){
    /* url='/list/2-1?from=1#2'
     * r={path:'/list/:cid-:id',bundle:'/product/list.js'}
     * */
    if(url.indexOf('/')!=0){
        console.error("the url must begin with '/'");
        return '';
    }

    //copy from vue-router
    const encodeReserveRE = /[!'()*]/g;
    const encodeReserveReplacer = c => '%' + c.charCodeAt(0).toString(16);
    const encode = str => encodeURIComponent(str)
        .replace(encodeReserveRE, encodeReserveReplacer)
        .replace(/%2C/g, ',')

    /*find out the rule*/
    let matchRule={};
    routes.forEach(r => {
        let re=pathToRegexp(r.path);
        let match=re.exec(url);
        if(match!=null){
            matchRule = r;
        }
    });

    /*get the key and value*/
    let keys = [];
    let pathReg = pathToRegexp(matchRule.path, keys);
    let values=pathReg.exec(url);
    let lastValue=values[values.length-1];//save the last value to find query and hash
    values[values.length-1]=lastValue.split(/\?|\#/)[0];//the true value

    /*parse params to key/value object*/
    let params={};
    if(keys.length>0){
        keys.forEach((key,i)=>{
            params[key.name]=values[i+1];
        });
    }

    /*get query and hash*/
    const queryIndex=lastValue.indexOf('?');
    const hashIndex=lastValue.indexOf('#');
    if (queryIndex > 0 && hashIndex > 0 && queryIndex > hashIndex) {
        console.error("Could not set '#' behind '?'");
        return '';
    }
    let queryStr=queryIndex>0?lastValue.substring(queryIndex+1,hashIndex>0?hashIndex:lastValue.length):"";
    let hashStr=hashIndex>0?lastValue.substring(hashIndex,lastValue.length):"";
    let query=getParams(queryStr);//{from:1}

    /*add the bundleUrl's params and hash*/
    let componentPath=matchRule.component;
    for(let k in params){
        componentPath+=(componentPath.indexOf('?')>0?'&':'?')+k+'='+encode(params[k]);
    }
    for(let q in query){
        componentPath+=(componentPath.indexOf('?')>0?'&':'?')+q+'='+encode(query[q]);
    }
    componentPath+=hashStr;
    return componentPath;
}
function bundleToPath(url,routes){
    //url='domain/product/list.js?cid=2&id=1&from=1'
    //matchRule={path:'/list/:cid-:id',component:'domain/product/list.js'}
    let route={
        params:null,
        query:null,
        hash:null,
        path:null,
        fullPath:null,
        matched:null,
        name:null
    };
    let jsBundle=url.split(/\?|\#/)[0];
    /*find out the rule*/
    let matchRule=null;
    routes.forEach(r => {
        r.component==jsBundle&&(matchRule=r);
        //http://192.168.253.124:8080/dist/product/list.js
    });
    if(!matchRule){
        console.error(`your component must be like '${jsBundle}',can not find it in routes,please check up`);
        return route;
    }

    /*use pathToRegexp*/
    let keys = [];
    pathToRegexp(matchRule.path, keys);

    /*get query and hash*/
    const queryIndex=url.indexOf('?');
    const hashIndex=url.indexOf('#');
    let queryStr=queryIndex>0?url.substring(queryIndex+1,hashIndex>0?hashIndex:url.length):"";
    route.hash=hashIndex>0?url.substring(hashIndex,url.length):"";

    const allQuery=getParams(queryStr);//{cid:2,id:1,from:1}

    let params={},//{cid:2,id:1}
        query={},//{from:1}
        paramsKey=[];//['cid','id']
    if(keys.length>0){
        paramsKey=keys.map(key=>key.name);
    }
    for(let q in allQuery){
        allQuery[q]=decodeURIComponent(allQuery[q]);
        paramsKey.indexOf(q)<0?query[q]=allQuery[q]:params[q]=allQuery[q];
    }
    route.params=params;
    route.query=query;

    //path and fullPath
    let path=matchRule.path;
    for(let p in params){
        path=path.replace(':'+p,params[p]);
    }
    route.path=path;
    let queryArr=[];
    for(let i in query){
        queryArr.push(i+'='+query[i]);
    }
    route.fullPath=path+'?'+queryArr.join('&')+route.hash;
    route.matched=matchRule;
    route.name=matchRule.name;

    return route;
}
function getParams(str) {
    let temp={};
    if(!str){
        return temp;
    }
    if(str.indexOf('=')<0){
        temp[str]="";
        return temp;
    }
    let arr = str.split('&');
    arr.forEach(function(item) {
        let w = item.match(/([^=]*)=(.*)/);
        temp[w[1]] = w[2];
    });
    return temp;
}
export default weexVueRouter;