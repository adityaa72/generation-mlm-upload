import{e as a,bB as o,t as d,j as f,P as c}from"./index-7ce534fb.js";import"./warn-once-223a138d.js";import{H as p}from"./HeaderBreadcrumbs-7dcdcbac.js";import{u as t}from"./EmptyContent-22072c99.js";import{D as u}from"./DataTable-0ade8726.js";import{L as h}from"./Label-c270b6e0.js";import{T as x}from"./TableUser-6b416168.js";import{f as I}from"./formatTime-af0276ab.js";import{c as n}from"./index-2e108c35.js";import"./TableCell-b673782b.js";import"./Close-40502a6a.js";import"./Skeleton-7d8866f7.js";import"./index-1771e82c.js";import"./CardHeader-51eb309e.js";const b=()=>{const s=[{field:"createdAt",sort:"desc"}],m=[{field:"referralId",headerName:t("User"),minWidth:200,flex:1,renderCell:({row:{avatar:e,referralUserName:i,referralId:r}})=>a(x,{avatar:e,title:i,subtitle:r,userId:r})},{field:"referralIncome",headerName:t("referral Income"),minWidth:150,flex:1,renderCell({value:e}){return o(e)}},{field:"userId",headerName:t("referred id"),minWidth:150,flex:1},{field:"placement",headerName:t("placement"),minWidth:100,flex:1,renderCell({value:e}){return n(e)}},{field:"createdAt",headerName:t("referred At"),minWidth:200,flex:1,renderCell:({value:e})=>I(e)},{field:"status",headerName:t("status"),minWidth:100,flex:1,renderCell({value:e}){return a(h,{color:(r=>{if(r==="pending")return"warning";if(r==="level_exceed")return"error";if(r==="credit"||r==="capping")return"success"})(e),children:n(e)})}}],l=d.GetReferralIncomeList;return a(u,{title:"Referral Income",queryKey:l,sortModel:s,columns:m})},C=b;function K(){return f(c,{title:"Referral Income",children:[a(p,{heading:"Referral Income",links:[{name:"Reports"},{name:"Referral Income"}]}),a(C,{})]})}export{K as default};
