import{a as l,B as n,j as r,bg as h,bh as s,T as o,aO as u,i as p,a7 as y,P as x,A as g,q as b}from"./index-a3673b34.js";import"./warn-once-32b7c465.js";import{u as i,D as C}from"./DataTable-fbcfd2cf.js";import{H as A}from"./HeaderBreadcrumbs-006bc24f.js";import{f as M}from"./formatTime-cc18d177.js";import{c as d}from"./index-03944998.js";import"./index-1771e82c.js";import"./EmptyContent-25dcb732.js";import"./CardHeader-a92719a0.js";import"./Close-30065dfa.js";import"./Skeleton-179a775c.js";import"./KeyboardArrowRight-32007a10.js";const R=()=>{const c=[{field:"createdAt",sort:"desc"}],f=[{field:"email",headerName:i("user"),minWidth:260,flex:1,renderCell({row:{avatar:e,displayName:t,email:a}}){return l(n,{display:"flex",alignItems:"center",children:[r(h,{alt:"name",src:e,color:e?"default":s(t).color,sx:{borderRadius:99,width:48,height:48,mr:2},children:s(t).name}),l(n,{children:[r(o,{variant:"body2",children:t}),r(o,{variant:"subtitle2",color:"text.secondary",children:a})]})]})}},{field:"userId",headerName:i("username / userid"),minWidth:150,flex:1,renderCell({row:{userName:e,userId:t}}){return l(n,{children:[r(o,{variant:"body2",children:e}),r(o,{variant:"subtitle2",color:"text.secondary",children:t})]})}},{field:"plan",headerName:i("active plan"),minWidth:120,flex:1},{field:"level",headerName:i("level"),minWidth:80,flex:1,renderCell:({row:{level:e,myLevel:t}})=>e-t},{field:"createdAt",headerName:i("registered At"),minWidth:200,flex:1,filterable:!1,renderCell:({value:e})=>M(e)},{field:"kyc",headerName:i("kyc"),minWidth:50,flex:1,renderCell:({value:e})=>{const t=()=>e==="approved"?"lucide:check-circle":e==="pending"?"mdi:clock-time-three-outline":"ri:close-circle-line",a=()=>e==="approved"?"success":e==="pending"?"warning":e==="rejected"?"error":"info";return r(u,{title:d(e||"unverified"),children:r(n,{children:r(p,{color:a()+".main",sx:{fontSize:24},icon:t()})})})}},{field:"status",headerName:i("status"),minWidth:100,flex:1,renderCell:({value:e})=>r(y,{color:(a=>a==="active"?"success":"error")(e),children:d(e)})}],m=b.FetchMyReferralList;return l(x,{title:"My Referrals",children:[r(A,{heading:"My Referrals",links:[{name:"Dashboard",href:g.dashboard},{name:"My Referrals"}]}),r(C,{title:"My Referrals",queryKey:m,sortModel:c,columns:f})]})},H=R;export{H as default};