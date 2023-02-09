import{a4 as o,t as W,j as d,p as c,e as i,aV as g,aW as m,T as f,q as A,a5 as C,A as w,bB as n}from"./index-7ce534fb.js";import{u as r}from"./EmptyContent-22072c99.js";import{D as b}from"./DataTable-0ade8726.js";import{L as T}from"./Label-c270b6e0.js";import{f as h}from"./formatTime-af0276ab.js";import{c as N}from"./index-2e108c35.js";const j=({queryKey:u,title:p,pending:l,sortBy:x="createdAt"})=>{const y=[{field:x,sort:l?"asc":"desc"}],s=[{field:"userId",headerName:r("user"),minWidth:180,flex:1,renderCell({row:{userName:e,userId:a,avatar:t}}){return d(c,{display:"flex",alignItems:"center",children:[i(g,{alt:"name",src:t,color:t?"default":m(e).color,sx:{borderRadius:99,width:48,height:48,mr:2},children:m(e).name}),d(c,{children:[i(f,{variant:"body2",children:e}),i(f,{variant:"subtitle2",color:"text.secondary",children:a})]})]})}},{field:"gateway",headerName:r("gateway"),minWidth:120,flex:1},{field:"transactionId",headerName:r("txn Id"),minWidth:140,flex:1,renderCell({row:{id:e,transactionId:a}}){return d(A,{component:C,to:w.withdraw.transaction+"/"+a,children:["#",a]})}},{field:"amount",headerName:r("amount"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"charge",headerName:r("charge"),minWidth:89,flex:1,renderCell({value:e}){return n(e)}},{field:"netAmount",headerName:r("net Amount"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"status",headerName:r("Status"),minWidth:100,flex:1,renderCell({value:e}){return i(T,{color:(t=>{if(t==="rejected")return"error";if(t==="pending")return"warning";if(t==="success")return"success"})(e),children:N(e)})}},{field:"createdAt",headerName:r("created At"),minWidth:180,flex:1,renderCell:({value:e})=>h(e)}];return l||s.splice(8,0,{field:"updatedAt",headerName:r("proceed at"),minWidth:180,flex:1,renderCell:({value:e})=>h(e)}),i(b,{title:p,queryKey:u,sortModel:y,columns:s})};j.propTypes={queryKey:o.oneOf(Object.keys(W)).isRequired,title:o.string.isRequired};export{j as W};
