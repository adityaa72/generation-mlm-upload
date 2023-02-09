import{ct as d,cu as g,g as h,B as s,h as c,aA as m,av as y,a as t,P as x,j as r,I as k,T as i,c as u,bd as b,S as L,d as v,i as I,cv as w,ch as C}from"./index-a3673b34.js";import{r as R}from"./warn-once-32b7c465.js";import{H as S}from"./HeaderBreadcrumbs-006bc24f.js";const T="/assets/Referral-13f028f2.png",j=e=>navigator.clipboard.writeText(e),A=d(g)(({theme:e})=>({backgroundColor:e.palette.mode==="light"?e.palette.grey[600]:e.palette.grey[800]})),B=d(h)(({theme:e})=>({marginTop:-120,boxShadow:"none",padding:e.spacing(16,5,5,5),color:e.palette.common.white})),z=d(s)(({theme:e})=>({width:100,height:100,borderRadius:999,display:"flex",justifyContent:"center",alignItems:"center",fontSize:40,padding:e.spacing(1),background:c(e.palette.primary.main,.1)})),l=({icon:e,title:a,description:n})=>t(u,{xs:12,md:4,sx:{display:"flex",flexDirection:"column",gap:2},textAlign:"center",item:!0,children:[r(z,{sx:{margin:"auto"},children:r(I,{color:"primary.main",icon:e})}),r(i,{variant:"subtitle1",color:"text.primary",children:a}),r(i,{color:"text.secondary",children:n})]}),D=()=>{const{appName:e}=m(),{user:{userId:a}}=y(),[n,p]=R.useState(!1),f=w(`/register?referral_id=${a}&placement_id=${a}`);return t(x,{title:"Referral Link",children:[r(S,{heading:"Referral Link",links:[{name:"Dashboard"},{name:"Referral Link"}]}),t(s,{sx:{mb:2},children:[r(k,{visibleByDefault:!0,disabledEffect:!0,src:T,isLocal:!0,sx:{left:40,zIndex:9,width:140,position:"relative",filter:"drop-shadow(0 12px 24px rgba(0,0,0,0.24))"}}),t(B,{children:[r(i,{color:"text.primary",mb:1,textAlign:"center",variant:"h4",children:"Invite friends and earn"}),t(i,{color:"text.secondary",textAlign:"center",children:["Invite your friend to ",e,", if they sign up, you and your friend will get 30 days free trial"]}),t(s,{sx:{py:4},children:[t(u,{spacing:3,container:!0,children:[r(l,{icon:"ri:share-fill",title:"Send Invitation 🤟🏻",description:"Send your referral link to your friend"}),r(l,{icon:"mdi:register",title:"Registration 👩🏻‍💻",description:"Let them register to our services"}),r(l,{icon:"zondicons:badge",title:"Purchase Package 🎉",description:"You will get referral income"})]}),r(b,{sx:{pt:4}})]}),r(i,{color:"text.primary",variant:"h5",children:"Share the referral link"}),t(L,{sx:{my:3},direction:"row",spacing:1,alignItems:"center",justifyContent:"space-between",children:[r(A,{size:"small",placeholder:"Referral Link",sx:{width:1,color:"common.white",fontWeight:"fontWeightMedium",bgcolor:o=>c(o.palette.common.black,.16),"& input::placeholder":{color:o=>c(o.palette.common.white,.48)},"& fieldset":{display:"none"}},value:f}),r(v,{onClick:()=>{p(!0),C.success("Referral link copied to clipboard"),j(f),setTimeout(()=>{p(!1)},1e3)},variant:"contained",children:n?"Copied":"Copy"})]})]})]})]})},W=D;export{W as default};
