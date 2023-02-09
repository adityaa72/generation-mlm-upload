import{bd as x,s as F,u as C,e,L as S,bW as N,A as b,t as g,bn as A,w as j,c as R,a as r,d as H,j as t,P as V,z as G,h as Q,C as z,bc as B,S as s,R as a,aD as d,p as y,o as E,bX as W,bV as K}from"./index-7ce534fb.js";import{r as k}from"./warn-once-223a138d.js";import{F as h}from"./FormLabel-b1fd6c0d.js";import{H as M}from"./HeaderBreadcrumbs-7dcdcbac.js";import{C as T}from"./CardHeader-51eb309e.js";import{C as $}from"./CardContent-d5c47145.js";const X=({planId:c})=>{const m=x(),u=F(),n=C(),[P,l]=k.useState(!1);return e(S,{onClick:async()=>{try{await m({description:"Are you sure you want to delete this plan?"}),l(!0),await N(c),n(b.planSetting.root),u.invalidateQueries([g.GetPlanList])}catch(i){console.log("🚀 ~ file: DeletePlan.jsx:10 ~ handleDelete ~ error",i)}finally{l(!1)}},loading:P,variant:"contained",size:"large",color:"error",children:"Delete Plan"})},ae=()=>{const c=A(),m=C(),u=g.GetPlanList,{data:{data:n=null}={},isLoading:P}=j([u],K);console.log("🚀 ~ file: CreatePlan.jsx:32 ~ CreatePlan ~ data",n);const l=F(),{id:q}=c,i=Number(q),p=!!i,U=R().shape({planName:r().required("Plan Name is required"),price:r().required("Price is required"),validity:r().required("Validity is required"),status:r().required("Status is required"),recommended:r().required("Recommended is required"),referralIncome:r().required("Referral Income is required"),dailyProfitFrom:r().required("From is required"),dailyProfitUpto:r().required("Upto is required"),weeklyProfitFrom:r().required("From is required"),weeklyProfitUpto:r().required("Upto is required"),monthlyProfitFrom:r().required("From is required"),monthlyProfitUpto:r().required("Upto is required")}),v=H({defaultValues:{planId:0,planName:"",price:"",validity:"",status:"",recommended:"",referralIncome:"",dailyProfitFrom:"",dailyProfitUpto:"",weeklyProfitFrom:"",weeklyProfitUpto:"",monthlyProfitFrom:"",monthlyProfitUpto:""},resolver:E(U)}),{handleSubmit:w,reset:I,formState:{isSubmitting:D}}=v;k.useEffect(()=>{if(i&&n){const o=n.find(f=>f.planId===i);o&&I(o)}},[i,n]);const L=async o=>{try{await W(o),m(b.planSetting.root),l.removeQueries([g.GetPlanList])}catch(f){console.log("🚀 ~ file: CreatePlan.jsx:78 ~ onSubmit ~ error",f)}};return t(V,{title:"Plan Setting",children:[e(M,{heading:"Plan Setting",links:[{name:"Settings"},{name:"Plan Setting",href:b.planSetting.root},{name:`${p?"Update Plan":"Create Plan"} `}],action:p&&e(X,{planId:i})}),P?e(G,{}):e(Q,{methods:v,onSubmit:w(L),children:t(z,{children:[e(T,{title:p?"Update Plan":"Create Plan"}),e(B,{}),e($,{children:t(s,{spacing:3,children:[e(a,{name:"planName",label:"Plan Name"}),e(a,{maskCurrency:!0,name:"price",label:"Price"}),e(a,{name:"validity",label:"Validity",maskNumber:!0,InputProps:{endAdornment:e("div",{children:"months"})}}),e(a,{maskPercent:!0,name:"referralIncome",label:"Referral Income"}),t(a,{select:!0,name:"status",label:"Status",children:[e(d,{value:"active",children:"Active"}),e(d,{value:"inactive",children:"Inactive"})]}),t(a,{select:!0,name:"recommended",label:"Recommended",children:[e(d,{value:"no",children:"No"}),e(d,{value:"yes",children:"Yes"})]}),t(y,{children:[e(h,{label:"Daily Income"}),t(s,{direction:"row",spacing:3,children:[e(a,{maskPercent:!0,name:"dailyProfitFrom",label:"From"}),e(a,{maskPercent:!0,name:"dailyProfitUpto",label:"Upto"})]})]}),t(y,{children:[e(h,{label:"Weekly Income"}),t(s,{direction:"row",spacing:3,children:[e(a,{maskPercent:!0,name:"weeklyProfitFrom",label:"From"}),e(a,{maskPercent:!0,name:"weeklyProfitUpto",label:"Upto"})]})]}),t(y,{children:[e(h,{label:"Monthly Income"}),t(s,{direction:"row",spacing:3,children:[e(a,{maskPercent:!0,name:"monthlyProfitFrom",label:"From"}),e(a,{maskPercent:!0,name:"monthlyProfitUpto",label:"Upto"})]})]}),e(S,{fullWidth:!0,type:"submit",loading:D,variant:"contained",color:"primary",size:"large",children:"Submit"})]})})]})})]})};export{ae as default};