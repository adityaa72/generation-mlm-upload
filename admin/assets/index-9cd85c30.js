import{s as C,c as F,a as s,d as x,t as v,w as q,j as t,P as B,e,C as E,F as I,l as j,I as k,f as w,bc as P,h as R,S as c,R as l,p as D,bk as L,B as Q,L as T,o as z,cx as G,cy as K}from"./index-7ce534fb.js";import{r as M}from"./warn-once-223a138d.js";import{F as V}from"./FormLabel-b1fd6c0d.js";import{H as $}from"./HeaderBreadcrumbs-7dcdcbac.js";import{u as O}from"./useFormEdit-003d10dc.js";import{C as U}from"./CardHeader-51eb309e.js";import{C as A}from"./CardContent-d5c47145.js";const J=()=>{const d=C(),{isEditing:i,startEditing:m,stopEditing:a}=O(),u={title:"",description:"",image:""},p=F().shape({title:s().required("Title is required"),description:s().required("Description is required")}),o=x({defaultValues:u,resolver:z(p)}),{reset:g,setValue:h,handleSubmit:f,formState:{isSubmitting:S}}=o,n=v.GetHeroSection,{data:{data:r}={}}=q([n],K),b=async H=>{try{await G(H),a(),d.removeQueries([n])}catch(y){console.log("🚀 ~ file: OurMission.jsx:29 ~ onSubmit ~ error",y)}};return M.useEffect(()=>{r&&g(r)},[r]),t(B,{title:"Hero Section",children:[e($,{heading:"Hero Section",links:[{name:"Manage Section"},{name:"Hero Section"}]}),t(E,{children:[e(U,{title:"Hero Section",action:e(I,{children:!i&&e(j,{onClick:m,children:e(k,{icon:w.pencil})})})}),e(P,{}),e(A,{children:e(R,{methods:o,onSubmit:f(b),children:t(c,{spacing:3,children:[e(l,{disabled:!i,name:"title",label:"Title",placeholder:"Helping {millions} to grow better"}),e(l,{multiline:!0,minRows:4,disabled:!i,name:"description",label:"Description"}),t(D,{children:[e(V,{label:"Image"}),e(L,{disabled:!i,setValue:h,name:"image"})]}),i&&t(c,{direction:"row",justifyContent:"flex-end",spacing:2,children:[e(Q,{onClick:a,size:"large",variant:"outlined",children:"Cancel"}),e(T,{size:"large",type:"submit",variant:"contained",loading:S,children:"Save Changes"})]})]})})})]})]})},ie=J;export{ie as default};