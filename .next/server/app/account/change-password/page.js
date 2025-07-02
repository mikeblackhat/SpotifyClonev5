(()=>{var e={};e.id=111,e.ids=[111],e.modules={38013:e=>{"use strict";e.exports=require("mongodb")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},71017:e=>{"use strict";e.exports=require("path")},63477:e=>{"use strict";e.exports=require("querystring")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},25008:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>d,routeModule:()=>m,tree:()=>c}),r(40930),r(11506),r(35866);var a=r(23191),o=r(88716),s=r(37922),n=r.n(s),i=r(95231),l={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);r.d(t,l);let c=["",{children:["account",{children:["change-password",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,40930)),"/Users/mikeblackhat/Spotify-clone v0.0.57/frontend/app/account/change-password/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,57481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,11506)),"/Users/mikeblackhat/Spotify-clone v0.0.57/frontend/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,57481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/Users/mikeblackhat/Spotify-clone v0.0.57/frontend/app/account/change-password/page.tsx"],u="/account/change-password/page",p={require:r,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/account/change-password/page",pathname:"/account/change-password",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},64285:(e,t,r)=>{Promise.resolve().then(r.bind(r,83512))},83512:(e,t,r)=>{"use strict";r.d(t,{default:()=>c});var a=r(10326),o=r(17577),s=r(35047),n=r(44046),i=r(40381),l=r(52102);function c(){let e=(0,s.useRouter)(),[t,r]=(0,o.useState)(!1),[c,d]=(0,o.useState)(!1),[u,p]=(0,o.useState)(null),[m,f]=(0,o.useState)({current:!1,new:!1,confirm:!1}),[g,x]=(0,o.useState)({currentPassword:"",newPassword:"",confirmPassword:""}),h=e=>{let{name:t,value:r}=e.target;x(e=>({...e,[t]:r}))},b=e=>{f(t=>({...t,[e]:!t[e]}))},y=e=>m[e]?"text":"password",w=()=>g.currentPassword?g.newPassword.length<8?(p("La nueva contrase\xf1a debe tener al menos 8 caracteres"),!1):g.newPassword===g.confirmPassword||(p("Las contrase\xf1as no coinciden"),!1):(p("Por favor ingresa tu contrase\xf1a actual"),!1),v=async e=>{if(e.preventDefault(),w())try{r(!0),p(null);let e=await fetch("/api/auth/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:g.currentPassword,newPassword:g.newPassword})}),t=await e.json();if(!e.ok)throw Error(t.error||"Error al cambiar la contrase\xf1a");d(!0),x({currentPassword:"",newPassword:"",confirmPassword:""})}catch(t){console.error("Error al cambiar la contrase\xf1a:",t);let e=t instanceof Error?t.message:"Error al cambiar la contrase\xf1a";p(e),i.Am.error(e,{duration:5e3})}finally{r(!1)}},j=()=>{d(!1),e.push("/account")};return(0,a.jsxs)("div",{className:"max-w-2xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl relative",children:[(0,a.jsxs)("div",{className:"mb-8",children:[(0,a.jsxs)("button",{onClick:()=>e.back(),className:"flex items-center text-gray-400 hover:text-white transition-colors mb-6",children:[a.jsx(n.x_l,{className:"mr-2"}),"Volver"]}),(0,a.jsxs)("div",{className:"flex items-center mb-6",children:[a.jsx("div",{className:"p-3 bg-green-900/30 rounded-full mr-4",children:a.jsx(n.kUi,{className:"text-green-400 text-xl"})}),a.jsx("h1",{className:"text-2xl font-bold text-white",children:"Cambiar contrase\xf1a"})]}),a.jsx("p",{className:"text-gray-400 text-sm",children:"Ingresa tu contrase\xf1a actual y la nueva contrase\xf1a que deseas establecer."})]}),(0,a.jsxs)("form",{onSubmit:v,className:"space-y-6",children:[(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{htmlFor:"currentPassword",className:"text-sm font-medium text-gray-400 block",children:"Contrase\xf1a actual"}),(0,a.jsxs)("div",{className:"relative",children:[a.jsx("input",{type:y("current"),id:"currentPassword",name:"currentPassword",value:g.currentPassword,onChange:h,className:"w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10",placeholder:"••••••••",required:!0}),a.jsx("button",{type:"button",onClick:()=>b("current"),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none","aria-label":m.current?"Ocultar contrase\xf1a":"Mostrar contrase\xf1a",children:m.current?a.jsx(n.tgn,{}):a.jsx(n.dSq,{})})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{htmlFor:"newPassword",className:"text-sm font-medium text-gray-400 block",children:"Nueva contrase\xf1a"}),(0,a.jsxs)("div",{className:"relative",children:[a.jsx("input",{type:y("new"),id:"newPassword",name:"newPassword",value:g.newPassword,onChange:h,className:"w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10",placeholder:"••••••••",minLength:8,required:!0}),a.jsx("button",{type:"button",onClick:()=>b("new"),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none","aria-label":m.new?"Ocultar contrase\xf1a":"Mostrar contrase\xf1a",children:m.new?a.jsx(n.tgn,{}):a.jsx(n.dSq,{})})]}),a.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"M\xednimo 8 caracteres"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("label",{htmlFor:"confirmPassword",className:"text-sm font-medium text-gray-400 block",children:"Confirmar nueva contrase\xf1a"}),(0,a.jsxs)("div",{className:"relative",children:[a.jsx("input",{type:y("confirm"),id:"confirmPassword",name:"confirmPassword",value:g.confirmPassword,onChange:h,className:"w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10",placeholder:"••••••••",minLength:8,required:!0}),a.jsx("button",{type:"button",onClick:()=>b("confirm"),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none","aria-label":m.confirm?"Ocultar contrase\xf1a":"Mostrar contrase\xf1a",children:m.confirm?a.jsx(n.tgn,{}):a.jsx(n.dSq,{})})]})]})]}),a.jsx("div",{className:"pt-2",children:a.jsx("button",{type:"submit",disabled:t,className:`w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-200 flex items-center justify-center ${t?"opacity-70 cursor-not-allowed":""}`,children:t?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[a.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),a.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Actualizando..."]}):"Cambiar contrase\xf1a"})})]}),a.jsx(l.u,{isOpen:c,onClose:j,closeOnClickOutside:!1,children:(0,a.jsxs)("div",{className:"text-center p-6",children:[a.jsx("div",{className:"flex justify-center mb-4",children:a.jsx("div",{className:"bg-green-100 p-3 rounded-full",children:a.jsx(n.FJM,{className:"text-green-500 text-4xl"})})}),a.jsx("h3",{className:"text-xl font-bold text-white mb-2",children:"\xa1Contrase\xf1a actualizada!"}),a.jsx("p",{className:"text-gray-300 mb-6",children:"Tu contrase\xf1a ha sido cambiada exitosamente."}),a.jsx("button",{onClick:j,className:"w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors",children:"Aceptar"})]})}),u&&(0,a.jsxs)("div",{className:"mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start",children:[a.jsx(n.gJy,{className:"text-red-400 mt-0.5 mr-3 flex-shrink-0"}),a.jsx("span",{className:"text-red-200 text-sm",children:u})]})]})}},52102:(e,t,r)=>{"use strict";r.d(t,{u:()=>s});var a=r(10326);r(17577);var o=r(60962);function s({isOpen:e,onClose:t,children:r,title:s,closeOnClickOutside:n=!0}){return e?(0,o.createPortal)(a.jsx("div",{className:"fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4",onClick:e=>{e.target===e.currentTarget&&n&&t()},children:(0,a.jsxs)("div",{className:"bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-700",children:[s&&a.jsx("div",{className:"px-6 py-4 border-b border-gray-700",children:a.jsx("h3",{className:"text-xl font-bold text-white",children:s})}),a.jsx("div",{className:"p-6",children:r})]})}),document.body):null}},40930:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p});var a=r(19510),o=r(45609),s=r(61085),n=r(94012),i=r(68570);let l=(0,i.createProxy)(String.raw`/Users/mikeblackhat/Spotify-clone v0.0.57/frontend/app/components/account/ChangePasswordForm.tsx`),{__esModule:c,$$typeof:d}=l;l.default;let u=(0,i.createProxy)(String.raw`/Users/mikeblackhat/Spotify-clone v0.0.57/frontend/app/components/account/ChangePasswordForm.tsx#default`);async function p(){return await (0,o.getServerSession)(n.L)||(0,s.redirect)("/login?callbackUrl=/account/change-password"),a.jsx("div",{className:"min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8",children:a.jsx("div",{className:"max-w-4xl mx-auto",children:a.jsx(u,{})})})}},94012:(e,t,r)=>{"use strict";r.d(t,{L:()=>l});var a=r(64704),o=r(53797),s=r(77234),n=r(2021),i=r(98691);let l={providers:[(0,s.Z)({clientId:process.env.GOOGLE_CLIENT_ID||"",clientSecret:process.env.GOOGLE_CLIENT_SECRET||"",allowDangerousEmailAccountLinking:!0}),(0,o.Z)({id:"credentials",name:"Credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Por favor ingresa tu correo y contrase\xf1a");let{email:t,password:r}=e;try{let t=(await n.Z).db(),r=await t.collection("users").findOne({email:e.email});if(!r)throw Error("No existe un usuario con este correo");let a=r.password;if("string"!=typeof a)throw Error("Contrase\xf1a no v\xe1lida");let o=a.toString(),s=e.password.toString(),l=!1;try{l=await i.ZP.compare(s,o)}catch(e){throw console.error("Error al comparar contrase\xf1as:",e),Error("Error al verificar la contrase\xf1a")}if(!l)throw Error("Contrase\xf1a incorrecta");let{password:c,...d}=r;return{id:r._id.toString(),email:r.email,name:r.name,image:r.image}}catch(e){throw console.error("Error during authorization:",e),e}}})],adapter:{...(0,a.dJ)(n.Z,{databaseName:process.env.MONGODB_DB}),async createUser(e){let t=(await n.Z).db(),r=e.email?.split("@")[0]||`user${Date.now()}`,a=r,o=1;for(;await t.collection("users").findOne({username:a});)a=`${r}${o}`,o++;let s={...e,username:a,plan:"free",provider:"google",emailVerified:e.emailVerified||new Date,createdAt:new Date,updatedAt:new Date},i=await t.collection("users").insertOne(s);return{...s,id:i.insertedId.toString()}}},session:{strategy:"jwt"},jwt:{maxAge:2592e3},secret:"BT+U6h3U0dzZRfcmFcTBgSLpg3fMDD0QX680SmuhKCY=",pages:{signIn:"/auth/signin",error:"/auth/signin"},debug:!1,events:{async createUser({user:e,account:t,profile:r,isNewUser:a}){},signIn:async({user:e,account:t,profile:r,isNewUser:a})=>(a&&t?.provider&&console.log(`Nuevo usuario creado con ${t.provider}`),!0),async error(e){console.error("Error de autenticaci\xf3n:",e)}},callbacks:{async signIn({user:e,account:t,profile:r,email:a,credentials:o}){if(a?.verificationRequest||!t?.provider||"credentials"===t.provider)return!0;try{if(t?.provider&&"credentials"!==t.provider){let a=(await n.Z).db();await a.collection("users").findOne({email:e.email})?await a.collection("users").updateOne({email:e.email},{$set:{name:e.name,image:r?.picture||e.image,provider:t.provider,updatedAt:new Date}}):await a.collection("users").insertOne({email:e.email,name:e.name,image:r?.picture||e.image,emailVerified:new Date,plan:"free",provider:t.provider,createdAt:new Date,updatedAt:new Date})}return!0}catch(e){return console.error("Error en el callback de signIn:",e),!1}},jwt:async({token:e,user:t,account:r})=>(t&&(e.id=t.id,e.provider=r?.provider),e),async session({session:e,token:t,user:r}){try{if(!e?.user?.email)return console.warn("No se encontr\xf3 el correo electr\xf3nico en la sesi\xf3n"),e;let a=(await n.Z).db(process.env.MONGODB_DB||""),o=e.user.email.toLowerCase(),s=await a.collection("users").findOne({email:o});if(!s)return console.warn(`Usuario con email ${o} no encontrado en la base de datos`),e;let i=s._id?.toString()||t.id||r?.id||"";if(e.user){if(e.user.id=i,void 0===s.plan||null===s.plan){let e="free";await a.collection("users").updateOne({_id:s._id},{$set:{plan:e,provider:t.provider||"google",updatedAt:new Date}}),s.plan=e,console.log(`Plan por defecto (${e}) asignado al usuario ${o}`)}if(!s.provider){let e=t.provider||"google";await a.collection("users").updateOne({_id:s._id},{$set:{provider:e,updatedAt:new Date}}),s.provider=e,console.log(`Proveedor ${e} asignado al usuario ${o}`)}t.plan=s.plan||"free",t.provider=s.provider||"google",e.user={...e.user,id:i,plan:s.plan||"free",provider:s.provider||"google"},console.log("Datos de sesi\xf3n actualizados para el usuario:",{email:e.user.email,plan:e.user.plan,provider:e.user.provider,id:e.user.id})}return e}catch(t){return console.error("Error en el callback de sesi\xf3n:",t),e}}}}},2021:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});var a=r(38013);if(!process.env.MONGODB_URI)throw Error("Please add your MongoDB connection string to .env.local");let o=process.env.MONGODB_URI,s=new a.MongoClient(o,{}).connect()},61085:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return n},RedirectType:function(){return a.RedirectType},notFound:function(){return o.notFound},permanentRedirect:function(){return a.permanentRedirect},redirect:function(){return a.redirect}});let a=r(83953),o=r(16399);class s extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class n extends URLSearchParams{append(){throw new s}delete(){throw new s}set(){throw new s}sort(){throw new s}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},16399:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{isNotFoundError:function(){return o},notFound:function(){return a}});let r="NEXT_NOT_FOUND";function a(){let e=Error(r);throw e.digest=r,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8586:(e,t)=>{"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return r}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},83953:(e,t,r)=>{"use strict";var a;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RedirectType:function(){return a},getRedirectError:function(){return l},getRedirectStatusCodeFromError:function(){return f},getRedirectTypeFromError:function(){return m},getURLFromRedirectError:function(){return p},isRedirectError:function(){return u},permanentRedirect:function(){return d},redirect:function(){return c}});let o=r(54580),s=r(72934),n=r(8586),i="NEXT_REDIRECT";function l(e,t,r){void 0===r&&(r=n.RedirectStatusCode.TemporaryRedirect);let a=Error(i);a.digest=i+";"+t+";"+e+";"+r+";";let s=o.requestAsyncStorage.getStore();return s&&(a.mutableCookies=s.mutableCookies),a}function c(e,t){void 0===t&&(t="replace");let r=s.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?n.RedirectStatusCode.SeeOther:n.RedirectStatusCode.TemporaryRedirect)}function d(e,t){void 0===t&&(t="replace");let r=s.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?n.RedirectStatusCode.SeeOther:n.RedirectStatusCode.PermanentRedirect)}function u(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r,a,o]=e.digest.split(";",4),s=Number(o);return t===i&&("replace"===r||"push"===r)&&"string"==typeof a&&!isNaN(s)&&s in n.RedirectStatusCode}function p(e){return u(e)?e.digest.split(";",3)[2]:null}function m(e){if(!u(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function f(e){if(!u(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(a||(a={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},57481:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var a=r(66621);let o=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},40381:(e,t,r)=>{"use strict";r.d(t,{Am:()=>R});var a,o=r(17577);let s={data:""},n=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||s,i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let r="",a="",o="";for(let s in e){let n=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+n+";":a+="f"==s[1]?d(n,s):s+"{"+d(n,"k"==s[1]?"":t)+"}":"object"==typeof n?a+=d(n,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=n&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=d.p?d.p(s,n):s+":"+n+";")}return r+(t&&o?t+"{"+o+"}":o)+a},u={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e},m=(e,t,r,a,o)=>{let s=p(e),n=u[s]||(u[s]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(s));if(!u[n]){let t=s!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(c," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);u[n]=d(o?{["@keyframes "+n]:t}:t,r?"":"."+n)}let m=r&&u.g?u.g:null;return r&&(u.g=u[n]),((e,t,r,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(u[n],t,a,m),n},f=(e,t,r)=>e.reduce((e,a,o)=>{let s=t[o];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==s?"":s)},"");function g(e){let t=this||{},r=e.call?e(t.p):e;return m(r.unshift?r.raw?f(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,n(t.target),t.g,t.o,t.k)}g.bind({g:1});let x,h,b,y=g.bind({k:1});function w(e,t){let r=this||{};return function(){let a=arguments;function o(s,n){let i=Object.assign({},s),l=i.className||o.className;r.p=Object.assign({theme:h&&h()},i),r.o=/ *go\d+/.test(l),i.className=g.apply(r,a)+(l?" "+l:""),t&&(i.ref=n);let c=e;return e[0]&&(c=i.as||e,delete i.as),b&&c[0]&&b(i),x(c,i)}return t?t(o):o}}var v=e=>"function"==typeof e,j=(e,t)=>v(e)?e(t):e,N=(()=>{let e=0;return()=>(++e).toString()})(),P=((()=>{let e;return()=>e})(),(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return P(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}}),_=[],O={toasts:[],pausedAt:void 0},S=e=>{O=P(O,e),_.forEach(e=>{e(O)})},k={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},C=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||N()}),E=e=>(t,r)=>{let a=C(t,e,r);return S({type:2,toast:a}),a.id},R=(e,t)=>E("blank")(e,t);R.error=E("error"),R.success=E("success"),R.loading=E("loading"),R.custom=E("custom"),R.dismiss=e=>{S({type:3,toastId:e})},R.remove=e=>S({type:4,toastId:e}),R.promise=(e,t,r)=>{let a=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?j(t.success,e):void 0;return o?R.success(o,{id:a,...r,...null==r?void 0:r.success}):R.dismiss(a),e}).catch(e=>{let o=t.error?j(t.error,e):void 0;o?R.error(o,{id:a,...r,...null==r?void 0:r.error}):R.dismiss(a)}),e};var q=new Map,M=1e3,A=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,T=(w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${A} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${D} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),F=(w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${T} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),L=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,U=(w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${L} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,w("div")`
  position: absolute;
`,w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,a=o.createElement,d.p=void 0,x=a,h=void 0,b=void 0,g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,226,621,885,459,225],()=>r(25008));module.exports=a})();