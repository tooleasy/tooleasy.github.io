import{a0 as T,bp as g,a1 as I,d as S,aI as N,a3 as A,r as D,j as v,a7 as l,v as a,A as p,a8 as V,x as k,a9 as o,aa as e,ao as n,aS as b,aq as $,t as i,ap as h,B as C,y as f,af as q,z,bq as F,ac as M,ad as P,at as _}from"./BJ4U74QN.js";import{F as j}from"./VBWnuYbd.js";const O=["light","dark"],G=T({title:{type:String,default:""},description:{type:String,default:""},type:{type:String,values:j(g),default:"info"},closable:{type:Boolean,default:!0},closeText:{type:String,default:""},showIcon:Boolean,center:Boolean,effect:{type:String,values:O,default:"light"}}),H={close:r=>r instanceof MouseEvent},J=S({name:"ElAlert"}),K=S({...J,props:G,emits:H,setup(r,{emit:B}){const d=r,{Close:E}=F,w=N(),t=A("alert"),u=D(!0),m=v(()=>g[d.type]),c=v(()=>!!(d.description||w.default)),y=s=>{u.value=!1,B("close",s)};return(s,Q)=>(a(),l(P,{name:e(t).b("fade"),persisted:""},{default:p(()=>[V(k("div",{class:o([e(t).b(),e(t).m(s.type),e(t).is("center",s.center),e(t).is(s.effect)]),role:"alert"},[s.showIcon&&e(m)?(a(),l(e(b),{key:0,class:o([e(t).e("icon"),{[e(t).is("big")]:e(c)}])},{default:p(()=>[(a(),l($(e(m))))]),_:1},8,["class"])):n("v-if",!0),k("div",{class:o(e(t).e("content"))},[s.title||s.$slots.title?(a(),i("span",{key:0,class:o([e(t).e("title"),{"with-description":e(c)}])},[h(s.$slots,"title",{},()=>[C(f(s.title),1)])],2)):n("v-if",!0),e(c)?(a(),i("p",{key:1,class:o(e(t).e("description"))},[h(s.$slots,"default",{},()=>[C(f(s.description),1)])],2)):n("v-if",!0),s.closable?(a(),i(q,{key:2},[s.closeText?(a(),i("div",{key:0,class:o([e(t).e("close-btn"),e(t).is("customed")]),onClick:y},f(s.closeText),3)):(a(),l(e(b),{key:1,class:o(e(t).e("close-btn")),onClick:y},{default:p(()=>[z(e(E))]),_:1},8,["class"]))],64)):n("v-if",!0)],2)],2),[[M,u.value]])]),_:3},8,["name"]))}});var L=I(K,[["__file","alert.vue"]]);const W=_(L);export{W as E};
