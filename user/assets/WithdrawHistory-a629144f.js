import{a as l,B as d,j as r,I as g,T as W,aB as b,A as p,e as x,k as c,a7 as C,q as y,u as A,P as H,c as u,R as N,aM as m,aP as P}from"./index-a3673b34.js";import"./warn-once-32b7c465.js";import{H as I}from"./HeaderBreadcrumbs-006bc24f.js";import{u as t,D}from"./DataTable-fbcfd2cf.js";import{f as w}from"./formatTime-cc18d177.js";import{c as T}from"./index-03944998.js";import{I as h}from"./Dashboard-ed05a52c.js";import"./index-1771e82c.js";import"./EmptyContent-25dcb732.js";import"./CardHeader-a92719a0.js";import"./Close-30065dfa.js";import"./Skeleton-179a775c.js";import"./KeyboardArrowRight-32007a10.js";import"./CardContent-73270362.js";const f=i=>i==="pending"?"warning":i==="rejected"?"error":"success";function j(){const i=[{field:"createdAt",sort:"desc"}],n=[{field:"gateway",headerName:t("gateway"),minWidth:160,flex:1,renderCell({row:{gateway:e,logo:a}}){return l(d,{display:"flex",alignItems:"center",children:[r(g,{disabledEffect:!0,alt:e,src:a,sx:{borderRadius:999,width:48,height:48,mr:2}}),r(d,{children:r(W,{variant:"body2",children:e})})]})}},{field:"transactionId",headerName:t("txnId"),minWidth:150,flex:1,renderCell({value:e}){return l(b,{to:p.withdrawSystem.transaction+"/"+e,component:x,children:["#",e]})}},{field:"amount",headerName:t("amount"),minWidth:100,flex:1,renderCell({row:{amount:e,status:a}}){return r(d,{color:f(a)+".main",children:c(e)})}},{field:"charge",headerName:t("charges"),minWidth:80,flex:1,renderCell:({row:{charge:e,status:a}})=>r(d,{color:f(a)+".main",children:c(e)})},{field:"netAmount",headerName:t("net Amount"),minWidth:100,flex:1,renderCell({row:{netAmount:e,status:a}}){return r(d,{color:f(a)+".main",children:c(e)})}},{field:"createdAt",headerName:t("requested At"),minWidth:180,flex:1,filterable:!1,renderCell:({value:e})=>w(e)},{field:"updatedAt",headerName:t("processed At"),minWidth:180,flex:1,filterable:!1,renderCell:({value:e})=>w(e)},{field:"status",headerName:t("status"),minWidth:100,flex:1,renderCell({value:e}){return r(C,{color:(s=>{if(s==="pending")return"warning";if(s==="rejected")return"error";if(s==="success")return"success"})(e),children:T(e)})}}],o=y.FetchWithdrawHistory;return r(D,{title:"Withdraw History",queryKey:o,sortModel:i,columns:n})}const V=()=>{const i={wallet:0,withdraw:0,pendingWithdraw:0},{data:{data:n=i}={},isLoading:o}=A([y.GetDashboardAnalytics],P);return l(H,{title:"Withdraw History",children:[r(I,{heading:"Withdraw History",links:[{name:"Dashboard",href:p.dashboard},{name:"Withdraw History"}]}),l(u,{container:!0,spacing:N,children:[r(h,{loading:o,label:"Wallet",value:n.wallet,format:m,color:"primary",icon:"teenyicons:wallet-alt-outline"}),r(h,{loading:o,label:"Total Withdraw",value:n.withdraw,format:m,color:"secondary",icon:"uil:money-withdraw"}),r(h,{loading:o,color:"warning",label:"Pending Withdraw",value:n.pendingWithdraw,format:m,icon:"fluent:clock-arrow-download-20-regular",rotate:2}),r(u,{item:!0,xs:12,children:r(j,{})})]})]})};export{V as default};