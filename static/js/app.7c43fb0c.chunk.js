(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{145:function(e,t,a){e.exports=a.p+"static/media/icon.72626586.png"},180:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(90),l=a(46),i=a(18),c=a(56),s=a(345),u=a(55),m=(a(208),a(26)),p=a(40),d=a(334),g=a(335),f=a(126),h=a(68),v=a(153),E=a.n(v),b=a(152),y=a.n(b),O=a(150),x=a.n(O),w=a(151),I=a.n(w),k=a(145),A=a.n(k),_={apiUrl:"https://api.fair-enough.semanticscience.org",restUrl:"https://api.fair-enough.semanticscience.org/rest",docsUrl:"https://api.fair-enough.semanticscience.org/docs",graphqlUrl:"https://api.fair-enough.semanticscience.org/graphql",OauthRedirectUri:"http://localhost:19006/collection/create"},j=a(147),C=a.n(j);function R(){var e=Object(m.a)(),t=Object(p.a)((function(){return{menuButton:{color:e.palette.common.white},linkButton:{textTransform:"none",textDecoration:"none",color:"#fff"},linkLogo:{alignItems:"center",display:"flex"}}}))();return r.a.createElement(d.a,{title:"",position:"static"},r.a.createElement(g.a,{variant:"dense"},r.a.createElement(l.b,{to:"/",className:t.linkLogo},r.a.createElement(f.a,{title:"\u2611\ufe0f FAIR Enough"},r.a.createElement("img",{src:A.a,style:{height:"2em",width:"2em",marginRight:"10px"},alt:"Logo"}))),r.a.createElement(l.b,{to:"/collections",className:t.linkButton},r.a.createElement(f.a,{title:"Browse existing Collections of assessments"},r.a.createElement(h.a,{style:{color:"#fff"}},"Collections"))),r.a.createElement("div",{className:"flexGrow"}),r.a.createElement(f.a,{title:"Access the OpenAPI documentation of the API used by this web interface"},r.a.createElement(h.a,{style:{color:"#fff"},target:"_blank",rel:"noopener noreferrer",href:_.docsUrl},r.a.createElement(x.a,{style:{marginRight:e.spacing(1)}}),"API")),r.a.createElement(f.a,{title:"Access the GraphQL API used by this web interface"},r.a.createElement(h.a,{style:{color:"#fff"},target:"_blank",rel:"noopener noreferrer",href:_.graphqlUrl},r.a.createElement(I.a,{style:{marginRight:e.spacing(1)}}),"GraphQL")),r.a.createElement(l.b,{to:"/about",className:t.linkButton},r.a.createElement(f.a,{title:"About"},r.a.createElement(h.a,{style:{color:"#fff"}},r.a.createElement(y.a,null)))),r.a.createElement(f.a,{title:"Source code"},r.a.createElement(h.a,{style:{color:"#fff"},target:"_blank",href:"https://github.com/MaastrichtU-IDS/fair-enough"},r.a.createElement(E.a,null))),r.a.createElement(C.a,{className:"MuiButton\u2011root MuiButton\u2011contained",authorizationUrl:"https://orcid.org/oauth/authorize",responseType:"token",clientId:"",clientSecret:"",redirectUri:_.OauthRedirectUri,style:{textTransform:"none",textDecoration:"none"},onSuccess:function(e){console.log(e),localStorage.setItem("fairEnoughSettings",JSON.stringify(e)),window.location.reload()},onFailure:function(e){return console.error(e)}},r.a.createElement(h.a,{variant:"contained",color:"primary",size:"small",component:"span"},"Login"))))}var P=a(106),N=a(336);function D(){return r.a.createElement(P.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",r.a.createElement("a",{style:{textDecoration:"none",color:"inherit"},target:"_blank",href:"https://maastrichtuniversity.nl/ids"},"Institute of Data Science at Maastricht University")," ","2020.")}function L(){var e=Object(m.a)();return r.a.createElement("footer",{style:{padding:e.spacing(2),marginTop:"auto",color:"white",backgroundColor:e.palette.primary.main}},r.a.createElement(N.a,{maxWidth:"md",style:{textAlign:"center"}},r.a.createElement(P.a,{variant:"body2"},"This website is licensed under the\xa0",r.a.createElement("a",{target:"_blank",style:{textDecoration:"none",color:"inherit"},href:"https://github.com/MaastrichtU-IDS/fair-enough/blob/main/LICENSE"},"MIT license")),r.a.createElement(D,null)))}var U=a(31),S=a.n(U),T=a(27),B=a.n(T),M=a(337),W=a(127),F=a(189),H=a(331),J=a(266),G=a(187),z=a(185),q=a(265),$=a(188),Q=a(341),Y=a(65),X=a.n(Y),K=a(78),V=a(28),Z=a.n(V),ee=a(98),te=a.n(ee);function ae(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function ne(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?ae(Object(a),!0).forEach((function(t){S()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):ae(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function re(){var e=Object(m.a)(),t=Object(i.e)(),a=Object(p.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%"},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))(),n=(Object(i.f)(),r.a.useState({urlToEvaluate:"https://doi.org/10.1594/PANGAEA.908011",evaluationResults:null,adviceLogs:[],evaluationRunning:!1,evaluationsList:[],metadata_service_endpoint:"https://ws.pangaea.de/oai/provider",use_datacite:!0})),o=B()(n,2),l=o[0],c=o[1],s=r.a.useRef(l),u=r.a.useCallback((function(e){s.current=ne(ne({},s.current),e),c(s.current)}),[c]),d=r.a.useState(!1),g=B()(d,2),v=g[0],E=g[1],b=r.a.useState(null),y=B()(b,2),O=y[0],x=y[1];r.a.useEffect((function(){l.evaluationsList.length<1&&Z.a.get(_.restUrl+"/evaluations",{headers:{"Content-Type":"application/json"}}).then((function(e){var t=[];e.data.map((function(e,a){e.id=e._id,e.score_percent=e.score.percent,e.bonus_percent=e.score.bonus_percent,t.push(e)})),u({evaluationsList:t})}))}),[]);var w=function(e){return/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(e)?r.a.createElement("a",{href:e,className:a.link,target:"_blank",rel:"noopener noreferrer"},e):e},I=function(e){u(S()({},e.target.id,e.target.value))},k=[{field:"@id",headerName:"ID",hide:!0},{field:"id",headerName:"Access evaluation",flex:.5,renderCell:function(e){return r.a.createElement(h.a,{href:"/evaluation/"+e.value,variant:"contained",className:a.submitButton,startIcon:r.a.createElement(X.a,null),color:"primary"},"Evaluation")}},{field:"resource_uri",headerName:"Resource URI",flex:1,renderCell:function(e){return r.a.createElement(r.a.Fragment,null,w(e.value))}},{field:"score_percent",headerName:"FAIR compliant",flex:.5,renderCell:function(e){return r.a.createElement(r.a.Fragment,null,e.value,"%")}},{field:"bonus_percent",headerName:"FAIR Role Model",flex:.5,renderCell:function(e){return r.a.createElement(r.a.Fragment,null,e.value,"%")}}];return r.a.createElement(N.a,{className:"mainContainer"},r.a.createElement(P.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},"\u2696\ufe0f Evaluate how FAIR is a resource \ud83d\udd17"),r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),function(e){u({evaluationRunning:!0,evaluationResults:null}),console.log("Starting evaluation of "+e+" with API "+_.docsUrl);var a=JSON.stringify({resource_uri:e,collection:"fair-metrics"});Z.a.post(_.restUrl+"/evaluations",a,{headers:{"Content-Type":"application/json"}}).then((function(e){te()(Z.a,{retries:30,retryDelay:function(e){return console.log("Waiting for evaluation to finish: "+e),3e3*e},retryCondition:function(e){return 404===e.response.status}});var a=e.data._id;Z.a.get(_.restUrl+"/evaluations/"+a).then((function(e){t.push("/evaluation/"+a)}))}))}(l.urlToEvaluate)}},r.a.createElement(M.a,{display:"flex",style:{margin:e.spacing(0,6)}},r.a.createElement(W.a,{id:"urlToEvaluate",label:"URL of the resource to evaluate",placeholder:"URL of the resource to evaluate",value:l.urlToEvaluate,className:a.fullWidth,variant:"outlined",onChange:I,InputProps:{className:a.formInput}}),r.a.createElement(G.a,{open:v,anchorEl:O},r.a.createElement(z.a,{onClickAway:function(){E(!1),x(O?null:O)}},r.a.createElement(F.a,{elevation:4,className:a.paperPadding,style:{textAlign:"center"}},r.a.createElement(H.a,{container:!0,spacing:1},r.a.createElement(H.a,{item:!0,xs:12},r.a.createElement(f.a,{title:"By default, the FAIR Enough evaluator uses content negociation based on the DOI URL to retrieve DataCite JSON metadata. If you uncheck this option F-UJI will try to use the landing page URL instead."},r.a.createElement(q.a,{control:r.a.createElement($.a,{checked:l.use_datacite,onChange:function(e){u(S()({},e.target.name,e.target.checked))},name:"use_datacite",color:"primary"}),label:"Use DataCite"}))),r.a.createElement(H.a,{item:!0,xs:12},r.a.createElement(f.a,{title:"OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) endpoint to use when searching for metadata about this resource."},r.a.createElement(W.a,{id:"metadata_service_endpoint",label:"OAI-PMH metadata endpoint URL",placeholder:"OAI-PMH metadata endpoint URL",value:l.metadata_service_endpoint,className:a.fullWidth,variant:"outlined",onChange:I,InputProps:{className:a.formInput}})),r.a.createElement(Q.a,null,"List of OAI-PMH providers: ",w("https://www.openarchives.org/Register/BrowseSites")))))))),r.a.createElement(h.a,{type:"submit",variant:"contained",style:{marginTop:e.spacing(2),marginBottom:e.spacing(4)},startIcon:r.a.createElement(X.a,null),color:"secondary"},"Start the FAIR evaluation")),l.evaluationRunning&&r.a.createElement(J.a,{style:{margin:e.spacing(5,0)}}),l.evaluationsList.length>0&&r.a.createElement("div",{style:{height:600,width:"100%"}},console.log(l.evaluationsList),r.a.createElement(K.a,{columns:k,rows:l.evaluationsList,components:{Toolbar:K.b},style:{backgroundColor:"#fff"}})))}a(332);var oe=a(44),le=a(329),ie=a(342),ce=a(343),se=a(120),ue=a.n(se),me=a(157),pe=a.n(me);a(155),a(156);function de(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function ge(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?de(Object(a),!0).forEach((function(t){S()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):de(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function fe(){var e=Object(m.a)(),t=Object(p.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%"},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))(e),a=Object(i.g)(),n=(Object(i.f)(),r.a.useState({evaluationResults:null,adviceLogs:[],logLevel:"all",resourceMetadata:null})),o=B()(n,2),l=o[0],c=o[1],s=r.a.useRef(l),u=r.a.useCallback((function(e){s.current=ge(ge({},s.current),e),c(s.current)}),[c]);r.a.useEffect((function(){Z.a.get(_.restUrl+"/evaluations/"+a.id,{headers:{"Content-Type":"application/json"}}).then((function(e){var t=e.data;u({evaluationResults:t});var a=[];t.results.map((function(e,t){e.logs.map((function(e,t){(e.startsWith("\u274c")||e.startsWith("\u2139\ufe0f"))&&a.push(e)}))})),u({adviceLogs:a});var n={};Object.keys(t.data).map((function(e,a){["resource_title","resource_description","date_created","accessRights","license"].includes(e)&&(n[e]=t.data[e])})),u({resourceMetadata:n})}))}),[]);var d={f:"#b3e5fc",a:"#ffe0b2",i:"#c8e6c9",r:"#d1c4e9"},g=function(e){return/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(e)?r.a.createElement("a",{href:e,className:t.link,target:"_blank",rel:"noopener noreferrer"},e):e},f=function(e){return"all"==l.logLevel||("warning"==l.logLevel?e.startsWith("\u274c")||e.startsWith("\u26a0\ufe0f")||e.startsWith("\u2139\ufe0f"):"error"==l.logLevel?e.startsWith("\u274c")||e.startsWith("\u2139\ufe0f"):void 0)},v=function(e){var t=e.substring(0,1).toLowerCase(),a=l.evaluationResults.results.filter((function(e){var a=!1;return e.fair_type.startsWith(t)&&e.logs.map((function(e,t){1==f(e)&&(a=!0)})),a}));return r.a.createElement(r.a.Fragment,null,a.length>0&&r.a.createElement(le.a,{defaultExpanded:!0,style:{backgroundColor:d[t]}},r.a.createElement(ie.a,{expandIcon:r.a.createElement(ue.a,null)},r.a.createElement(P.a,{variant:"h4"},{f:"\ud83d\udd0d\ufe0f",a:"\ud83d\udcec\ufe0f",i:"\u2699\ufe0f",r:"\u267b\ufe0f"}[t]," ",e)),r.a.createElement(ce.a,null,r.a.createElement(H.a,{container:!0,spacing:1,style:{textAlign:"left"}},a.map((function(e,t){return r.a.createElement(H.a,{item:!0,xs:12,md:12,key:t},r.a.createElement(le.a,{defaultExpanded:!0},r.a.createElement(ie.a,{expandIcon:r.a.createElement(ue.a,null)},r.a.createElement(P.a,{variant:"h6"},e.title)),r.a.createElement(ce.a,null,r.a.createElement(H.a,{container:!0,spacing:1,style:{textAlign:"left"}},r.a.createElement(H.a,{item:!0,xs:12,md:12},r.a.createElement(r.a.Fragment,null,r.a.createElement(P.a,{variant:"body1"},e.description),r.a.createElement(P.a,{variant:"body1"},"Metric: ",e.fair_type.toUpperCase(),e.metric_id),r.a.createElement(P.a,{variant:"body1"},"Assessment URL: ",g(e.file_url)),r.a.createElement(P.a,{variant:"body1"},"FAIR score: ",e.score,"/",e.max_score),e.bonus_score>0||e.max_bonus>0&&r.a.createElement(P.a,{variant:"body1"},"Bonus score: ",e.bonus_score,"/",e.max_bonus))),r.a.createElement(H.a,{item:!0,xs:12,md:12},r.a.createElement("pre",null,r.a.createElement("code",{className:"language-pythonlogging",style:{whiteSpace:"pre-wrap",overflowX:"auto"}},e.logs.filter((function(e){return f(e)})).join("\n"))))))))}))))))};return r.a.createElement(N.a,{className:"mainContainer"},l.evaluationResults&&r.a.createElement(r.a.Fragment,null,r.a.createElement(P.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},l.evaluationResults.resource_uri),l.resourceMetadata&&r.a.createElement(r.a.Fragment,null,r.a.createElement(F.a,{className:t.paperPadding,style:{textAlign:"left"}},l.resourceMetadata.resource_title&&r.a.createElement(P.a,{variant:"h5",style:{marginBottom:e.spacing(1)}},"title: ",l.resourceMetadata.resource_title),l.resourceMetadata.resource_description&&r.a.createElement(P.a,{variant:"body1",style:{marginBottom:e.spacing(1)}},"summary: ",l.resourceMetadata.resource_description),Object.keys(l.resourceMetadata).map((function(t,a){if(!["resource_title","resource_description"].includes(t))return r.a.createElement(P.a,{variant:"body1",style:{marginBottom:e.spacing(1)},key:a},t,": ",g(l.resourceMetadata[t]))})))),r.a.createElement(H.a,{container:!0,spacing:1},r.a.createElement(H.a,{item:!0,xs:3,md:3}),r.a.createElement(H.a,{item:!0,xs:3,md:3},r.a.createElement(P.a,{variant:"h5",style:{margin:e.spacing(3,0)}},"FAIR score: ",l.evaluationResults.score.total_score,"/",l.evaluationResults.score.total_score_max),r.a.createElement(M.a,{sx:{position:"relative",display:"inline-flex"}},r.a.createElement(J.a,{variant:"determinate",value:l.evaluationResults.score.percent}),r.a.createElement(M.a,{sx:{top:0,left:0,bottom:0,right:0,position:"absolute",display:"flex",alignItems:"center",justifyContent:"center"}},r.a.createElement(P.a,{variant:"caption",component:"div"},l.evaluationResults.score.percent+"%",r.a.createElement("br",null))))),r.a.createElement(H.a,{item:!0,xs:3,md:3},r.a.createElement(P.a,{variant:"h5",style:{margin:e.spacing(3,0)}},"Bonus score: ",l.evaluationResults.score.total_bonus,"/",l.evaluationResults.score.total_bonus_max),r.a.createElement(M.a,{sx:{position:"relative",display:"inline-flex"}},r.a.createElement(J.a,{variant:"determinate",value:l.evaluationResults.score.bonus_percent}),r.a.createElement(M.a,{sx:{top:0,left:0,bottom:0,right:0,position:"absolute",display:"flex",alignItems:"center",justifyContent:"center"}},r.a.createElement(P.a,{variant:"caption",component:"div"},l.evaluationResults.score.bonus_percent+"%",r.a.createElement("br",null)))))),r.a.createElement(W.a,{select:!0,value:l.logLevel,label:"Log level",id:"logLevel",onChange:function(e){u({logLevel:e.target.value})},variant:"outlined"},r.a.createElement(oe.a,{value:"all"},"All logs"),r.a.createElement(oe.a,{value:"warning"},"Warnings and errors"),r.a.createElement(oe.a,{value:"error"},"Errors only")),v("Findable"),v("Accessible"),v("Interoperable"),v("Reusable"),r.a.createElement(h.a,{variant:"contained",style:{textTransform:"none",margin:e.spacing(2,2)},onClick:function(e){e.preventDefault();var t=document.createElement("a");t.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(l.evaluationResults,null,4))),t.setAttribute("download","evaluation.json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},startIcon:r.a.createElement(pe.a,null)},"Download the evaluation results JSON file")))}var he=a(100),ve=a.n(he);function Ee(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function be(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Ee(Object(a),!0).forEach((function(t){S()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Ee(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function ye(){var e=Object(m.a)(),t=(Object(i.e)(),Object(p.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%",margin:e.spacing(2,2)},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))()),a=r.a.useState({currentUser:null,accessToken:null,loggedIn:!1,assessmentsList:[],addedAssessments:[],collectionId:"",collectionTitle:"",collectionDescription:"",collectionHomepage:"",urlToEvaluate:"https://doi.org/10.1594/PANGAEA.908011",evaluationResults:null,adviceLogs:[],evaluationRunning:!1,evaluationsList:[],metadata_service_endpoint:"https://ws.pangaea.de/oai/provider",use_datacite:!0}),n=B()(a,2),o=n[0],l=n[1],c=r.a.useRef(o),s=r.a.useCallback((function(e){c.current=be(be({},c.current),e),l(c.current)}),[l]),u=r.a.useState(!1),d=B()(u,2),g=d[0],v=d[1],E=r.a.useState(null),b=B()(E,2),y=b[0],O=b[1];r.a.useEffect((function(){var e=localStorage.getItem("fairEnoughSettings"),t=JSON.parse(e);console.log(e),console.log(_.restUrl),!o.currentUser&&t&&t.access_token&&(console.log(t),Z.a.get(_.restUrl+"/current-user",{headers:{"Content-Type":"application/json",Authorization:"Bearer "+t.access_token}}).then((function(e){console.log("got current user"),console.log(e.data),e.data.id&&s({currentUser:e.data,accessToken:t.access_token,loggedIn:!0})})),s({currentUser:{token:t.access_token}})),o.assessmentsList.length<1&&Z.a.get(_.restUrl+"/assessments",{headers:{"Content-Type":"application/json"}}).then((function(e){console.log("got assesments"),console.log(e.data),s({assessmentsList:e.data})}))}),[o.currentUser,o.loggedIn,o.accessToken]);var x,w=function(e){s(S()({},e.target.id,e.target.value))};return r.a.createElement(N.a,{className:"mainContainer"},r.a.createElement(P.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},"Create a collection of assessments"),o.loggedIn&&r.a.createElement(P.a,{style:{textAlign:"center",marginBottom:e.spacing(4)}},"Logged in as ",o.currentUser.given_name," ",o.currentUser.family_name),!o.loggedIn&&r.a.createElement(P.a,{style:{textAlign:"center",marginBottom:e.spacing(4)}},"You need to login with your ORCID to create a new collection."),r.a.createElement("form",{onSubmit:function(e){e.preventDefault();var t=[];o.addedAssessments.map((function(e,a){t.push(e.id)}));var a={id:o.collectionId,title:o.collectionTitle,description:o.collectionDescription,homepage:o.collectionHomepage,assessments:t};Z.a.post(_.restUrl+"/collections",a,{headers:{"Content-Type":"application/json",Authorization:"Bearer "+o.accessToken}}).then((function(e){console.log("New collection "+a.id+" successfully created."),console.log(e.data)}))}},r.a.createElement(W.a,{id:"collectionId",label:"Collection ID",placeholder:"Collection ID",value:o.collectionId,className:t.fullWidth,variant:"outlined",onChange:w,InputProps:{className:t.formInput},style:{margin:e.spacing(1,0)}}),r.a.createElement(W.a,{id:"collectionTitle",label:"Collection Title",placeholder:"Collection Title",value:o.collectionTitle,className:t.fullWidth,variant:"outlined",onChange:w,InputProps:{className:t.formInput},style:{margin:e.spacing(1,0)}}),r.a.createElement(W.a,{id:"collectionDescription",label:"Collection Description",placeholder:"Collection Description",value:o.collectionDescription,className:t.fullWidth,variant:"outlined",onChange:w,InputProps:{className:t.formInput}}),r.a.createElement(W.a,{id:"collectionHomepage",label:"Collection Homepage",placeholder:"Collection Homepage",value:o.collectionHomepage,className:t.fullWidth,variant:"outlined",onChange:w,InputProps:{className:t.formInput},style:{margin:e.spacing(1,0)}}),r.a.createElement(P.a,{variant:"h5",style:{textAlign:"center",margin:e.spacing(3,0)}},"Assessments in your collection:"),r.a.createElement(H.a,{container:!0,spacing:1},o.addedAssessments.map((function(e,a){return r.a.createElement(H.a,{item:!0,xs:3,key:a},r.a.createElement(F.a,{elevation:4,className:t.paperPadding,style:{textAlign:"left"}},r.a.createElement(P.a,null,e.title)))})),o.addedAssessments.length<1&&r.a.createElement(H.a,{item:!0,xs:12},r.a.createElement(P.a,{style:{textAlign:"center"}},"No assessments added, click on the assessments in the list below to add them to your collection."))),r.a.createElement(P.a,{variant:"h5",style:{textAlign:"center",margin:e.spacing(3,0)}},"Add assessments to your collection:"),r.a.createElement(H.a,{container:!0,spacing:1},o.assessmentsList.filter((function(e){var t=!0;return o.addedAssessments.map((function(a,n){a.id==e.id&&(t=!1)})),t})).map((function(e,a){return r.a.createElement(H.a,{item:!0,xs:6,key:a},r.a.createElement("div",{onClick:function(){return t=e,void s({addedAssessment:o.addedAssessments.push(t)});var t}},r.a.createElement(F.a,{elevation:4,className:t.paperPadding,style:{textAlign:"left",cursor:"pointer"}},r.a.createElement(P.a,null,e.title),r.a.createElement(P.a,null,e.description),r.a.createElement(P.a,null,"Max score: ",e.max_score),r.a.createElement(P.a,null,"Max bonus: ",e.max_bonus))))}))),r.a.createElement(G.a,{open:g,anchorEl:y},r.a.createElement(z.a,{onClickAway:function(){v(!1),O(y?null:y)}},r.a.createElement(F.a,{elevation:4,className:t.paperPadding,style:{textAlign:"center"}},r.a.createElement(H.a,{container:!0,spacing:1},r.a.createElement(H.a,{item:!0,xs:12},r.a.createElement(f.a,{title:"By default, the FAIR Enough evaluator uses content negociation based on the DOI URL to retrieve DataCite JSON metadata. If you uncheck this option F-UJI will try to use the landing page URL instead."},r.a.createElement(q.a,{control:r.a.createElement($.a,{checked:o.use_datacite,onChange:function(e){s(S()({},e.target.name,e.target.checked))},name:"use_datacite",color:"primary"}),label:"Use DataCite"}))),r.a.createElement(H.a,{item:!0,xs:12},r.a.createElement(f.a,{title:"OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) endpoint to use when searching for metadata about this resource."},r.a.createElement(W.a,{id:"metadata_service_endpoint",label:"OAI-PMH metadata endpoint URL",placeholder:"OAI-PMH metadata endpoint URL",value:o.metadata_service_endpoint,className:t.fullWidth,variant:"outlined",onChange:w,InputProps:{className:t.formInput}})),r.a.createElement(Q.a,null,"List of OAI-PMH providers: ",/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(x="https://www.openarchives.org/Register/BrowseSites")?r.a.createElement("a",{href:x,className:t.link,target:"_blank",rel:"noopener noreferrer"},x):x)))))),r.a.createElement(h.a,{type:"submit",variant:"contained",disabled:!o.loggedIn,style:{marginTop:e.spacing(2),marginBottom:e.spacing(4)},startIcon:r.a.createElement(ve.a,null),color:"secondary"},"Create the collection"),!o.loggedIn&&r.a.createElement(P.a,{style:{textAlign:"center",marginBottom:e.spacing(4)}},"You need to login with your ORCID to create a new collection.")))}function Oe(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function xe(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Oe(Object(a),!0).forEach((function(t){S()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Oe(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function we(){var e=Object(m.a)(),t=(Object(i.e)(),Object(p.a)((function(){return{link:{color:e.palette.primary.main,textDecoration:"none","&:hover":{color:e.palette.primary.light,textDecoration:"none"}},submitButton:{textTransform:"none",margin:e.spacing(2,2)},fullWidth:{width:"100%"},autocomplete:{marginRight:e.spacing(2)},formInput:{background:"white",width:"100%"},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)}}}))()),a=(Object(i.f)(),r.a.useState({urlToEvaluate:"https://doi.org/10.1594/PANGAEA.908011",evaluationResults:null,collectionsList:[],evaluationRunning:!1,evaluationsList:[],metadata_service_endpoint:"https://ws.pangaea.de/oai/provider",use_datacite:!0})),n=B()(a,2),o=n[0],l=n[1],c=r.a.useRef(o),s=r.a.useCallback((function(e){c.current=xe(xe({},c.current),e),l(c.current)}),[l]),u=r.a.useState(!1),d=B()(u,2),g=(d[0],d[1],r.a.useState(null)),f=B()(g,2);f[0],f[1];r.a.useEffect((function(){o.collectionsList.length<1&&Z.a.get(_.restUrl+"/collections",{headers:{"Content-Type":"application/json"}}).then((function(e){var t=[];e.data.map((function(e,a){e.id=e._id,t.push(e)})),s({collectionsList:t})}))}),[]);var v=[{field:"id",headerName:"ID",hide:!1},{field:"title",headerName:"Title",flex:1},{field:"homepage",headerName:"Homepage",flex:1,renderCell:function(e){return r.a.createElement(r.a.Fragment,null,(a=e.value,/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(a)?r.a.createElement("a",{href:a,className:t.link,target:"_blank",rel:"noopener noreferrer"},a):a));var a}}];return r.a.createElement(N.a,{className:"mainContainer"},r.a.createElement(P.a,{variant:"h4",style:{textAlign:"center",marginBottom:e.spacing(4)}},"Collections of assessments"),r.a.createElement(h.a,{href:"/collection/create",variant:"contained",style:{marginTop:e.spacing(2),marginBottom:e.spacing(4)},startIcon:r.a.createElement(ve.a,null),color:"secondary"},"Create a new collection"),o.collectionsList.length>0&&r.a.createElement("div",{style:{height:600,width:"100%"}},console.log(o.collectionsList),r.a.createElement(K.a,{columns:v,rows:o.collectionsList,components:{Toolbar:K.b},style:{backgroundColor:"#fff"}})))}var Ie=a(340),ke=a(328),Ae=a(344),_e=a(333),je=a(326),Ce=a(158),Re=a.n(Ce),Pe=a(159),Ne=a.n(Pe),De=Object(p.a)((function(e){return{link:{textDecoration:"none",color:e.palette.primary.main,"&:hover":{color:e.palette.secondary.main,textDecoration:"none"}},paperPadding:{padding:e.spacing(2,2),margin:e.spacing(2,2)},paperTitle:{fontWeight:300,marginBottom:e.spacing(1)},mainText:{textAlign:"left",marginBottom:"20px"}}}));function Le(){var e=De(),t=Object(m.a)(),a=r.a.useState({open:!1,dialogOpen:!1,project_license:"",language_autocomplete:[]}),n=B()(a,2);n[0],n[1];return r.a.createElement(N.a,{className:"mainContainer"},r.a.createElement(P.a,{variant:"h4",className:e.mainText,style:{marginBottom:t.spacing(2)}},"About"),r.a.createElement(P.a,{variant:"body1",className:e.mainText},"FAIR Enough is a web service to evaluate how much online resources follow to the ",r.a.createElement("a",{href:"https://www.go-fair.org/fair-principles",className:e.link,target:"_blank",rel:"noopener noreferrer"},"FAIR principles \u267b\ufe0f")," (Findable, Accessible, Interoperable, Reusable)."),r.a.createElement(P.a,{variant:"body1",className:e.mainText},"Developed and hosted by the ",r.a.createElement("a",{href:"https://www.maastrichtuniversity.nl/research/institute-data-science",className:e.link,target:"_blank",rel:"noopener noreferrer"},"Institute of Data Science")," at Maastricht University."),r.a.createElement(P.a,{variant:"h4",className:e.mainText,style:{margin:t.spacing(2,0)}},"How it works"),r.a.createElement(P.a,{variant:"body1",className:e.mainText},"An ",r.a.createElement("b",null,"evaluation")," runs a ",r.a.createElement("b",null,"collection")," of ",r.a.createElement("b",null,"assessments")," against the resource to evaluate."),r.a.createElement(Ie.a,null,r.a.createElement(ke.a,null,r.a.createElement(Ae.a,null,r.a.createElement(_e.a,null,r.a.createElement(X.a,null))),r.a.createElement(je.a,null,r.a.createElement("b",null,"Evaluations")," can be created by anyone without authentication. An evaluation takes the URI of the resource to evaluate, and a collection of assessments to run against this resource.")),r.a.createElement(ke.a,null,r.a.createElement(Ae.a,null,r.a.createElement(_e.a,null,r.a.createElement(Re.a,null))),r.a.createElement(je.a,null,r.a.createElement("b",null,"Collections")," can be created through the API after authenticating with ORCID. A collection is a sorted list of assessments")),r.a.createElement(ke.a,null,r.a.createElement(Ae.a,null,r.a.createElement(_e.a,null,r.a.createElement(Ne.a,null))),r.a.createElement(je.a,null,r.a.createElement("b",null,"Assessments")," are tests written in Python that can be part of a collection. Each assessment run some tests against the resource to evaluate, record the results, and pass the results to the next assessment in the collection. To create a test you will need to add a python file in the folder ",r.a.createElement("a",{href:"https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments",className:e.link,target:"_blank",rel:"noopener noreferrer"},"backend/app/assessments")," and send us a pull request"))))}var Ue=Object(c.a)({palette:{primary:{light:"#63a4ff",main:u.a[700],dark:"#004ba0"},secondary:{light:"#4caf50",main:"#087f23",dark:"#00600f"}},typography:{fontFamily:'"Open Sans", "Roboto", "Arial"',fontWeightLight:300,fontWeightRegular:400,fontWeightMedium:500,fontSize:11}});t.a=function(){return r.a.createElement(s.a,{theme:Ue},r.a.createElement(l.a,{basename:"/"},r.a.createElement(o.a,{style:{height:"100%",backgroundColor:"#eceff1"}},r.a.createElement(R,null),r.a.createElement(i.a,{exact:!0,path:"/evaluation/:id",component:fe}),r.a.createElement(i.a,{path:"/about",component:Le}),r.a.createElement(i.a,{path:"/collections",component:we}),r.a.createElement(i.a,{path:"/collection/create",component:ye}),r.a.createElement(i.a,{exact:!0,path:"/",component:re}),r.a.createElement(L,null))))}},205:function(e,t,a){a(206),e.exports=a(255)},206:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/expo-service-worker.js",{scope:"/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},208:function(e,t,a){var n=a(209),r=a(210);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var o={insert:"head",singleton:!1};n(r,o);e.exports=r.locals||{}},210:function(e,t,a){(t=a(211)(!1)).push([e.i,"@import url(https://fonts.googleapis.com/css?family=Open+Sans);"]),t.push([e.i,'.flexGrow {\n  flex-grow: 1; \n}\n\n.mainContainer {\n  margin-top: 30px;\n  margin-bottom: 20px;\n  text-align: center;\n}\n\npre {\n  border: 2px solid grey;\n  padding: 1em;\n}\n\npre, code {\n  font-family: monospace, monospace;\n  border-radius: 6px;\n  /* padding: 2px; */\n  color: #adbac7;\n  background: #22272e;\n  /* padding: 0.5em; */\n  /* padding: 5px; */\n  /* color: white;\n  background-color: #757575; */\n  /* background-color: #78909c; */\n}\n  \n/* @import url("https://fonts.googleapis.com/icon?family=Material+Icons");\nbody {\n  margin: 0;\n  padding: 0;\n  text-align: center; } */\n',""]),e.exports=t}},[[205,1,2]]]);
//# sourceMappingURL=app.7c43fb0c.chunk.js.map