import{p as be,o as pe,s as A,a6 as Le,aa as Ne,t as f,r as he,_ as re,w as W,a as G,x as me,ad as fe,ag as ke,j as y,aI as $e,ak as de,af as Ve}from"./index-a3673b34.js";import{r as c}from"./warn-once-32b7c465.js";import{a as Oe,K as je}from"./KeyboardArrowRight-32007a10.js";let X;function Fe(){if(X)return X;const e=document.createElement("div"),t=document.createElement("div");return t.style.width="10px",t.style.height="1px",e.appendChild(t),e.dir="rtl",e.style.fontSize="14px",e.style.width="4px",e.style.height="1px",e.style.position="absolute",e.style.top="-1000px",e.style.overflow="scroll",document.body.appendChild(e),X="reverse",e.scrollLeft>0?X="default":(e.scrollLeft=1,e.scrollLeft===0&&(X="negative")),document.body.removeChild(e),X}function Me(e,t){const r=e.scrollLeft;if(t!=="rtl")return r;switch(Fe()){case"negative":return e.scrollWidth-e.clientWidth+r;case"reverse":return e.scrollWidth-e.clientWidth-r;default:return r}}function qe(e){return pe("MuiTab",e)}const Ge=be("MuiTab",["root","labelIcon","textColorInherit","textColorPrimary","textColorSecondary","selected","disabled","fullWidth","wrapped","iconWrapper"]),F=Ge,Je=["className","disabled","disableFocusRipple","fullWidth","icon","iconPosition","indicator","label","onChange","onClick","onFocus","selected","selectionFollowsFocus","textColor","value","wrapped"],Qe=e=>{const{classes:t,textColor:r,fullWidth:a,wrapped:n,icon:d,label:b,selected:h,disabled:u}=e,m={root:["root",d&&b&&"labelIcon",`textColor${Ne(r)}`,a&&"fullWidth",n&&"wrapped",h&&"selected",u&&"disabled"],iconWrapper:["iconWrapper"]};return me(m,qe,t)},Ze=A(Le,{name:"MuiTab",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,r.label&&r.icon&&t.labelIcon,t[`textColor${Ne(r.textColor)}`],r.fullWidth&&t.fullWidth,r.wrapped&&t.wrapped]}})(({theme:e,ownerState:t})=>f({},e.typography.button,{maxWidth:360,minWidth:90,position:"relative",minHeight:48,flexShrink:0,padding:"12px 16px",overflow:"hidden",whiteSpace:"normal",textAlign:"center"},t.label&&{flexDirection:t.iconPosition==="top"||t.iconPosition==="bottom"?"column":"row"},{lineHeight:1.25},t.icon&&t.label&&{minHeight:72,paddingTop:9,paddingBottom:9,[`& > .${F.iconWrapper}`]:f({},t.iconPosition==="top"&&{marginBottom:6},t.iconPosition==="bottom"&&{marginTop:6},t.iconPosition==="start"&&{marginRight:e.spacing(1)},t.iconPosition==="end"&&{marginLeft:e.spacing(1)})},t.textColor==="inherit"&&{color:"inherit",opacity:.6,[`&.${F.selected}`]:{opacity:1},[`&.${F.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity}},t.textColor==="primary"&&{color:(e.vars||e).palette.text.secondary,[`&.${F.selected}`]:{color:(e.vars||e).palette.primary.main},[`&.${F.disabled}`]:{color:(e.vars||e).palette.text.disabled}},t.textColor==="secondary"&&{color:(e.vars||e).palette.text.secondary,[`&.${F.selected}`]:{color:(e.vars||e).palette.secondary.main},[`&.${F.disabled}`]:{color:(e.vars||e).palette.text.disabled}},t.fullWidth&&{flexShrink:1,flexGrow:1,flexBasis:0,maxWidth:"none"},t.wrapped&&{fontSize:e.typography.pxToRem(12)})),et=c.forwardRef(function(t,r){const a=he({props:t,name:"MuiTab"}),{className:n,disabled:d=!1,disableFocusRipple:b=!1,fullWidth:h,icon:u,iconPosition:m="top",indicator:T,label:w,onChange:g,onClick:B,onFocus:J,selected:E,selectionFollowsFocus:x,textColor:Q="inherit",value:z,wrapped:ne=!1}=a,D=re(a,Je),I=f({},a,{disabled:d,disableFocusRipple:b,selected:E,icon:!!u,iconPosition:m,label:!!w,fullWidth:h,textColor:Q,wrapped:ne}),Y=Qe(I),L=u&&w&&c.isValidElement(u)?c.cloneElement(u,{className:W(Y.iconWrapper,u.props.className)}):u,K=N=>{!E&&g&&g(N,z),B&&B(N)},U=N=>{x&&!E&&g&&g(N,z),J&&J(N)};return G(Ze,f({focusRipple:!b,className:W(Y.root,n),ref:r,role:"tab","aria-selected":E,disabled:d,onClick:K,onFocus:U,ownerState:I,tabIndex:E?0:-1},D,{children:[m==="top"||m==="start"?G(c.Fragment,{children:[L,w]}):G(c.Fragment,{children:[w,L]}),T]}))}),Rt=et;function tt(e){return(1+Math.sin(Math.PI*e-Math.PI/2))/2}function ot(e,t,r,a={},n=()=>{}){const{ease:d=tt,duration:b=300}=a;let h=null;const u=t[e];let m=!1;const T=()=>{m=!0},w=g=>{if(m){n(new Error("Animation cancelled"));return}h===null&&(h=g);const B=Math.min(1,(g-h)/b);if(t[e]=d(B)*(r-u)+u,B>=1){requestAnimationFrame(()=>{n(null)});return}requestAnimationFrame(w)};return u===r?(n(new Error("Element already at target position")),T):(requestAnimationFrame(w),T)}const lt=["onChange"],rt={width:99,height:99,position:"absolute",top:-9999,overflow:"scroll"};function nt(e){const{onChange:t}=e,r=re(e,lt),a=c.useRef(),n=c.useRef(null),d=()=>{a.current=n.current.offsetHeight-n.current.clientHeight};return c.useEffect(()=>{const b=fe(()=>{const u=a.current;d(),u!==a.current&&t(a.current)}),h=ke(n.current);return h.addEventListener("resize",b),()=>{b.clear(),h.removeEventListener("resize",b)}},[t]),c.useEffect(()=>{d(),t(a.current)},[t]),y("div",f({style:rt,ref:n},r))}function st(e){return pe("MuiTabScrollButton",e)}const it=be("MuiTabScrollButton",["root","vertical","horizontal","disabled"]),at=it;var Re,We;const ct=["className","direction","orientation","disabled"],dt=e=>{const{classes:t,orientation:r,disabled:a}=e;return me({root:["root",r,a&&"disabled"]},st,t)},ut=A(Le,{name:"MuiTabScrollButton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,r.orientation&&t[r.orientation]]}})(({ownerState:e})=>f({width:40,flexShrink:0,opacity:.8,[`&.${at.disabled}`]:{opacity:0}},e.orientation==="vertical"&&{width:"100%",height:40,"& svg":{transform:`rotate(${e.isRtl?-90:90}deg)`}})),ft=c.forwardRef(function(t,r){const a=he({props:t,name:"MuiTabScrollButton"}),{className:n,direction:d}=a,b=re(a,ct),u=$e().direction==="rtl",m=f({isRtl:u},a),T=dt(m);return y(ut,f({component:"div",className:W(T.root,n),ref:r,role:null,ownerState:m,tabIndex:null},b,{children:d==="left"?Re||(Re=y(Oe,{fontSize:"small"})):We||(We=y(je,{fontSize:"small"}))}))}),bt=ft;function pt(e){return pe("MuiTabs",e)}const ht=be("MuiTabs",["root","vertical","flexContainer","flexContainerVertical","centered","scroller","fixed","scrollableX","scrollableY","hideScrollbar","scrollButtons","scrollButtonsHideMobile","indicator"]),ue=ht,mt=["aria-label","aria-labelledby","action","centered","children","className","component","allowScrollButtonsMobile","indicatorColor","onChange","orientation","ScrollButtonComponent","scrollButtons","selectionFollowsFocus","TabIndicatorProps","TabScrollButtonProps","textColor","value","variant","visibleScrollbar"],Ee=(e,t)=>e===t?e.firstChild:t&&t.nextElementSibling?t.nextElementSibling:e.firstChild,ze=(e,t)=>e===t?e.lastChild:t&&t.previousElementSibling?t.previousElementSibling:e.lastChild,le=(e,t,r)=>{let a=!1,n=r(e,t);for(;n;){if(n===e.firstChild){if(a)return;a=!0}const d=n.disabled||n.getAttribute("aria-disabled")==="true";if(!n.hasAttribute("tabindex")||d)n=r(e,n);else{n.focus();return}}},vt=e=>{const{vertical:t,fixed:r,hideScrollbar:a,scrollableX:n,scrollableY:d,centered:b,scrollButtonsHideMobile:h,classes:u}=e;return me({root:["root",t&&"vertical"],scroller:["scroller",r&&"fixed",a&&"hideScrollbar",n&&"scrollableX",d&&"scrollableY"],flexContainer:["flexContainer",t&&"flexContainerVertical",b&&"centered"],indicator:["indicator"],scrollButtons:["scrollButtons",h&&"scrollButtonsHideMobile"],scrollableX:[n&&"scrollableX"],hideScrollbar:[a&&"hideScrollbar"]},pt,u)},St=A("div",{name:"MuiTabs",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[{[`& .${ue.scrollButtons}`]:t.scrollButtons},{[`& .${ue.scrollButtons}`]:r.scrollButtonsHideMobile&&t.scrollButtonsHideMobile},t.root,r.vertical&&t.vertical]}})(({ownerState:e,theme:t})=>f({overflow:"hidden",minHeight:48,WebkitOverflowScrolling:"touch",display:"flex"},e.vertical&&{flexDirection:"column"},e.scrollButtonsHideMobile&&{[`& .${ue.scrollButtons}`]:{[t.breakpoints.down("sm")]:{display:"none"}}})),gt=A("div",{name:"MuiTabs",slot:"Scroller",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.scroller,r.fixed&&t.fixed,r.hideScrollbar&&t.hideScrollbar,r.scrollableX&&t.scrollableX,r.scrollableY&&t.scrollableY]}})(({ownerState:e})=>f({position:"relative",display:"inline-block",flex:"1 1 auto",whiteSpace:"nowrap"},e.fixed&&{overflowX:"hidden",width:"100%"},e.hideScrollbar&&{scrollbarWidth:"none","&::-webkit-scrollbar":{display:"none"}},e.scrollableX&&{overflowX:"auto",overflowY:"hidden"},e.scrollableY&&{overflowY:"auto",overflowX:"hidden"})),xt=A("div",{name:"MuiTabs",slot:"FlexContainer",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.flexContainer,r.vertical&&t.flexContainerVertical,r.centered&&t.centered]}})(({ownerState:e})=>f({display:"flex"},e.vertical&&{flexDirection:"column"},e.centered&&{justifyContent:"center"})),Ct=A("span",{name:"MuiTabs",slot:"Indicator",overridesResolver:(e,t)=>t.indicator})(({ownerState:e,theme:t})=>f({position:"absolute",height:2,bottom:0,width:"100%",transition:t.transitions.create()},e.indicatorColor==="primary"&&{backgroundColor:(t.vars||t).palette.primary.main},e.indicatorColor==="secondary"&&{backgroundColor:(t.vars||t).palette.secondary.main},e.vertical&&{height:"100%",width:2,right:0})),wt=A(nt,{name:"MuiTabs",slot:"ScrollbarSize"})({overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none","&::-webkit-scrollbar":{display:"none"}}),Ie={},yt=c.forwardRef(function(t,r){const a=he({props:t,name:"MuiTabs"}),n=$e(),d=n.direction==="rtl",{"aria-label":b,"aria-labelledby":h,action:u,centered:m=!1,children:T,className:w,component:g="div",allowScrollButtonsMobile:B=!1,indicatorColor:J="primary",onChange:E,orientation:x="horizontal",ScrollButtonComponent:Q=bt,scrollButtons:z="auto",selectionFollowsFocus:ne,TabIndicatorProps:D={},TabScrollButtonProps:I={},textColor:Y="primary",value:L,variant:K="standard",visibleScrollbar:U=!1}=a,N=re(a,mt),M=K==="scrollable",v=x==="vertical",_=v?"scrollTop":"scrollLeft",Z=v?"top":"left",ee=v?"bottom":"right",se=v?"clientHeight":"clientWidth",V=v?"height":"width",O=f({},a,{component:g,allowScrollButtonsMobile:B,indicatorColor:J,orientation:x,vertical:v,scrollButtons:z,textColor:Y,variant:K,visibleScrollbar:U,fixed:!M,hideScrollbar:M&&!U,scrollableX:M&&!v,scrollableY:M&&v,centered:m&&!M,scrollButtonsHideMobile:!B}),R=vt(O),[ve,Ae]=c.useState(!1),[k,Se]=c.useState(Ie),[H,He]=c.useState({start:!1,end:!1}),[ge,Pe]=c.useState({overflow:"hidden",scrollbarWidth:0}),xe=new Map,C=c.useRef(null),j=c.useRef(null),Ce=()=>{const o=C.current;let l;if(o){const i=o.getBoundingClientRect();l={clientWidth:o.clientWidth,scrollLeft:o.scrollLeft,scrollTop:o.scrollTop,scrollLeftNormalized:Me(o,n.direction),scrollWidth:o.scrollWidth,top:i.top,bottom:i.bottom,left:i.left,right:i.right}}let s;if(o&&L!==!1){const i=j.current.children;if(i.length>0){const p=i[xe.get(L)];s=p?p.getBoundingClientRect():null}}return{tabsMeta:l,tabMeta:s}},q=de(()=>{const{tabsMeta:o,tabMeta:l}=Ce();let s=0,i;if(v)i="top",l&&o&&(s=l.top-o.top+o.scrollTop);else if(i=d?"right":"left",l&&o){const S=d?o.scrollLeftNormalized+o.clientWidth-o.scrollWidth:o.scrollLeft;s=(d?-1:1)*(l[i]-o[i]+S)}const p={[i]:s,[V]:l?l[V]:0};if(isNaN(k[i])||isNaN(k[V]))Se(p);else{const S=Math.abs(k[i]-p[i]),P=Math.abs(k[V]-p[V]);(S>=1||P>=1)&&Se(p)}}),ie=(o,{animation:l=!0}={})=>{l?ot(_,C.current,o,{duration:n.transitions.duration.standard}):C.current[_]=o},we=o=>{let l=C.current[_];v?l+=o:(l+=o*(d?-1:1),l*=d&&Fe()==="reverse"?-1:1),ie(l)},ye=()=>{const o=C.current[se];let l=0;const s=Array.from(j.current.children);for(let i=0;i<s.length;i+=1){const p=s[i];if(l+p[se]>o){i===0&&(l=o);break}l+=p[se]}return l},Xe=()=>{we(-1*ye())},De=()=>{we(ye())},Ye=c.useCallback(o=>{Pe({overflow:null,scrollbarWidth:o})},[]),Ke=()=>{const o={};o.scrollbarSizeListener=M?y(wt,{onChange:Ye,className:W(R.scrollableX,R.hideScrollbar)}):null;const l=H.start||H.end,s=M&&(z==="auto"&&l||z===!0);return o.scrollButtonStart=s?y(Q,f({orientation:x,direction:d?"right":"left",onClick:Xe,disabled:!H.start},I,{className:W(R.scrollButtons,I.className)})):null,o.scrollButtonEnd=s?y(Q,f({orientation:x,direction:d?"left":"right",onClick:De,disabled:!H.end},I,{className:W(R.scrollButtons,I.className)})):null,o},Te=de(o=>{const{tabsMeta:l,tabMeta:s}=Ce();if(!(!s||!l)){if(s[Z]<l[Z]){const i=l[_]+(s[Z]-l[Z]);ie(i,{animation:o})}else if(s[ee]>l[ee]){const i=l[_]+(s[ee]-l[ee]);ie(i,{animation:o})}}}),$=de(()=>{if(M&&z!==!1){const{scrollTop:o,scrollHeight:l,clientHeight:s,scrollWidth:i,clientWidth:p}=C.current;let S,P;if(v)S=o>1,P=o<l-s-1;else{const oe=Me(C.current,n.direction);S=d?oe<i-p-1:oe>1,P=d?oe>1:oe<i-p-1}(S!==H.start||P!==H.end)&&He({start:S,end:P})}});c.useEffect(()=>{const o=fe(()=>{C.current&&(q(),$())}),l=ke(C.current);l.addEventListener("resize",o);let s;return typeof ResizeObserver<"u"&&(s=new ResizeObserver(o),Array.from(j.current.children).forEach(i=>{s.observe(i)})),()=>{o.clear(),l.removeEventListener("resize",o),s&&s.disconnect()}},[q,$]);const ae=c.useMemo(()=>fe(()=>{$()}),[$]);c.useEffect(()=>()=>{ae.clear()},[ae]),c.useEffect(()=>{Ae(!0)},[]),c.useEffect(()=>{q(),$()}),c.useEffect(()=>{Te(Ie!==k)},[Te,k]),c.useImperativeHandle(u,()=>({updateIndicator:q,updateScrollButtons:$}),[q,$]);const Be=y(Ct,f({},D,{className:W(R.indicator,D.className),ownerState:O,style:f({},k,D.style)}));let te=0;const Ue=c.Children.map(T,o=>{if(!c.isValidElement(o))return null;const l=o.props.value===void 0?te:o.props.value;xe.set(l,te);const s=l===L;return te+=1,c.cloneElement(o,f({fullWidth:K==="fullWidth",indicator:s&&!ve&&Be,selected:s,selectionFollowsFocus:ne,onChange:E,textColor:Y,value:l},te===1&&L===!1&&!o.props.tabIndex?{tabIndex:0}:{}))}),_e=o=>{const l=j.current,s=Ve(l).activeElement;if(s.getAttribute("role")!=="tab")return;let p=x==="horizontal"?"ArrowLeft":"ArrowUp",S=x==="horizontal"?"ArrowRight":"ArrowDown";switch(x==="horizontal"&&d&&(p="ArrowRight",S="ArrowLeft"),o.key){case p:o.preventDefault(),le(l,s,ze);break;case S:o.preventDefault(),le(l,s,Ee);break;case"Home":o.preventDefault(),le(l,null,Ee);break;case"End":o.preventDefault(),le(l,null,ze);break}},ce=Ke();return G(St,f({className:W(R.root,w),ownerState:O,ref:r,as:g},N,{children:[ce.scrollButtonStart,ce.scrollbarSizeListener,G(gt,{className:R.scroller,ownerState:O,style:{overflow:ge.overflow,[v?`margin${d?"Left":"Right"}`:"marginBottom"]:U?void 0:-ge.scrollbarWidth},ref:C,onScroll:ae,children:[y(xt,{"aria-label":b,"aria-labelledby":h,"aria-orientation":x==="vertical"?"vertical":null,className:R.flexContainer,ownerState:O,onKeyDown:_e,ref:j,role:"tablist",children:Ue}),ve&&Be]}),ce.scrollButtonEnd]}))}),Wt=yt;export{Wt as T,Rt as a};