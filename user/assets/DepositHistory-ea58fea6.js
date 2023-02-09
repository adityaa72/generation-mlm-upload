import{a as s,B as d,j as r,I as g,T as w,aB as x,A as D,e as b,k as c,a7 as C,q as y,u as A,P as I,c as h,R as H,aM as m,aP as N}from"./index-a3673b34.js";import"./warn-once-32b7c465.js";import{H as W}from"./HeaderBreadcrumbs-006bc24f.js";import{u as a,D as P}from"./DataTable-fbcfd2cf.js";import{f as u}from"./formatTime-cc18d177.js";import{c as T}from"./index-03944998.js";import{I as f}from"./Dashboard-ed05a52c.js";import"./index-1771e82c.js";import"./EmptyContent-25dcb732.js";import"./CardHeader-a92719a0.js";import"./Close-30065dfa.js";import"./Skeleton-179a775c.js";import"./KeyboardArrowRight-32007a10.js";import"./CardContent-73270362.js";const p=t=>t==="pending"||t==="review"?"warning":t==="rejected"||t==="cancelled"||t==="failed"?"error":(t==="credit"||t==="approved","success");function R(){const t=[{field:"createdAt",sort:"desc"}],n=[{field:"gateway",headerName:a("gateway"),minWidth:180,flex:1,renderCell({row:{gateway:e,logo:i}}){return s(d,{display:"flex",alignItems:"center",children:[r(g,{disabledEffect:!0,alt:e,src:i,sx:{borderRadius:999,width:48,height:48,mr:2}}),r(d,{children:r(w,{variant:"body2",children:e})})]})}},{field:"transactionId",headerName:a("txn Id"),minWidth:150,flex:1,renderCell({value:e}){return s(x,{to:D.depositSystem.transaction+"/"+e,component:b,children:["#",e]})}},{field:"amount",headerName:a("amount"),minWidth:120,flex:1,renderCell:({row:{amount:e,status:i}})=>r(d,{color:p(i)+".main",children:c(e)})},{field:"charge",headerName:a("charge"),minWidth:100,flex:1,renderCell:({row:{charge:e,status:i}})=>r(d,{color:p(i)+".main",children:c(e)})},{field:"netAmount",headerName:a("net Amount"),minWidth:120,flex:1,renderCell:({row:{netAmount:e,status:i}})=>r(d,{color:p(i)+".main",children:c(e)})},{field:"createdAt",headerName:a("requested At"),minWidth:170,flex:1,filterable:!1,renderCell:({value:e})=>u(e)},{field:"updatedAt",headerName:a("proceed At"),minWidth:160,flex:1,filterable:!1,renderCell:({value:e})=>u(e)},{field:"status",headerName:a("status"),minWidth:100,flex:1,renderCell({value:e}){return r(C,{color:(o=>{if(o==="pending"||o==="review")return"warning";if(o==="rejected"||o==="cancelled"||o==="failed")return"error";if(o==="credit"||o==="approved")return"success"})(e),children:T(e)})}}],l=y.FetchDepositHistory;return r(P,{title:"Deposit History",queryKey:l,sortModel:t,columns:n})}const Q=()=>{const t={wallet:0,deposit:0,depositInReview:0},{data:{data:n=t}={},isLoading:l}=A([y.GetDashboardAnalytics],N);return s(I,{title:"Deposit History",children:[r(W,{heading:"Deposit History",links:[{name:"Dashboard"},{name:"Deposit History"}]}),s(h,{container:!0,spacing:H,children:[r(f,{loading:l,label:"Wallet",value:n.wallet,format:m,color:"primary",icon:"teenyicons:wallet-alt-outline"}),r(f,{loading:l,label:"Total Deposit",value:n.deposit,format:m,color:"secondary",icon:"uil:money-insert"}),r(f,{loading:l,color:"warning",label:"Deposit In Review",value:n.depositInReview,format:m,icon:"fluent:clock-arrow-download-20-regular"}),r(h,{item:!0,xs:12,children:r(R,{})})]})]})};export{Q as default};