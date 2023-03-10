import{a as d,aB as f,A as o,e as h,k as n,j as t,aO as p,B as u,a7 as x,q as C,P as T}from"./index-a3673b34.js";import"./warn-once-32b7c465.js";import{H as A}from"./HeaderBreadcrumbs-006bc24f.js";import{u as r,D as b}from"./DataTable-fbcfd2cf.js";import{f as s}from"./formatTime-cc18d177.js";import{c as N}from"./index-03944998.js";import"./index-1771e82c.js";import"./EmptyContent-25dcb732.js";import"./CardHeader-a92719a0.js";import"./Close-30065dfa.js";import"./Skeleton-179a775c.js";import"./KeyboardArrowRight-32007a10.js";const W=()=>{const l=[{field:"createdAt",sort:"desc"}],c=[{field:"transactionId",headerName:r("txn Id"),minWidth:120,flex:1,renderCell({row:{category:e,transactionId:i}}){return["plan_purchased","withdraw","deposit","purchased_product"].includes(e)?d(f,{to:o.transaction.view(i),component:h,children:["#",i]}):i}},{field:"amount",headerName:r("amount"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"charge",headerName:r("txn Charge"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"netAmount",headerName:r("net Amount"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"description",headerName:r("description"),minWidth:200,flex:1,renderCell:({value:e})=>t(p,{title:e,children:t(u,{children:e})})},{field:"status",headerName:r("status"),minWidth:100,flex:1,renderCell({value:e}){return t(x,{color:(a=>{if(a==="pending")return"warning";if(a==="capping")return"info";if(a==="debit"||a==="failed")return"error";if(a==="credit")return"success"})(e),children:N(e)})}},{field:"createdAt",headerName:r("created At"),minWidth:200,flex:1,filterable:!1,renderCell:({value:e})=>s(e)},{field:"updatedAt",headerName:r("proceed At"),minWidth:200,flex:1,filterable:!1,renderCell:({value:e})=>s(e)}],m=C.FetchTransactionList;return t(b,{title:"Transaction History",queryKey:m,sortModel:l,columns:c})},g=()=>d(T,{title:"Transaction",children:[t(A,{heading:"Transaction",links:[{name:"Dashboard",href:o.dashboard},{name:"Transaction"}]}),t(W,{})]}),$=g;export{$ as default};
