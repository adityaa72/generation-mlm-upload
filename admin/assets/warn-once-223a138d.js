function le(e,t){for(var r=0;r<t.length;r++){const n=t[r];if(typeof n!="string"&&!Array.isArray(n)){for(const o in n)if(o!=="default"&&!(o in e)){const s=Object.getOwnPropertyDescriptor(n,o);s&&Object.defineProperty(e,o,s.get?s:{enumerable:!0,get:()=>n[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var it=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function pe(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function ut(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var r=function n(){if(this instanceof n){var o=[null];o.push.apply(o,arguments);var s=Function.bind.apply(t,o);return new s}return t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var o=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(r,n,o.get?o:{enumerable:!0,get:function(){return e[n]}})}),r}var m={},de={get exports(){return m},set exports(e){m=e}},l={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x=Symbol.for("react.element"),ye=Symbol.for("react.portal"),he=Symbol.for("react.fragment"),me=Symbol.for("react.strict_mode"),ge=Symbol.for("react.profiler"),be=Symbol.for("react.provider"),we=Symbol.for("react.context"),ve=Symbol.for("react.forward_ref"),_e=Symbol.for("react.suspense"),Se=Symbol.for("react.memo"),xe=Symbol.for("react.lazy"),U=Symbol.iterator;function Oe(e){return e===null||typeof e!="object"?null:(e=U&&e[U]||e["@@iterator"],typeof e=="function"?e:null)}var Q={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ee=Object.assign,te={};function _(e,t,r){this.props=e,this.context=t,this.refs=te,this.updater=r||Q}_.prototype.isReactComponent={};_.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function re(){}re.prototype=_.prototype;function I(e,t,r){this.props=e,this.context=t,this.refs=te,this.updater=r||Q}var N=I.prototype=new re;N.constructor=I;ee(N,_.prototype);N.isPureReactComponent=!0;var G=Array.isArray,ne=Object.prototype.hasOwnProperty,W={current:null},oe={key:!0,ref:!0,__self:!0,__source:!0};function se(e,t,r){var n,o={},s=null,i=null;if(t!=null)for(n in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(s=""+t.key),t)ne.call(t,n)&&!oe.hasOwnProperty(n)&&(o[n]=t[n]);var c=arguments.length-2;if(c===1)o.children=r;else if(1<c){for(var f=Array(c),a=0;a<c;a++)f[a]=arguments[a+2];o.children=f}if(e&&e.defaultProps)for(n in c=e.defaultProps,c)o[n]===void 0&&(o[n]=c[n]);return{$$typeof:x,type:e,key:s,ref:i,props:o,_owner:W.current}}function Pe(e,t){return{$$typeof:x,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function z(e){return typeof e=="object"&&e!==null&&e.$$typeof===x}function je(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var Y=/\/+/g;function V(e,t){return typeof e=="object"&&e!==null&&e.key!=null?je(""+e.key):t.toString(36)}function C(e,t,r,n,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(s){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case x:case ye:i=!0}}if(i)return i=e,o=o(i),e=n===""?"."+V(i,0):n,G(o)?(r="",e!=null&&(r=e.replace(Y,"$&/")+"/"),C(o,t,r,"",function(a){return a})):o!=null&&(z(o)&&(o=Pe(o,r+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(Y,"$&/")+"/")+e)),t.push(o)),1;if(i=0,n=n===""?".":n+":",G(e))for(var c=0;c<e.length;c++){s=e[c];var f=n+V(s,c);i+=C(s,t,r,f,o)}else if(f=Oe(e),typeof f=="function")for(e=f.call(e),c=0;!(s=e.next()).done;)s=s.value,f=n+V(s,c++),i+=C(s,t,r,f,o);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function R(e,t,r){if(e==null)return e;var n=[],o=0;return C(e,n,"","",function(s){return t.call(r,s,o++)}),n}function Re(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var h={current:null},E={transition:null},ke={ReactCurrentDispatcher:h,ReactCurrentBatchConfig:E,ReactCurrentOwner:W};l.Children={map:R,forEach:function(e,t,r){R(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return R(e,function(){t++}),t},toArray:function(e){return R(e,function(t){return t})||[]},only:function(e){if(!z(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};l.Component=_;l.Fragment=he;l.Profiler=ge;l.PureComponent=I;l.StrictMode=me;l.Suspense=_e;l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ke;l.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var n=ee({},e.props),o=e.key,s=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,i=W.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(f in t)ne.call(t,f)&&!oe.hasOwnProperty(f)&&(n[f]=t[f]===void 0&&c!==void 0?c[f]:t[f])}var f=arguments.length-2;if(f===1)n.children=r;else if(1<f){c=Array(f);for(var a=0;a<f;a++)c[a]=arguments[a+2];n.children=c}return{$$typeof:x,type:e.type,key:o,ref:s,props:n,_owner:i}};l.createContext=function(e){return e={$$typeof:we,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:be,_context:e},e.Consumer=e};l.createElement=se;l.createFactory=function(e){var t=se.bind(null,e);return t.type=e,t};l.createRef=function(){return{current:null}};l.forwardRef=function(e){return{$$typeof:ve,render:e}};l.isValidElement=z;l.lazy=function(e){return{$$typeof:xe,_payload:{_status:-1,_result:e},_init:Re}};l.memo=function(e,t){return{$$typeof:Se,type:e,compare:t===void 0?null:t}};l.startTransition=function(e){var t=E.transition;E.transition={};try{e()}finally{E.transition=t}};l.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};l.useCallback=function(e,t){return h.current.useCallback(e,t)};l.useContext=function(e){return h.current.useContext(e)};l.useDebugValue=function(){};l.useDeferredValue=function(e){return h.current.useDeferredValue(e)};l.useEffect=function(e,t){return h.current.useEffect(e,t)};l.useId=function(){return h.current.useId()};l.useImperativeHandle=function(e,t,r){return h.current.useImperativeHandle(e,t,r)};l.useInsertionEffect=function(e,t){return h.current.useInsertionEffect(e,t)};l.useLayoutEffect=function(e,t){return h.current.useLayoutEffect(e,t)};l.useMemo=function(e,t){return h.current.useMemo(e,t)};l.useReducer=function(e,t,r){return h.current.useReducer(e,t,r)};l.useRef=function(e){return h.current.useRef(e)};l.useState=function(e){return h.current.useState(e)};l.useSyncExternalStore=function(e,t,r){return h.current.useSyncExternalStore(e,t,r)};l.useTransition=function(){return h.current.useTransition()};l.version="18.2.0";(function(e){e.exports=l})(de);const Ce=pe(m),ct=le({__proto__:null,default:Ce},[m]),ft=m.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"}),lt=m.createContext(null),pt=typeof document<"u";function dt(e){return typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function Ee(e){return typeof e=="string"||Array.isArray(e)}function Te(e){return typeof e=="object"&&typeof e.start=="function"}const $e=["initial","animate","exit","whileHover","whileDrag","whileTap","whileFocus","whileInView"];function Ve(e){return Te(e.animate)||$e.some(t=>Ee(e[t]))}function yt(e){return Boolean(Ve(e)||e.variants)}const b=e=>({isEnabled:t=>e.some(r=>!!t[r])}),ht={measureLayout:b(["layout","layoutId","drag"]),animation:b(["animate","exit","variants","whileHover","whileTap","whileFocus","whileDrag","whileInView"]),exit:b(["exit"]),drag:b(["drag","dragControls"]),focus:b(["whileFocus"]),hover:b(["whileHover","onHoverStart","onHoverEnd"]),tap:b(["whileTap","onTap","onTapStart","onTapCancel"]),pan:b(["onPan","onPanStart","onPanSessionStart","onPanEnd"]),inView:b(["whileInView","onViewportEnter","onViewportLeave"])};function mt(e){const t=m.useRef(null);return t.current===null&&(t.current=e()),t.current}const gt={hasAnimatedSinceResize:!0,hasEverUpdated:!1},bt=m.createContext({}),wt=m.createContext({}),Ae=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","svg","switch","symbol","text","tspan","use","view"];function vt(e){return typeof e!="string"||e.includes("-")?!1:!!(Ae.indexOf(e)>-1||/[A-Z]/.test(e))}const ae={};function _t(e){Object.assign(ae,e)}const M=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],ie=new Set(M);function Fe(e,{layout:t,layoutId:r}){return ie.has(e)||e.startsWith("origin")||(t||r!==void 0)&&(!!ae[e]||e==="opacity")}const B=e=>!!(e!=null&&e.getVelocity),Me={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Le=(e,t)=>M.indexOf(e)-M.indexOf(t);function De({transform:e,transformKeys:t},{enableHardwareAcceleration:r=!0,allowTransformNone:n=!0},o,s){let i="";t.sort(Le);for(const c of t)i+=`${Me[c]||c}(${e[c]}) `;return r&&!e.z&&(i+="translateZ(0)"),i=i.trim(),s?i=s(e,o?"":i):n&&o&&(i="none"),i}function Ie(e){return e.startsWith("--")}const Ne=(e,t)=>t&&typeof e=="number"?t.transform(e):e,We=(e,t)=>r=>Math.max(Math.min(r,t),e),St=e=>e%1?Number(e.toFixed(5)):e,xt=/(-)?([\d]*\.?[\d])+/g,Ot=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,Pt=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function ze(e){return typeof e=="string"}const H={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},A=Object.assign(Object.assign({},H),{transform:We(0,1)}),k=Object.assign(Object.assign({},H),{default:1}),O=e=>({test:t=>ze(t)&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),w=O("deg"),F=O("%"),u=O("px"),jt=O("vh"),Rt=O("vw"),Z=Object.assign(Object.assign({},F),{parse:e=>F.parse(e)/100,transform:e=>F.transform(e*100)}),X={...H,transform:Math.round},Be={borderWidth:u,borderTopWidth:u,borderRightWidth:u,borderBottomWidth:u,borderLeftWidth:u,borderRadius:u,radius:u,borderTopLeftRadius:u,borderTopRightRadius:u,borderBottomRightRadius:u,borderBottomLeftRadius:u,width:u,maxWidth:u,height:u,maxHeight:u,size:u,top:u,right:u,bottom:u,left:u,padding:u,paddingTop:u,paddingRight:u,paddingBottom:u,paddingLeft:u,margin:u,marginTop:u,marginRight:u,marginBottom:u,marginLeft:u,rotate:w,rotateX:w,rotateY:w,rotateZ:w,scale:k,scaleX:k,scaleY:k,scaleZ:k,skew:w,skewX:w,skewY:w,distance:u,translateX:u,translateY:u,translateZ:u,x:u,y:u,z:u,perspective:u,transformPerspective:u,opacity:A,originX:Z,originY:Z,originZ:u,zIndex:X,fillOpacity:A,strokeOpacity:A,numOctaves:X};function He(e,t,r,n){const{style:o,vars:s,transform:i,transformKeys:c,transformOrigin:f}=e;c.length=0;let a=!1,p=!1,y=!0;for(const d in t){const g=t[d];if(Ie(d)){s[d]=g;continue}const j=Be[d],$=Ne(g,j);if(ie.has(d)){if(a=!0,i[d]=$,c.push(d),!y)continue;g!==(j.default||0)&&(y=!1)}else d.startsWith("origin")?(p=!0,f[d]=$):o[d]=$}if(t.transform||(a||n?o.transform=De(e,r,y,n):o.transform&&(o.transform="none")),p){const{originX:d="50%",originY:g="50%",originZ:j=0}=f;o.transformOrigin=`${d} ${g} ${j}`}}function q(e,t,r){return typeof e=="string"?e:u.transform(t+r*e)}function Ue(e,t,r){const n=q(t,e.x,e.width),o=q(r,e.y,e.height);return`${n} ${o}`}const Ge={offset:"stroke-dashoffset",array:"stroke-dasharray"},Ye={offset:"strokeDashoffset",array:"strokeDasharray"};function Ze(e,t,r=1,n=0,o=!0){e.pathLength=1;const s=o?Ge:Ye;e[s.offset]=u.transform(-n);const i=u.transform(t),c=u.transform(r);e[s.array]=`${i} ${c}`}function kt(e,{attrX:t,attrY:r,originX:n,originY:o,pathLength:s,pathSpacing:i=1,pathOffset:c=0,...f},a,p){He(e,f,a,p),e.attrs=e.style,e.style={};const{attrs:y,style:d,dimensions:g}=e;y.transform&&(g&&(d.transform=y.transform),delete y.transform),g&&(n!==void 0||o!==void 0||d.transform)&&(d.transformOrigin=Ue(g,n!==void 0?n:.5,o!==void 0?o:.5)),t!==void 0&&(y.x=t),r!==void 0&&(y.y=r),s!==void 0&&Ze(y,s,i,c,!1)}const Xe=e=>e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();function qe(e,{style:t,vars:r},n,o){Object.assign(e.style,t,o&&o.getProjectionStyles(n));for(const s in r)e.style.setProperty(s,r[s])}const Ke=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength"]);function Ct(e,t,r,n){qe(e,t,void 0,n);for(const o in t.attrs)e.setAttribute(Ke.has(o)?o:Xe(o),t.attrs[o])}function Je(e){const{style:t}=e,r={};for(const n in t)(B(t[n])||Fe(n,e))&&(r[n]=t[n]);return r}function Et(e){const t=Je(e);for(const r in e)if(B(e[r])){const n=r==="x"||r==="y"?"attr"+r.toUpperCase():r;t[n]=e[r]}return t}function Tt(e,t,r,n={},o={}){return typeof t=="function"&&(t=t(r!==void 0?r:e.custom,n,o)),typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"&&(t=t(r!==void 0?r:e.custom,n,o)),t}const Qe=e=>Array.isArray(e),et=e=>Boolean(e&&typeof e=="object"&&e.mix&&e.toValue),$t=e=>Qe(e)?e[e.length-1]||0:e;function Vt(e){const t=B(e)?e.get():e;return et(t)?t.toValue():t}function At(e){return m.useEffect(()=>()=>e(),[])}var K=function(){return K=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(t[s]=r[s])}return t},K.apply(this,arguments)};function Ft(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r}function Mt(e,t,r,n){function o(s){return s instanceof r?s:new r(function(i){i(s)})}return new(r||(r=Promise))(function(s,i){function c(p){try{a(n.next(p))}catch(y){i(y)}}function f(p){try{a(n.throw(p))}catch(y){i(y)}}function a(p){p.done?s(p.value):o(p.value).then(c,f)}a((n=n.apply(e,t||[])).next())})}function Lt(e,t){var r={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},n,o,s,i;return i={next:c(0),throw:c(1),return:c(2)},typeof Symbol=="function"&&(i[Symbol.iterator]=function(){return this}),i;function c(a){return function(p){return f([a,p])}}function f(a){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,o&&(s=a[0]&2?o.return:a[0]?o.throw||((s=o.return)&&s.call(o),0):o.next)&&!(s=s.call(o,a[1])).done)return s;switch(o=0,s&&(a=[a[0]&2,s.value]),a[0]){case 0:case 1:s=a;break;case 4:return r.label++,{value:a[1],done:!1};case 5:r.label++,o=a[1],a=[0];continue;case 7:a=r.ops.pop(),r.trys.pop();continue;default:if(s=r.trys,!(s=s.length>0&&s[s.length-1])&&(a[0]===6||a[0]===2)){r=0;continue}if(a[0]===3&&(!s||a[1]>s[0]&&a[1]<s[3])){r.label=a[1];break}if(a[0]===6&&r.label<s[1]){r.label=s[1],s=a;break}if(s&&r.label<s[2]){r.label=s[2],r.ops.push(a);break}s[2]&&r.ops.pop(),r.trys.pop();continue}a=t.call(e,r)}catch(p){a=[6,p],o=0}finally{n=s=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}}function Dt(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,s=[],i;try{for(;(t===void 0||t-- >0)&&!(o=n.next()).done;)s.push(o.value)}catch(c){i={error:c}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(i)throw i.error}}return s}function It(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,s;n<o;n++)(s||!(n in t))&&(s||(s=Array.prototype.slice.call(t,0,n)),s[n]=t[n]);return e.concat(s||Array.prototype.slice.call(t))}const ue=1/60*1e3,tt=typeof performance<"u"?()=>performance.now():()=>Date.now(),ce=typeof window<"u"?e=>window.requestAnimationFrame(e):e=>setTimeout(()=>e(tt()),ue);function rt(e){let t=[],r=[],n=0,o=!1,s=!1;const i=new WeakSet,c={schedule:(f,a=!1,p=!1)=>{const y=p&&o,d=y?t:r;return a&&i.add(f),d.indexOf(f)===-1&&(d.push(f),y&&o&&(n=t.length)),f},cancel:f=>{const a=r.indexOf(f);a!==-1&&r.splice(a,1),i.delete(f)},process:f=>{if(o){s=!0;return}if(o=!0,[t,r]=[r,t],r.length=0,n=t.length,n)for(let a=0;a<n;a++){const p=t[a];p(f),i.has(p)&&(c.schedule(p),e())}o=!1,s&&(s=!1,c.process(f))}};return c}const nt=40;let L=!0,S=!1,D=!1;const v={delta:0,timestamp:0},P=["read","update","preRender","render","postRender"],T=P.reduce((e,t)=>(e[t]=rt(()=>S=!0),e),{}),Nt=P.reduce((e,t)=>{const r=T[t];return e[t]=(n,o=!1,s=!1)=>(S||st(),r.schedule(n,o,s)),e},{}),Wt=P.reduce((e,t)=>(e[t]=T[t].cancel,e),{}),zt=P.reduce((e,t)=>(e[t]=()=>T[t].process(v),e),{}),ot=e=>T[e].process(v),fe=e=>{S=!1,v.delta=L?ue:Math.max(Math.min(e-v.timestamp,nt),1),v.timestamp=e,D=!0,P.forEach(ot),D=!1,S&&(L=!1,ce(fe))},st=()=>{S=!0,L=!0,D||ce(fe)},Bt=()=>v,at="production",Ht=typeof process>"u"||process.env===void 0?at:"production",J=new Set;function Ut(e,t,r){e||J.has(t)||(console.warn(t),r&&console.warn(r),J.add(t))}export{Rt as $,it as A,Lt as B,It as C,Dt as D,ze as E,Pt as F,xt as G,F as H,St as I,A as J,H as K,bt as L,ft as M,We as N,Ot as O,lt as P,Ft as Q,ct as R,wt as S,Wt as T,Bt as U,Qe as V,Be as W,$t as X,u as Y,w as Z,Mt as _,Ce as a,jt as a0,ie as a1,M as a2,Ie as a3,qe as a4,Ke as a5,Xe as a6,_t as a7,zt as a8,ae as a9,K as aa,ut as ab,dt as b,Ve as c,Ee as d,gt as e,ht as f,pe as g,B as h,pt as i,Fe as j,He as k,kt as l,vt as m,Vt as n,yt as o,Te as p,Tt as q,m as r,Et as s,Ct as t,mt as u,Je as v,Nt as w,Ut as x,At as y,Ht as z};
