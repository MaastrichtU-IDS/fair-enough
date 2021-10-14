(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{144:function(e,t,a){e.exports=a.p+"static/media/icon.72626586.png"},178:function(e,t,a){"use strict";var n=a(143),r=a.n(n),o=a(0),l=a.n(o),i=a(89),c=a(51),s=a(17),u=a(49),m=a(339),p=a(48),g=(a(205),a(25)),d=a(34),f=a(329),h=a(330),v=a(122),E=a(64),b=a(151),y=a.n(b),x=a(150),O=a.n(x),w=a(148),_=a.n(w),k=a(149),I=a.n(k),R=a(152),j=a.n(R),A=a(144),C=a.n(A),P={apiUrl:"https://api.fair-enough.semanticscience.org/rest",graphqlUrl:"https://api.fair-enough.semanticscience.org/graphql"},L=a(70);function D(){var e=Object(g.a)(),t=Object(L.useAuth)(),a=Object(d.a)((function(){return{menuButton:{color:e.palette.common.white},linkButton:{textTransform:"none",textDecoration:"none",color:"#fff"},linkLogo:{alignItems:"center",display:"flex"}}}))();return l.a.createElement(f.a,{title:"",position:"static"},l.a.createElement(h.a,{variant:"dense"},l.a.createElement(c.b,{to:"/",className:a.linkLogo},l.a.createElement(v.a,{title:"\u2611\ufe0f FAIR Enough"},l.a.createElement("img",{src:C.a,style:{height:"2em",width:"2em",marginRight:"10px"},alt:"Logo"}))),l.a.createElement("div",{className:"flexGrow"}),l.a.createElement(v.a,{title:"Access the OpenAPI documentation of the API used by this web interface"},l.a.createElement(E.a,{style:{color:"#fff"},target:"_blank",rel:"noopener noreferrer",href:P.apiUrl},l.a.createElement(_.a,{style:{marginRight:e.spacing(1)}}),"API")),l.a.createElement(v.a,{title:"Access the GraphQL API used by this web interface"},l.a.createElement(E.a,{style:{color:"#fff"},target:"_blank",rel:"noopener noreferrer",href:P.graphqlUrl},l.a.createElement(I.a,{style:{marginRight:e.spacing(1)}}),"GraphQL")),l.a.createElement(c.b,{to:"/about",className:a.linkButton},l.a.createElement(v.a,{title:"About"},l.a.createElement(E.a,{style:{color:"#fff"}},l.a.createElement(O.a,null)))),l.a.createElement(v.a,{title:"Source code"},l.a.createElement(E.a,{style:{color:"#fff"},target:"_blank",href:"https://github.com/MaastrichtU-IDS/fair-enough"},l.a.createElement(y.a,null))),l.a.createElement(v.a,{title:"Login with ORCID"},l.a.createElement(E.a,{onClick:function(){t.signIn()},style:{color:"#fff"}},l.a.createElement(j.a,null)))))}var N=a(331),S=a(332);function U(){return l.a.createElement(N.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",l.a.createElement("a",{style:{textDecoration:"none",color:"inherit"},target:"_blank",href:"https://maastrichtuniversity.nl/ids"},"Institute of Data Science at Maastricht University")," ","2020.")}function M(){var e=Object(g.a)();return l.a.createElement("footer",{style:{padding:e.spacing(2),marginTop:"auto",color:"white",backgroundColor:e.palette.primary.main}},l.a.createElement(S.a,{maxWidth:"md",style:{textAlign:"center"}},l.a.createElement(N.a,{variant:"body2"},"This website is licensed under the\xa0",l.a.createElement("a",{target:"_blank",style:{textDecoration:"none",color:"inherit"},href:"https://github.com/MaastrichtU-IDS/fair-enough/blob/main/LICENSE"},"MIT license")),l.a.createElement(U,null)))}var F=a(53),W=a.n(F),T=a(54),B=a.n(T),J=a(333),G=a(123),H=a(186),q=a(327),z=a(265),Q=a(184),Y=a(182),$=a(264),X=a(185),Z=a(336),K=a(85),V=a.n(K),ee=a(116),te=a(63),ae=a.n(te),ne=a(153),re=a.n(ne);function oe(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function le(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?oe(Object(a),!0).forEach((function(t){W()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):oe(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function ie(){var e=Object(g.a)(),t=Object(s.e)(),a=Object(L.useAuth)(),n=Object(d.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%"},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))(),r=(Object(s.f)(),l.a.useState({urlToEvaluate:"https://doi.org/10.1594/PANGAEA.908011",evaluationResults:null,adviceLogs:[],evaluationRunning:!1,evaluationsList:[],metadata_service_endpoint:"https://ws.pangaea.de/oai/provider",use_datacite:!0})),o=B()(r,2),i=o[0],c=o[1],u=l.a.useRef(i),m=l.a.useCallback((function(e){u.current=le(le({},u.current),e),c(u.current)}),[c]),p=l.a.useState(!1),f=B()(p,2),h=f[0],b=f[1],y=l.a.useState(null),x=B()(y,2),O=x[0],w=x[1];l.a.useEffect((function(){console.log(P.apiUrl),i.evaluationsList.length<1&&ae.a.get(P.apiUrl+"/evaluations",{headers:{"Content-Type":"application/json"}}).then((function(e){var t=[];e.data.map((function(e,a){e.id=e._id,e.score_percent=e.score.percent,e.bonus_percent=e.score.bonus_percent,t.push(e)})),m({evaluationsList:t})}))}),[]);var _=function(e){return/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(e)?l.a.createElement("a",{href:e,className:n.link,target:"_blank",rel:"noopener noreferrer"},e):e},k=function(e){m(W()({},e.target.id,e.target.value))},I=[{field:"@id",headerName:"ID",hide:!0},{field:"id",headerName:"Evaluation ID",flex:.5,renderCell:function(e){return l.a.createElement(E.a,{href:"/#/evaluation/"+e.value,variant:"contained",className:n.submitButton,startIcon:l.a.createElement(V.a,null),color:"primary"},"Evaluation")}},{field:"resource_uri",headerName:"Resource URI",flex:1,renderCell:function(e){return l.a.createElement(l.a.Fragment,null,_(e.value))}},{field:"score_percent",headerName:"FAIR compliant",flex:.5,renderCell:function(e){return l.a.createElement(l.a.Fragment,null,e.value,"%")}},{field:"bonus_percent",headerName:"FAIR Role Model",flex:.5,renderCell:function(e){return l.a.createElement(l.a.Fragment,null,e.value,"%")}}];return l.a.createElement(S.a,{className:"mainContainer"},l.a.createElement(N.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},"\u2696\ufe0f Evaluate how FAIR is a resource \ud83d\udd17"),a&&a.userData&&l.a.createElement("div",null,l.a.createElement("strong",null,"Logged in! \ud83c\udf89"),l.a.createElement("br",null),l.a.createElement("button",{onClick:function(){return a.signOut()}},"Log out!")),l.a.createElement("form",{onSubmit:function(e){e.preventDefault(),function(e){m({evaluationRunning:!0,evaluationResults:null}),console.log("Starting evaluation of "+e+" with API "+P.apiUrl);var a=JSON.stringify({resource_uri:e,collection:"fair-metrics"});ae.a.post(P.apiUrl+"/evaluations",a,{headers:{"Content-Type":"application/json"}}).then((function(e){re()(ae.a,{retries:30,retryDelay:function(e){return console.log("Waiting for evaluation to finish: "+e),3e3*e},retryCondition:function(e){return 404===e.response.status}});var a=e.data._id;ae.a.get(P.apiUrl+"/evaluations/"+a).then((function(e){t.push("/evaluation/"+a)}))}))}(i.urlToEvaluate)}},l.a.createElement(J.a,{display:"flex",style:{margin:e.spacing(0,6)}},l.a.createElement(G.a,{id:"urlToEvaluate",label:"URL of the resource to evaluate",placeholder:"URL of the resource to evaluate",value:i.urlToEvaluate,className:n.fullWidth,variant:"outlined",onChange:k,InputProps:{className:n.formInput}}),l.a.createElement(Q.a,{open:h,anchorEl:O},l.a.createElement(Y.a,{onClickAway:function(){b(!1),w(O?null:O)}},l.a.createElement(H.a,{elevation:4,className:n.paperPadding,style:{textAlign:"center"}},l.a.createElement(q.a,{container:!0,spacing:1},l.a.createElement(q.a,{item:!0,xs:12},l.a.createElement(v.a,{title:"By default, the FAIR Enough evaluator uses content negociation based on the DOI URL to retrieve DataCite JSON metadata. If you uncheck this option F-UJI will try to use the landing page URL instead."},l.a.createElement($.a,{control:l.a.createElement(X.a,{checked:i.use_datacite,onChange:function(e){m(W()({},e.target.name,e.target.checked))},name:"use_datacite",color:"primary"}),label:"Use DataCite"}))),l.a.createElement(q.a,{item:!0,xs:12},l.a.createElement(v.a,{title:"OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) endpoint to use when searching for metadata about this resource."},l.a.createElement(G.a,{id:"metadata_service_endpoint",label:"OAI-PMH metadata endpoint URL",placeholder:"OAI-PMH metadata endpoint URL",value:i.metadata_service_endpoint,className:n.fullWidth,variant:"outlined",onChange:k,InputProps:{className:n.formInput}})),l.a.createElement(Z.a,null,"List of OAI-PMH providers: ",_("https://www.openarchives.org/Register/BrowseSites")))))))),l.a.createElement(E.a,{type:"submit",variant:"contained",style:{margin:e.spacing(2)},startIcon:l.a.createElement(V.a,null),color:"secondary"},"Start the FAIR evaluation")),i.evaluationRunning&&l.a.createElement(z.a,{style:{margin:e.spacing(5,0)}}),i.evaluationsList.length>0&&l.a.createElement("div",{style:{height:600,width:"100%"}},console.log(i.evaluationsList),l.a.createElement(ee.a,{columns:I,rows:i.evaluationsList,components:{Toolbar:ee.b},style:{backgroundColor:"#fff"}})))}a(328);var ce=a(38),se=a(325),ue=a(337),me=a(338),pe=a(117),ge=a.n(pe),de=a(157),fe=a.n(de);a(155),a(156);function he(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function ve(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?he(Object(a),!0).forEach((function(t){W()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):he(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function Ee(){var e=Object(g.a)(),t=Object(d.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%"},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))(e),a=Object(s.g)(),n=(Object(s.f)(),l.a.useState({evaluationResults:null,adviceLogs:[],logLevel:"all",resourceMetadata:null})),r=B()(n,2),o=r[0],i=r[1],c=l.a.useRef(o),u=l.a.useCallback((function(e){c.current=ve(ve({},c.current),e),i(c.current)}),[i]);l.a.useEffect((function(){u({apiUrl:"https://api.fair-enough.semanticscience.org/rest"}),ae.a.get(P.apiUrl+"/evaluations/"+a.id,{headers:{"Content-Type":"application/json"}}).then((function(e){var t=e.data;u({evaluationResults:t});var a=[];t.results.map((function(e,t){e.logs.map((function(e,t){(e.startsWith("\u274c")||e.startsWith("\u2139\ufe0f"))&&a.push(e)}))})),u({adviceLogs:a});var n={};Object.keys(t.data).map((function(e,a){["resource_title","resource_description","date_created","accessRights","license"].includes(e)&&(n[e]=t.data[e])})),u({resourceMetadata:n})}))}),[]);var m={f:"#b3e5fc",a:"#ffe0b2",i:"#c8e6c9",r:"#d1c4e9"},p=function(e){return/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(e)?l.a.createElement("a",{href:e,className:t.link,target:"_blank",rel:"noopener noreferrer"},e):e},f=function(e){return"all"==o.logLevel||("warning"==o.logLevel?e.startsWith("\u274c")||e.startsWith("\u26a0\ufe0f")||e.startsWith("\u2139\ufe0f"):"error"==o.logLevel?e.startsWith("\u274c")||e.startsWith("\u2139\ufe0f"):void 0)},h=function(e){var t=e.substring(0,1).toLowerCase(),a=o.evaluationResults.results.filter((function(e){var a=!1;return e.fair_type.startsWith(t)&&e.logs.map((function(e,t){1==f(e)&&(a=!0)})),a}));return l.a.createElement(l.a.Fragment,null,a.length>0&&l.a.createElement(se.a,{defaultExpanded:!0,style:{backgroundColor:m[t]}},l.a.createElement(ue.a,{expandIcon:l.a.createElement(ge.a,null)},l.a.createElement(N.a,{variant:"h4"},{f:"\ud83d\udd0d\ufe0f",a:"\ud83d\udcec\ufe0f",i:"\u2699\ufe0f",r:"\u267b\ufe0f"}[t]," ",e)),l.a.createElement(me.a,null,l.a.createElement(q.a,{container:!0,spacing:1,style:{textAlign:"left"}},a.map((function(e,t){return l.a.createElement(q.a,{item:!0,xs:12,md:12,key:t},l.a.createElement(se.a,{defaultExpanded:!0},l.a.createElement(ue.a,{expandIcon:l.a.createElement(ge.a,null)},l.a.createElement(N.a,{variant:"h6"},e.title)),l.a.createElement(me.a,null,l.a.createElement(q.a,{container:!0,spacing:1,style:{textAlign:"left"}},l.a.createElement(q.a,{item:!0,xs:12,md:12},l.a.createElement(l.a.Fragment,null,l.a.createElement(N.a,{variant:"body1"},e.description),l.a.createElement(N.a,{variant:"body1"},"Metric: ",e.fair_type.toUpperCase(),e.metric_id),l.a.createElement(N.a,{variant:"body1"},"Assessment URL: ",p(e.file_url)),l.a.createElement(N.a,{variant:"body1"},"FAIR score: ",e.score,"/",e.max_score),e.bonus_score>0||e.max_bonus>0&&l.a.createElement(N.a,{variant:"body1"},"Bonus score: ",e.bonus_score,"/",e.max_bonus))),l.a.createElement(q.a,{item:!0,xs:12,md:12},l.a.createElement("pre",null,l.a.createElement("code",{className:"language-pythonlogging",style:{whiteSpace:"pre-wrap",overflowX:"auto"}},e.logs.filter((function(e){return f(e)})).join("\n"))))))))}))))))};return l.a.createElement(S.a,{className:"mainContainer"},o.evaluationResults&&l.a.createElement(l.a.Fragment,null,l.a.createElement(N.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},o.evaluationResults.resource_uri),o.resourceMetadata&&l.a.createElement(l.a.Fragment,null,l.a.createElement(H.a,{className:t.paperPadding,style:{textAlign:"left"}},o.resourceMetadata.resource_title&&l.a.createElement(N.a,{variant:"h5",style:{marginBottom:e.spacing(1)}},"title: ",o.resourceMetadata.resource_title),o.resourceMetadata.resource_description&&l.a.createElement(N.a,{variant:"body1",style:{marginBottom:e.spacing(1)}},"summary: ",o.resourceMetadata.resource_description),Object.keys(o.resourceMetadata).map((function(t,a){if(!["resource_title","resource_description"].includes(t))return l.a.createElement(N.a,{variant:"body1",style:{marginBottom:e.spacing(1)},key:a},t,": ",p(o.resourceMetadata[t]))})))),l.a.createElement(q.a,{container:!0,spacing:1},l.a.createElement(q.a,{item:!0,xs:3,md:3}),l.a.createElement(q.a,{item:!0,xs:3,md:3},l.a.createElement(N.a,{variant:"h5",style:{margin:e.spacing(3,0)}},"FAIR score: ",o.evaluationResults.score.total_score,"/",o.evaluationResults.score.total_score_max),l.a.createElement(J.a,{sx:{position:"relative",display:"inline-flex"}},l.a.createElement(z.a,{variant:"determinate",value:o.evaluationResults.score.percent}),l.a.createElement(J.a,{sx:{top:0,left:0,bottom:0,right:0,position:"absolute",display:"flex",alignItems:"center",justifyContent:"center"}},l.a.createElement(N.a,{variant:"caption",component:"div"},o.evaluationResults.score.percent+"%",l.a.createElement("br",null))))),l.a.createElement(q.a,{item:!0,xs:3,md:3},l.a.createElement(N.a,{variant:"h5",style:{margin:e.spacing(3,0)}},"Bonus score: ",o.evaluationResults.score.total_bonus,"/",o.evaluationResults.score.total_bonus_max),l.a.createElement(J.a,{sx:{position:"relative",display:"inline-flex"}},l.a.createElement(z.a,{variant:"determinate",value:o.evaluationResults.score.bonus_percent}),l.a.createElement(J.a,{sx:{top:0,left:0,bottom:0,right:0,position:"absolute",display:"flex",alignItems:"center",justifyContent:"center"}},l.a.createElement(N.a,{variant:"caption",component:"div"},o.evaluationResults.score.bonus_percent+"%",l.a.createElement("br",null)))))),l.a.createElement(G.a,{select:!0,value:o.logLevel,label:"Log level",id:"logLevel",onChange:function(e){u({logLevel:e.target.value})},variant:"outlined"},l.a.createElement(ce.a,{value:"all"},"All logs"),l.a.createElement(ce.a,{value:"warning"},"Warnings and errors"),l.a.createElement(ce.a,{value:"error"},"Errors only")),h("Findable"),h("Accessible"),h("Interoperable"),h("Reusable"),l.a.createElement(E.a,{variant:"contained",style:{textTransform:"none",margin:e.spacing(2,2)},onClick:function(e){e.preventDefault();var t=document.createElement("a");t.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(o.evaluationResults,null,4))),t.setAttribute("download","evaluation.json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},startIcon:l.a.createElement(fe.a,null)},"Download the evaluation results JSON file")))}var be=Object(d.a)((function(e){return{link:{textDecoration:"none",color:e.palette.primary.main,"&:hover":{color:e.palette.secondary.main,textDecoration:"none"}},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)},paperTitle:{fontWeight:300,marginBottom:e.spacing(1)},mainText:{textAlign:"center",marginBottom:"20px"}}}));function ye(){var e=be(),t=l.a.useState({open:!1,dialogOpen:!1,project_license:"",language_autocomplete:[]}),a=B()(t,2);a[0],a[1];return l.a.createElement(S.a,{className:"mainContainer"},l.a.createElement(N.a,{variant:"body1",className:e.mainText},"A web interface to evaluate how much online resources follow to the ",l.a.createElement("a",{href:"https://www.go-fair.org/fair-principles",className:e.link,target:"_blank",rel:"noopener noreferrer"},"FAIR principles \u267b\ufe0f")," (Findable, Accessible, Interoperable, Reusable)."),l.a.createElement(N.a,{variant:"body1",className:e.mainText},"Developed and hosted by the ",l.a.createElement("a",{href:"https://www.maastrichtuniversity.nl/research/institute-data-science",className:e.link,target:"_blank",rel:"noopener noreferrer"},"Institute of Data Science")," at Maastricht University."))}var xe={onSignIn:function(e){return r.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:alert("You just signed in, congratz! Check out the console!"),console.log(e),window.location.hash="";case 3:case"end":return t.stop()}}),null,null,null,Promise)},authority:"https://orcid.org",clientId:"APP-TEANCMSUOPYZOGJ3",redirectUri:"http://localhost/rest/auth",autoSignIn:!1},Oe=Object(u.a)({palette:{primary:{light:"#63a4ff",main:p.a[700],dark:"#004ba0"},secondary:{light:"#4caf50",main:"#087f23",dark:"#00600f"}},typography:{fontFamily:'"Open Sans", "Roboto", "Arial"',fontWeightLight:300,fontWeightRegular:400,fontWeightMedium:500,fontSize:11}});t.a=function(){return l.a.createElement(m.a,{theme:Oe},l.a.createElement(L.AuthProvider,xe,l.a.createElement(c.a,null,l.a.createElement(i.a,{style:{height:"100%",backgroundColor:"#eceff1"}},l.a.createElement(D,null),l.a.createElement(s.a,{exact:!0,path:"/evaluation/:id",component:Ee}),l.a.createElement(s.a,{path:"/about",component:ye}),l.a.createElement(s.a,{exact:!0,path:"/",component:ie}),l.a.createElement(M,null)))))}},201:function(e,t,a){a(202),e.exports=a(252)},202:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/expo-service-worker.js",{scope:"/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},205:function(e,t,a){var n=a(206),r=a(207);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var o={insert:"head",singleton:!1};n(r,o);e.exports=r.locals||{}},207:function(e,t,a){(t=a(208)(!1)).push([e.i,"@import url(https://fonts.googleapis.com/css?family=Open+Sans);"]),t.push([e.i,'.flexGrow {\n  flex-grow: 1; \n}\n\n.mainContainer {\n  margin-top: 30px;\n  margin-bottom: 20px;\n  text-align: center;\n}\n\npre {\n  border: 2px solid grey;\n  padding: 1em;\n}\n\npre, code {\n  font-family: monospace, monospace;\n  border-radius: 6px;\n  /* padding: 2px; */\n  color: #adbac7;\n  background: #22272e;\n  /* padding: 0.5em; */\n  /* padding: 5px; */\n  /* color: white;\n  background-color: #757575; */\n  /* background-color: #78909c; */\n}\n  \n/* @import url("https://fonts.googleapis.com/icon?family=Material+Icons");\nbody {\n  margin: 0;\n  padding: 0;\n  text-align: center; } */\n',""]),e.exports=t}},[[201,1,2]]]);
//# sourceMappingURL=app.8cdaba79.chunk.js.map