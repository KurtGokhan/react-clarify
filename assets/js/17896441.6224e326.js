"use strict";(self.webpackChunkreact_on_website=self.webpackChunkreact_on_website||[]).push([[401],{7628:(s,e,n)=>{n.d(e,{A:()=>_});var r=n(1750),o=n(3696);const a={console:"console_KCSb",rows:"rows_AE9D",row:"row_QIV4",appear:"appear_wGtR",header:"header_j_PR"};var l=n(2540);function c(s){let{override:e="info"}=s;const[n,r]=(0,o.useState)([]),c=(0,o.useRef)(null);return(0,o.useLayoutEffect)((()=>{if(!e)return;const s=window.console[e];return window.console[e]=function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];s(...n),r((s=>[...s,`${n.join(", ")}`])),setTimeout((()=>{c.current?.scrollTo(0,c.current.scrollHeight)}),100)},()=>{window.console[e]=s}}),[e]),n.length?(0,l.jsxs)("div",{className:a.console,children:[(0,l.jsx)("div",{className:a.header,children:"Console"}),(0,l.jsx)("div",{className:a.rows,ref:c,children:n.map(((s,e)=>(0,l.jsx)("div",{className:a.row,children:s},e)))})]}):null}const i="browserWindow_jiSI",t="browserWindowHeader_ITW5",d="buttons_hZyy",w="browserWindowAddressBar_iwHb",h="dot_Oyi3",u="browserWindowMenuIcon_KLvG",m="bar_Liox",b="browserWindowBody_T8Vh";var j=n(6786),x=n(9486);const _={...j.A,BrowserWindow:function(s){let{children:e,minHeight:n,url:o="http://localhost:3000",style:a,bodyStyle:j,theme:x="light"}=s;return(0,l.jsxs)("div",{className:(0,r.A)(i,"sb-unstyled"),style:{...a,minHeight:n},"data-theme":x,children:[(0,l.jsxs)("div",{className:t,children:[(0,l.jsxs)("div",{className:d,children:[(0,l.jsx)("span",{className:h,style:{background:"#f25f58"}}),(0,l.jsx)("span",{className:h,style:{background:"#fbbe3c"}}),(0,l.jsx)("span",{className:h,style:{background:"#58cb42"}})]}),(0,l.jsx)("div",{className:w,children:o}),(0,l.jsx)("div",{className:u,children:(0,l.jsxs)("div",{children:[(0,l.jsx)("span",{className:m}),(0,l.jsx)("span",{className:m}),(0,l.jsx)("span",{className:m})]})})]}),(0,l.jsx)("div",{className:b,style:j,children:e}),(0,l.jsx)(c,{})]})},Console:c,CodeBlock:x.A}}}]);