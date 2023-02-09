import{av as U,aS as E,y as Q,z as _,D as K,N,l as n,a,F as X,j as e,d as I,aT as Y,aU as Z,H as J,aV as ee,aW as ae,aX as ne,aY as re,B as l,T as r,aZ as te,K as ie,a_ as oe,q as G,g as le,S as b,h as se,i as R,k as ce,C as de,M as he,m as S,v as $,c as L,R as T,u as ue,P as pe,A as be,L as ge,a$ as me}from"./index-a3673b34.js";import{r as fe}from"./warn-once-32b7c465.js";import{H as ye}from"./HeaderBreadcrumbs-006bc24f.js";import{C as ve}from"./CardContent-73270362.js";const xe=({planId:t,dailyProfitFrom:i,dailyProfitUpto:h,weeklyProfitFrom:g,weeklyProfitUpto:m,monthlyProfitFrom:f,monthlyProfitUpto:y,planName:v})=>{var D;const{updatePlan:x,user:d}=U(),s=(D=d==null?void 0:d.plan)==null?void 0:D.planId,o=!!s,P=t===s,c=E(),[B,k]=fe.useState(!1),C=()=>k(!1),j=()=>k(!0),F={incomeType:""},q=Q().shape({incomeType:_().required("Income Type is required")}),A=K({defaultValues:F,resolver:N(q)}),{handleSubmit:H,formState:{isSubmitting:M}}=A,V=async u=>{try{const{data:{plan:w}}=await oe(t,u);x(w),c.invalidateQueries([G.GetPlanList]),C()}catch(w){console.log("🚀 ~ file: PlanUpgrade.jsx:42 ~ onSubmit ~ error",w)}},W=`${n(i)} - ${n(h)}`,z=`${n(g)} - ${n(m)}`,O=`${n(f)} - ${n(y)}`;return a(X,{children:[e(I,{disabled:P,onClick:j,size:"large",fullWidth:!0,variant:"contained",children:P?"Activated":o?"Upgrade Plan":"Activate Plan"}),a(Y,{open:B,onClose:C,children:[a(Z,{children:["Upgrade Plan To ",v]}),a(J,{methods:A,onSubmit:H(V),children:[e(ee,{children:a(ae,{sx:{width:1},children:[e(ne,{sx:{mb:2},children:"Choose your profit income type"}),e(re,{name:"incomeType",options:["daily","weekly","monthly"],getOptionLabel:[a(l,{children:[e(r,{variant:"subtitle1",children:"Daily Profit"}),e(r,{variant:"body2",sx:{color:"text.secondary"},children:W})]}),a(l,{children:[e(r,{variant:"subtitle1",children:"Weekly Profit"}),e(r,{variant:"body2",sx:{color:"text.secondary"},children:z})]}),a(l,{children:[e(r,{variant:"subtitle1",children:"Monthly Profit"}),e(r,{variant:"body2",sx:{color:"text.secondary"},children:O})]})],row:!1,labelProps:{sx:{width:1,p:1,m:0,borderRadius:1,"&:hover":{background:u=>u.palette.mode==="dark"?u.palette.grey[900]:u.palette.grey[200]},"& .MuiFormControlLabel-label":{flexGrow:1}}}})]})}),a(te,{children:[e(I,{onClick:C,color:"primary",children:"Cancel"}),e(ie,{loading:M,type:"submit",color:"primary",children:"Activate"})]})]})]})]})},Pe=({planId:t,price:i,referralIncome:h,planName:g,dailyProfitFrom:m,dailyProfitUpto:f,weeklyProfitFrom:y,weeklyProfitUpto:v,monthlyProfitFrom:x,monthlyProfitUpto:d,validity:s,recommended:o})=>{o=o==="yes";const P=!1;return e(le,{sx:{color:o?"#fff":void 0,boxShadow:0,...o?{background:c=>c.palette.mode==="light"?"#374bff":"linear-gradient(180deg,#374bff 5.21%,rgba(55,75,255,.42) 92.19%)",border:"none",boxShadow:"-24px 30px 121px 30px rgba(55,75,255,.29)"}:{background:c=>c.palette.mode==="light"?void 0:"rgb(18,18,18)"}},children:e(ve,{children:a(b,{sx:{p:1},spacing:3,children:[a(b,{direction:"row",alignItems:"center",gap:1,children:[e(r,{color:o?"#fff":void 0,variant:"h4",children:g}),o&&e(l,{sx:{display:"inline"},children:a(l,{sx:{display:"flex",justifyContent:"center",alignItems:"center",px:1,py:.5,borderRadius:.6,fontSize:14,background:c=>se(c.palette.grey[100],.1),fontWeight:500},children:[e(R,{sx:{mr:.5,fontSize:18},icon:"humbleicons:crown"})," Popular"]})})]}),e(r,{color:o?"#fff":void 0,variant:"h2",children:ce(i)}),e(l,{children:a(b,{spacing:4,children:[e(p,{label:"Referral Income",value:n(h)}),e(p,{label:"Daily Profit",value:`${n(m)} - ${n(f)}`}),e(p,{label:"Weekly Profit",value:`${n(y)} - ${n(v)}`}),e(p,{label:"Monthly Profit",value:`${n(x)} - ${n(d)}`}),e(p,{label:"Validity",value:`${s===0?"unlimited":`${s===1?`${s} month`:`${s} months`}`} `})]})}),e(l,{children:e(l,{sx:{mt:2},children:e(xe,{isActive:P,dailyProfitFrom:m,dailyProfitUpto:f,weeklyProfitFrom:y,weeklyProfitUpto:v,monthlyProfitFrom:x,monthlyProfitUpto:d,planName:g,planId:t})})})]})})})};function p({label:t,value:i}){return a(b,{direction:"row",justifyContent:"space-between",alignItems:"center",children:[a(b,{direction:"row",gap:1,alignItems:"center",children:[e(R,{icon:"eva:checkmark-fill",sx:{color:"primary.main",width:20,height:20}}),e(r,{variant:"subtitle1",children:t})]}),e(r,{variant:"subtitle1",children:i})]})}const Ce=({plans:t})=>a(de,{disableGutters:!0,component:he,children:[a(l,{sx:{mb:6,textAlign:"center"},children:[e(S.div,{variants:$().inDown,children:a(r,{variant:"h2",sx:{mb:3},children:["Choose the"," ",e(r,{variant:"h2",component:"span",sx:{color:"primary.main",borderBottomColor:"primary.main",borderBottom:"3px solid"},children:"right plan"})," ","for your business"]})}),e(S.div,{variants:$().inDown,children:e(r,{sx:{color:"text.secondary"},children:"Choose the perfect plan for your needs. Always flexible to grow"})})]}),e(L,{container:!0,rowSpacing:T,columnSpacing:T,children:t.map((i,h)=>e(L,{item:!0,xs:12,md:4,children:e(S.div,{variants:$().inDown,children:e(Pe,{...i,index:h})})},i.planId))})]}),we=()=>{const{data:{data:t=[]}={},isLoading:i}=ue([G.GetPlanList],me);return a(pe,{title:"Plan",children:[e(ye,{heading:"Plan",links:[{name:"Dashboard",href:be.dashboard},{name:"Plan"}]}),i?e(ge,{}):e(Ce,{plans:t})]})},De=we;export{De as default};