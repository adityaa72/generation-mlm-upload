import{a as o,B as n,j as r,bg as f,bh as d,T as i,aO as u,i as p,a7 as T,q as x,P as b,A as y}from"./index-a3673b34.js";import"./warn-once-32b7c465.js";import{H as g}from"./HeaderBreadcrumbs-006bc24f.js";import{u as a,D as C}from"./DataTable-fbcfd2cf.js";import{f as A}from"./formatTime-cc18d177.js";import{c as s}from"./index-03944998.js";import"./index-1771e82c.js";import"./EmptyContent-25dcb732.js";import"./CardHeader-a92719a0.js";import"./Close-30065dfa.js";import"./Skeleton-179a775c.js";import"./KeyboardArrowRight-32007a10.js";const v=()=>{const c=[{field:"createdAt",sort:"desc"}],m=[{field:"email",headerName:a("user"),minWidth:260,flex:1,renderCell({row:{avatar:e,displayName:t,email:l}}){return o(n,{display:"flex",alignItems:"center",children:[r(f,{alt:"name",src:e,color:e?"default":d(t).color,sx:{borderRadius:99,width:48,height:48,mr:2},children:d(t).name}),o(n,{children:[r(i,{variant:"body2",children:t}),r(i,{variant:"subtitle2",color:"text.secondary",children:l})]})]})}},{field:"userId",headerName:a("username / userid"),minWidth:150,flex:1,renderCell({row:{userName:e,userId:t}}){return o(n,{children:[r(i,{variant:"body2",children:e}),r(i,{variant:"subtitle2",color:"text.secondary",children:t})]})}},{field:"plan",headerName:a("Active plan"),minWidth:120,flex:1},{field:"level",headerName:a("level"),minWidth:80,flex:1,renderCell:({row:{level:e,myLevel:t}})=>e-t},{field:"kyc",headerName:a("kyc"),minWidth:70,flex:1,renderCell:({value:e})=>{const t=()=>e==="approved"?"lucide:check-circle":e==="pending"?"mdi:clock-time-three-outline":"ri:close-circle-line",l=()=>e==="approved"?"success":e==="pending"?"warning":e==="rejected"?"error":"info";return r(u,{title:s(e||"unverified"),children:r(n,{children:r(p,{color:l()+".main",sx:{fontSize:24},icon:t()})})})}},{field:"status",headerName:a("status"),minWidth:100,flex:1,renderCell:({value:e})=>r(T,{color:(l=>l==="active"?"success":"error")(e),children:s(e)})},{field:"referralId",headerName:a("Referral By"),minWidth:180,flex:1,renderCell({row:{referralDisplayName:e,referralId:t}}){return o(n,{children:[r(i,{variant:"body2",children:e}),r(i,{variant:"subtitle2",color:"text.secondary",children:t})]})}},{field:"createdAt",headerName:a("registered At"),minWidth:180,flex:1,filterable:!1,renderCell:({value:e})=>A(e)}],h=x.FetchTotalTeamList;return r(C,{title:"Total Team",queryKey:h,sortModel:c,columns:m})},W=()=>o(b,{title:"Total Team",children:[r(g,{heading:"Total Team",links:[{name:"Dashboard",href:y.dashboard},{name:"Total Team"}]}),r(v,{})]}),R=W;export{R as default};