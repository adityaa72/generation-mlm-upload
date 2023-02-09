import{c as F,a as o,d as E,t as P,w as k,x as q,e,z as B,j as t,C as H,l as j,I as v,bc as A,h as L,S as d,R as l,p as V,B as D,L as R,o as w,cR as z,cS as I,P as G}from"./index-7ce534fb.js";import{r as c}from"./warn-once-223a138d.js";import{H as K}from"./HeaderBreadcrumbs-7dcdcbac.js";import{E as M}from"./Editor-28a84faa.js";import{F as U}from"./FormLabel-b1fd6c0d.js";import{u as $}from"./useFormEdit-003d10dc.js";import{C as O}from"./CardHeader-51eb309e.js";import{C as Q}from"./CardContent-d5c47145.js";const J=i=>e(l,{sx:{"& fieldset":{display:"none"}},type:"hidden",...i}),N=()=>{const{isEditing:i,startEditing:m,stopEditing:a}=$(),u={title:"",description:""},p=F().shape({title:o().required("Title is required"),description:o().required("Description is required")}),r=E({defaultValues:u,resolver:w(p),mode:"all"}),{getValues:g,reset:C,setValue:h,handleSubmit:f,formState:{isSubmitting:b}}=r,y=c.useMemo(()=>({}),[]),x=P.GetTermsConditionsPage,{isLoading:T,data:{data:n=y}={}}=k([x],I);c.useEffect(()=>{!q(n)&&C(n)},[n]);const S=s=>{h("description",s)};return T?e(B,{}):t(H,{children:[e(O,{sx:{background:"background.neutral"},title:"Terms and Conditions Page",action:i?void 0:e(j,{onClick:m,children:e(v,{icon:"mdi:lead-pencil"})})}),e(A,{}),e(Q,{children:e(L,{methods:r,onSubmit:f(async s=>{try{await z(s),a()}catch{}}),children:t(d,{spacing:3,children:[e(l,{disabled:!i,name:"title",type:"text",label:"Title"}),t(V,{children:[e(U,{label:"Description"}),e(M,{disabled:!i,onChangeValue:S,initialValue:g().description}),e(J,{name:"description",type:"hidden"})]}),i&&t(d,{direction:"row",justifyContent:"flex-end",spacing:2,children:[e(D,{size:"large",onClick:a,children:"Cancel"}),e(R,{size:"large",type:"submit",variant:"contained",loading:b,children:"Update"})]})]})})})]})},W=N;function re(){return t(G,{title:"Terms And Conditions",children:[e(K,{heading:"Terms And Conditions",links:[{name:"Manage Section"},{name:"Terms And Conditions"}]}),e(W,{})]})}export{re as default};