import{w as y,t as m,j as i,F as v,e,U as x,V as I,bB as u,p as b,T as d,P as C,N,O as g,J as o,Q as P}from"./index-7ce534fb.js";import{H as W}from"./HeaderBreadcrumbs-7dcdcbac.js";import{I as c}from"./Dashboard-57c068ae.js";import{u as r}from"./EmptyContent-22072c99.js";import{D}from"./DataTableClient-3fc18a4d.js";import{D as T}from"./DataTable-0ade8726.js";import{T as w}from"./TableUser-6b416168.js";import{f as A}from"./formatTime-af0276ab.js";import"./warn-once-223a138d.js";import"./Editor-28a84faa.js";import"./FormLabel-b1fd6c0d.js";import"./CardHeader-51eb309e.js";import"./CardContent-d5c47145.js";import"./Skeleton-7d8866f7.js";import"./TableCell-b673782b.js";import"./Close-40502a6a.js";import"./index-1771e82c.js";const G=()=>{const{data:{data:a={}}={},isLoading:n}=y([m.GetDashboardAnalytics],I),{planSoldCount:s,planSold:t}=a;return i(v,{children:[e(c,{label:"Plans Sold",value:s,icon:"teenyicons:wallet-alt-outline",color:"primary",loading:n,md:6,xl:6}),e(c,{label:"Plans Earning",value:t,icon:"teenyicons:wallet-alt-outline",format:x,color:"secondary",loading:n,md:6,xl:6})]})},S=()=>{const a=[{field:"amount",sort:"desc"}],n=[{field:"planName",headerName:r("plan"),minWidth:100,flex:1},{field:"investment",headerName:r("investment"),minWidth:100,flex:1},{field:"amount",headerName:r("amount"),minWidth:100,flex:1,renderCell({value:s}){return u(s)}}];return e(D,{title:"Plan Investment",queryKey:m.GetPackageInvestmentList,sortModel:a,columns:n})},U=()=>{const a=[{field:"createdAt",sort:"desc"}],n=[{field:"email",headerName:r("user"),minWidth:260,flex:1,renderCell:({row:{avatar:t,firstName:l,lastName:p,email:f,userId:h}})=>e(w,{avatar:t,title:`${l} ${p}`,subtitle:f,userId:h})},{field:"userId",headerName:r("username / userid"),minWidth:150,flex:1,renderCell({row:{userName:t,userId:l}}){return i(b,{children:[e(d,{variant:"body2",children:t}),e(d,{variant:"subtitle2",color:"text.secondary",children:l})]})}},{field:"planName",headerName:r("plan Name"),minWidth:80,flex:1},{field:"price",headerName:r("price"),minWidth:80,flex:1,renderCell({value:t}){return u(t)}},{field:"createdAt",headerName:r("Purchased At"),minWidth:200,flex:1,renderCell:({value:t})=>A(t)}],s=m.FetchUsersInvestmentList;return e(T,{title:"Users Investment",queryKey:s,sortModel:a,columns:n})},j=()=>i(C,{title:"Investment",children:[e(W,{heading:"Investment",links:[{name:"Reports"},{name:"Investment"}]}),e(N,{disableGutters:!0,component:g,children:i(o,{container:!0,spacing:P,children:[e(G,{}),e(o,{item:!0,xs:12,children:e(S,{})}),e(o,{item:!0,xs:12,children:e(U,{})})]})})]}),X=j;export{X as default};