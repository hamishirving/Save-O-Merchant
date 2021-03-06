(function(a,b){if(typeof define==="function"&&define.amd){define(b)
}else{a.atmosphere=b()
}}(this,function(){var c="2.2.4-javascript",a={},d,g=[],f=[],e=0,b=Object.prototype.hasOwnProperty;
a={onError:function(h){},onClose:function(h){},onOpen:function(h){},onReopen:function(h){},onMessage:function(h){},onReconnect:function(i,h){},onMessagePublished:function(h){},onTransportFailure:function(i,h){},onLocalMessage:function(h){},onFailureToReconnect:function(i,h){},onClientTimeout:function(h){},onOpenAfterResume:function(h){},WebsocketApiAdapter:function(i){var h,j;
i.onMessage=function(k){j.onmessage({data:k.responseBody})
};
i.onMessagePublished=function(k){j.onmessage({data:k.responseBody})
};
i.onOpen=function(k){j.onopen(k)
};
j={close:function(){h.close()
},send:function(k){h.push(k)
},onmessage:function(k){},onopen:function(k){},onclose:function(k){},onerror:function(k){}};
h=new a.subscribe(i);
return j
},AtmosphereRequest:function(Z){var p={timeout:300000,method:"GET",headers:{},contentType:"",callback:null,url:"",data:"",suspend:true,maxRequest:-1,reconnect:true,maxStreamingLength:10000000,lastIndex:0,logLevel:"info",requestCount:0,fallbackMethod:"GET",fallbackTransport:"streaming",transport:"long-polling",webSocketImpl:null,webSocketBinaryType:null,dispatchUrl:null,webSocketPathDelimiter:"@@",enableXDR:false,rewriteURL:false,attachHeadersAsQueryString:true,executeCallbackBeforeReconnect:false,readyState:0,withCredentials:false,trackMessageLength:false,messageDelimiter:"|",connectTimeout:-1,reconnectInterval:0,dropHeaders:true,uuid:0,async:true,shared:false,readResponsesHeaders:false,maxReconnectOnClose:5,enableProtocol:true,pollingInterval:0,heartbeat:{client:null,server:null},ackInterval:0,closeAsync:false,onError:function(aC){},onClose:function(aC){},onOpen:function(aC){},onMessage:function(aC){},onReopen:function(aD,aC){},onReconnect:function(aD,aC){},onMessagePublished:function(aC){},onTransportFailure:function(aD,aC){},onLocalMessage:function(aC){},onFailureToReconnect:function(aD,aC){},onClientTimeout:function(aC){},onOpenAfterResume:function(aC){}};
var an={status:200,reasonPhrase:"OK",responseBody:"",messages:[],headers:[],state:"messageReceived",transport:"polling",error:null,request:null,partialMessage:"",errorHandled:false,closedByClientTimeout:false,ffTryingReconnect:false};
var ar=null;
var ac=null;
var y=null;
var n=null;
var U=null;
var u=true;
var au=0;
var ak=false;
var N=null;
var h;
var at=null;
var O=a.util.now();
var x;
var aB;
aj(Z);
function af(){u=true;
ak=false;
au=0;
ar=null;
ac=null;
y=null;
n=null
}function R(){k();
af()
}function G(aD,aC){if(an.partialMessage===""&&(aC.transport==="streaming")&&(aD.responseText.length>aC.maxStreamingLength)){return true
}return false
}function B(){if(p.enableProtocol&&!p.firstMessage){var aE="X-Atmosphere-Transport=close&X-Atmosphere-tracking-id="+p.uuid;
a.util.each(p.headers,function(aG,aI){var aH=a.util.isFunction(aI)?aI.call(this,p,p,an):aI;
if(aH!=null){aE+="&"+encodeURIComponent(aG)+"="+encodeURIComponent(aH)
}});
var aC=p.url.replace(/([?&])_=[^&]*/,aE);
aC=aC+(aC===p.url?(/\?/.test(p.url)?"&":"?")+aE:"");
var aD={connected:false};
var aF=new a.AtmosphereRequest(aD);
aF.attachHeadersAsQueryString=false;
aF.dropHeaders=true;
aF.url=aC;
aF.contentType="text/plain";
aF.transport="polling";
aF.method="GET";
aF.data="";
if(p.enableXDR){aF.enableXDR=p.enableXDR
}aF.async=aD.closeAsync;
ah("",aF)
}}function F(){if(p.logLevel==="debug"){a.util.debug("Closing")
}ak=true;
if(p.reconnectId){clearTimeout(p.reconnectId);
delete p.reconnectId
}if(p.heartbeatTimer){clearTimeout(p.heartbeatTimer)
}p.reconnect=false;
an.request=p;
an.state="unsubscribe";
an.responseBody="";
an.status=408;
an.partialMessage="";
ae();
B();
k()
}function k(){an.partialMessage="";
if(p.id){clearTimeout(p.id)
}if(p.heartbeatTimer){clearTimeout(p.heartbeatTimer)
}if(n!=null){n.close();
n=null
}if(U!=null){U.abort();
U=null
}if(y!=null){y.abort();
y=null
}if(ar!=null){if(ar.canSendMessage){ar.close()
}ar=null
}if(ac!=null){ac.close();
ac=null
}ad()
}function ad(){if(h!=null){clearInterval(x);
document.cookie=aB+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
h.signal("close",{reason:"",heir:!ak?O:(h.get("children")||[])[0]});
h.close()
}if(at!=null){at.close()
}}function aj(aC){R();
p=a.util.extend(p,aC);
p.mrequest=p.reconnect;
if(!p.reconnect){p.reconnect=true
}}function ap(){return p.webSocketImpl!=null||window.WebSocket||window.MozWebSocket
}function ao(){return window.EventSource
}function W(){if(p.shared){at=az(p);
if(at!=null){if(p.logLevel==="debug"){a.util.debug("Storage service available. All communication will be local")
}if(at.open(p)){return
}}if(p.logLevel==="debug"){a.util.debug("No Storage service available.")
}at=null
}p.firstMessage=e==0?true:false;
p.isOpen=false;
p.ctime=a.util.now();
if(p.uuid===0){p.uuid=e
}an.closedByClientTimeout=false;
if(p.transport!=="websocket"&&p.transport!=="sse"){I(p)
}else{if(p.transport==="websocket"){if(!ap()){av("Websocket is not supported, using request.fallbackTransport ("+p.fallbackTransport+")")
}else{ab(false)
}}else{if(p.transport==="sse"){if(!ao()){av("Server Side Events(SSE) is not supported, using request.fallbackTransport ("+p.fallbackTransport+")")
}else{A(false)
}}}}}function az(aG){var aH,aF,aK,aC="atmosphere-"+aG.url,aD={storage:function(){function aL(aP){if(aP.key===aC&&aP.newValue){aE(aP.newValue)
}}if(!a.util.storage){return
}var aO=window.localStorage,aM=function(aP){return a.util.parseJSON(aO.getItem(aC+"-"+aP))
},aN=function(aP,aQ){aO.setItem(aC+"-"+aP,a.util.stringifyJSON(aQ))
};
return{init:function(){aN("children",aM("children").concat([O]));
a.util.on(window,"storage",aL);
return aM("opened")
},signal:function(aP,aQ){aO.setItem(aC,a.util.stringifyJSON({target:"p",type:aP,data:aQ}))
},close:function(){var aP=aM("children");
a.util.off(window,"storage",aL);
if(aP){if(aI(aP,aG.id)){aN("children",aP)
}}}}
},windowref:function(){var aL=window.open("",aC.replace(/\W/g,""));
if(!aL||aL.closed||!aL.callbacks){return
}return{init:function(){aL.callbacks.push(aE);
aL.children.push(O);
return aL.opened
},signal:function(aM,aN){if(!aL.closed&&aL.fire){aL.fire(a.util.stringifyJSON({target:"p",type:aM,data:aN}))
}},close:function(){if(!aK){aI(aL.callbacks,aE);
aI(aL.children,O)
}}}
}};
function aI(aO,aN){var aL,aM=aO.length;
for(aL=0;
aL<aM;
aL++){if(aO[aL]===aN){aO.splice(aL,1)
}}return aM!==aO.length
}function aE(aL){var aN=a.util.parseJSON(aL),aM=aN.data;
if(aN.target==="c"){switch(aN.type){case"open":S("opening","local",p);
break;
case"close":if(!aK){aK=true;
if(aM.reason==="aborted"){F()
}else{if(aM.heir===O){W()
}else{setTimeout(function(){W()
},100)
}}}break;
case"message":l(aM,"messageReceived",200,aG.transport);
break;
case"localMessage":D(aM);
break
}}}function aJ(){var aL=new RegExp("(?:^|; )("+encodeURIComponent(aC)+")=([^;]*)").exec(document.cookie);
if(aL){return a.util.parseJSON(decodeURIComponent(aL[2]))
}}aH=aJ();
if(!aH||a.util.now()-aH.ts>1000){return
}aF=aD.storage()||aD.windowref();
if(!aF){return
}return{open:function(){var aL;
x=setInterval(function(){var aM=aH;
aH=aJ();
if(!aH||aM.ts===aH.ts){aE(a.util.stringifyJSON({target:"c",type:"close",data:{reason:"error",heir:aM.heir}}))
}},1000);
aL=aF.init();
if(aL){setTimeout(function(){S("opening","local",aG)
},50)
}return aL
},send:function(aL){aF.signal("send",aL)
},localSend:function(aL){aF.signal("localSend",a.util.stringifyJSON({id:O,event:aL}))
},close:function(){if(!ak){clearInterval(x);
aF.signal("close");
aF.close()
}}}
}function aA(){var aD,aC="atmosphere-"+p.url,aH={storage:function(){function aI(aK){if(aK.key===aC&&aK.newValue){aE(aK.newValue)
}}if(!a.util.storage){return
}var aJ=window.localStorage;
return{init:function(){a.util.on(window,"storage",aI)
},signal:function(aK,aL){aJ.setItem(aC,a.util.stringifyJSON({target:"c",type:aK,data:aL}))
},get:function(aK){return a.util.parseJSON(aJ.getItem(aC+"-"+aK))
},set:function(aK,aL){aJ.setItem(aC+"-"+aK,a.util.stringifyJSON(aL))
},close:function(){a.util.off(window,"storage",aI);
aJ.removeItem(aC);
aJ.removeItem(aC+"-opened");
aJ.removeItem(aC+"-children")
}}
},windowref:function(){var aJ=aC.replace(/\W/g,""),aI=document.getElementById(aJ),aK;
if(!aI){aI=document.createElement("div");
aI.id=aJ;
aI.style.display="none";
aI.innerHTML='<iframe name="'+aJ+'" />';
document.body.appendChild(aI)
}aK=aI.firstChild.contentWindow;
return{init:function(){aK.callbacks=[aE];
aK.fire=function(aL){var aM;
for(aM=0;
aM<aK.callbacks.length;
aM++){aK.callbacks[aM](aL)
}}
},signal:function(aL,aM){if(!aK.closed&&aK.fire){aK.fire(a.util.stringifyJSON({target:"c",type:aL,data:aM}))
}},get:function(aL){return !aK.closed?aK[aL]:null
},set:function(aL,aM){if(!aK.closed){aK[aL]=aM
}},close:function(){}}
}};
function aE(aI){var aK=a.util.parseJSON(aI),aJ=aK.data;
if(aK.target==="p"){switch(aK.type){case"send":t(aJ);
break;
case"localSend":D(aJ);
break;
case"close":F();
break
}}}N=function aG(aI){aD.signal("message",aI)
};
function aF(){document.cookie=aB+"="+encodeURIComponent(a.util.stringifyJSON({ts:a.util.now()+1,heir:(aD.get("children")||[])[0]}))+"; path=/"
}aD=aH.storage()||aH.windowref();
aD.init();
if(p.logLevel==="debug"){a.util.debug("Installed StorageService "+aD)
}aD.set("children",[]);
if(aD.get("opened")!=null&&!aD.get("opened")){aD.set("opened",false)
}aB=encodeURIComponent(aC);
aF();
x=setInterval(aF,1000);
h=aD
}function S(aE,aH,aD){if(p.shared&&aH!=="local"){aA()
}if(h!=null){h.set("opened",true)
}aD.close=function(){F()
};
if(au>0&&aE==="re-connecting"){aD.isReopen=true;
q(an)
}else{if(an.error==null){an.request=aD;
var aF=an.state;
an.state=aE;
var aC=an.transport;
an.transport=aH;
var aG=an.responseBody;
ae();
an.responseBody=aG;
an.state=aF;
an.transport=aC
}}}function ax(aE){aE.transport="jsonp";
var aD=p,aC;
if((aE!=null)&&(typeof(aE)!=="undefined")){aD=aE
}U={open:function(){var aG="atmosphere"+(++O);
function aF(){var aH=aD.url;
if(aD.dispatchUrl!=null){aH+=aD.dispatchUrl
}var aJ=aD.data;
if(aD.attachHeadersAsQueryString){aH=o(aD);
if(aJ!==""){aH+="&X-Atmosphere-Post-Body="+encodeURIComponent(aJ)
}aJ=""
}var aI=document.head||document.getElementsByTagName("head")[0]||document.documentElement;
aC=document.createElement("script");
aC.src=aH+"&jsonpTransport="+aG;
aC.clean=function(){aC.clean=aC.onerror=aC.onload=aC.onreadystatechange=null;
if(aC.parentNode){aC.parentNode.removeChild(aC)
}};
aC.onload=aC.onreadystatechange=function(){if(!aC.readyState||/loaded|complete/.test(aC.readyState)){aC.clean()
}};
aC.onerror=function(){aC.clean();
aD.lastIndex=0;
if(aD.openId){clearTimeout(aD.openId)
}if(aD.heartbeatTimer){clearTimeout(aD.heartbeatTimer)
}if(aD.reconnect&&au++<aD.maxReconnectOnClose){S("re-connecting",aD.transport,aD);
ai(U,aD,aE.reconnectInterval);
aD.openId=setTimeout(function(){V(aD)
},aD.reconnectInterval+1000)
}else{Q(0,"maxReconnectOnClose reached")
}};
aI.insertBefore(aC,aI.firstChild)
}window[aG]=function(aJ){if(aD.reconnect){if(aD.maxRequest===-1||aD.requestCount++<aD.maxRequest){if(!aD.executeCallbackBeforeReconnect){ai(U,aD,aD.pollingInterval)
}if(aJ!=null&&typeof aJ!=="string"){try{aJ=aJ.message
}catch(aI){}}var aH=r(aJ,aD,an);
if(!aH){l(an.responseBody,"messageReceived",200,aD.transport)
}if(aD.executeCallbackBeforeReconnect){ai(U,aD,aD.pollingInterval)
}}else{a.util.log(p.logLevel,["JSONP reconnect maximum try reached "+p.requestCount]);
Q(0,"maxRequest reached")
}}};
setTimeout(function(){aF()
},50)
},abort:function(){if(aC&&aC.clean){aC.clean()
}}};
U.open()
}function aq(aC){if(p.webSocketImpl!=null){return p.webSocketImpl
}else{if(window.WebSocket){return new WebSocket(aC)
}else{return new MozWebSocket(aC)
}}}function v(){return o(p,a.util.getAbsoluteURL(p.webSocketUrl||p.url)).replace(/^http/,"ws")
}function P(){var aC=o(p);
return aC
}function A(aD){an.transport="sse";
var aC=P();
if(p.logLevel==="debug"){a.util.debug("Invoking executeSSE");
a.util.debug("Using URL: "+aC)
}if(aD&&!p.reconnect){if(ac!=null){k()
}return
}try{ac=new EventSource(aC,{withCredentials:p.withCredentials})
}catch(aE){Q(0,aE);
av("SSE failed. Downgrading to fallback transport and resending");
return
}if(p.connectTimeout>0){p.id=setTimeout(function(){if(!aD){k()
}},p.connectTimeout)
}ac.onopen=function(aF){j(p);
if(p.logLevel==="debug"){a.util.debug("SSE successfully opened")
}if(!p.enableProtocol){if(!aD){S("opening","sse",p)
}else{S("re-opening","sse",p)
}}else{if(p.isReopen){p.isReopen=false;
S("re-opening",p.transport,p)
}}aD=true;
if(p.method==="POST"){an.state="messageReceived";
ac.send(p.data)
}};
ac.onmessage=function(aG){j(p);
if(!p.enableXDR&&aG.origin&&aG.origin!==window.location.protocol+"//"+window.location.host){a.util.log(p.logLevel,["Origin was not "+window.location.protocol+"//"+window.location.host]);
return
}an.state="messageReceived";
an.status=200;
aG=aG.data;
var aF=r(aG,p,an);
if(!aF){ae();
an.responseBody="";
an.messages=[]
}};
ac.onerror=function(aF){clearTimeout(p.id);
if(p.heartbeatTimer){clearTimeout(p.heartbeatTimer)
}if(an.closedByClientTimeout){return
}aa(aD);
k();
if(ak){a.util.log(p.logLevel,["SSE closed normally"])
}else{if(!aD){av("SSE failed. Downgrading to fallback transport and resending")
}else{if(p.reconnect&&(an.transport==="sse")){if(au++<p.maxReconnectOnClose){S("re-connecting",p.transport,p);
if(p.reconnectInterval>0){p.reconnectId=setTimeout(function(){A(true)
},p.reconnectInterval)
}else{A(true)
}an.responseBody="";
an.messages=[]
}else{a.util.log(p.logLevel,["SSE reconnect maximum try reached "+au]);
Q(0,"maxReconnectOnClose reached")
}}}}}
}function ab(aD){an.transport="websocket";
var aC=v(p.url);
if(p.logLevel==="debug"){a.util.debug("Invoking executeWebSocket");
a.util.debug("Using URL: "+aC)
}if(aD&&!p.reconnect){if(ar!=null){k()
}return
}ar=aq(aC);
if(p.webSocketBinaryType!=null){ar.binaryType=p.webSocketBinaryType
}if(p.connectTimeout>0){p.id=setTimeout(function(){if(!aD){var aG={code:1002,reason:"",wasClean:false};
ar.onclose(aG);
try{k()
}catch(aH){}return
}},p.connectTimeout)
}ar.onopen=function(aH){j(p);
if(p.logLevel==="debug"){a.util.debug("Websocket successfully opened")
}var aG=aD;
if(ar!=null){ar.canSendMessage=true
}if(!p.enableProtocol){aD=true;
if(aG){S("re-opening","websocket",p)
}else{S("opening","websocket",p)
}}if(ar!=null){if(p.method==="POST"){an.state="messageReceived";
ar.send(p.data)
}}};
ar.onmessage=function(aI){j(p);
if(p.enableProtocol){aD=true
}an.state="messageReceived";
an.status=200;
aI=aI.data;
var aG=typeof(aI)==="string";
if(aG){var aH=r(aI,p,an);
if(!aH){ae();
an.responseBody="";
an.messages=[]
}}else{aI=s(p,aI);
if(aI===""){return
}an.responseBody=aI;
ae();
an.responseBody=null
}};
ar.onerror=function(aG){clearTimeout(p.id);
if(p.heartbeatTimer){clearTimeout(p.heartbeatTimer)
}};
ar.onclose=function(aG){clearTimeout(p.id);
if(an.state==="closed"){return
}var aH=aG.reason;
if(aH===""){switch(aG.code){case 1000:aH="Normal closure; the connection successfully completed whatever purpose for which it was created.";
break;
case 1001:aH="The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
break;
case 1002:aH="The endpoint is terminating the connection due to a protocol error.";
break;
case 1003:aH="The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
break;
case 1004:aH="The endpoint is terminating the connection because a data frame was received that is too large.";
break;
case 1005:aH="Unknown: no status code was provided even though one was expected.";
break;
case 1006:aH="Connection was closed abnormally (that is, with no close frame being sent).";
break
}}if(p.logLevel==="warn"){a.util.warn("Websocket closed, reason: "+aH);
a.util.warn("Websocket closed, wasClean: "+aG.wasClean)
}if(an.closedByClientTimeout){return
}aa(aD);
an.state="closed";
if(ak){a.util.log(p.logLevel,["Websocket closed normally"])
}else{if(!aD){av("Websocket failed. Downgrading to Comet and resending")
}else{if(p.reconnect&&an.transport==="websocket"&&aG.code!==1001){k();
if(au++<p.maxReconnectOnClose){S("re-connecting",p.transport,p);
if(p.reconnectInterval>0){p.reconnectId=setTimeout(function(){an.responseBody="";
an.messages=[];
ab(true)
},p.reconnectInterval)
}else{an.responseBody="";
an.messages=[];
ab(true)
}}else{a.util.log(p.logLevel,["Websocket reconnect maximum try reached "+p.requestCount]);
if(p.logLevel==="warn"){a.util.warn("Websocket error, reason: "+aG.reason)
}Q(0,"maxReconnectOnClose reached")
}}}}};
var aE=navigator.userAgent.toLowerCase();
var aF=aE.indexOf("android")>-1;
if(aF&&ar.url===undefined){ar.onclose({reason:"Android 4.1 does not support websockets.",wasClean:false})
}}function s(aD,aK){var aJ=aK;
if(aD.transport==="polling"){return aJ
}if(a.util.trim(aK).length!==0&&aD.enableProtocol&&aD.firstMessage){var aI=aD.trackMessageLength?1:0;
var aE=aK.split(aD.messageDelimiter);
if(aE.length<=aI+1){return aJ
}aD.firstMessage=false;
aD.uuid=a.util.trim(aE[aI]);
if(aE.length<=aI+2){a.util.log("error",["Protocol data not sent by the server. If you enable protocol on client side, be sure to install JavascriptProtocol interceptor on server side.Also note that atmosphere-runtime 2.2+ should be used."])
}var aC=parseInt(a.util.trim(aE[aI+1]),10);
var aH=aE[aI+2];
if(!isNaN(aC)&&aC>0){var aF=function(){t(aH);
aD.heartbeatTimer=setTimeout(aF,aC)
};
aD.heartbeatTimer=setTimeout(aF,aC)
}if(aD.transport!=="long-polling"){V(aD)
}e=aD.uuid;
aJ="";
aI=aD.trackMessageLength?4:3;
if(aE.length>aI+1){for(var aG=aI;
aG<aE.length;
aG++){aJ+=aE[aG];
if(aG+1!==aE.length){aJ+=aD.messageDelimiter
}}}if(aD.ackInterval!==0){setTimeout(function(){t("...ACK...")
},aD.ackInterval)
}}else{if(aD.enableProtocol&&aD.firstMessage&&a.util.browser.msie&&+a.util.browser.version.split(".")[0]<10){a.util.log(p.logLevel,["Receiving unexpected data from IE"])
}else{V(aD)
}}return aJ
}function j(aC){clearTimeout(aC.id);
if(aC.timeout>0&&aC.transport!=="polling"){aC.id=setTimeout(function(){ay(aC);
B();
k()
},aC.timeout)
}}function ay(aC){an.closedByClientTimeout=true;
an.state="closedByClient";
an.responseBody="";
an.status=408;
an.messages=[];
ae()
}function Q(aC,aD){k();
clearTimeout(p.id);
an.state="error";
an.reasonPhrase=aD;
an.responseBody="";
an.status=aC;
an.messages=[];
ae()
}function r(aG,aF,aC){aG=s(aF,aG);
if(aG.length===0){return true
}aC.responseBody=aG;
if(aF.trackMessageLength){aG=aC.partialMessage+aG;
var aE=[];
var aD=aG.indexOf(aF.messageDelimiter);
while(aD!==-1){var aI=aG.substring(0,aD);
var aH=+aI;
if(isNaN(aH)){throw new Error('message length "'+aI+'" is not a number')
}aD+=aF.messageDelimiter.length;
if(aD+aH>aG.length){aD=-1
}else{aE.push(aG.substring(aD,aD+aH));
aG=aG.substring(aD+aH,aG.length);
aD=aG.indexOf(aF.messageDelimiter)
}}aC.partialMessage=aG;
if(aE.length!==0){aC.responseBody=aE.join(aF.messageDelimiter);
aC.messages=aE;
return false
}else{aC.responseBody="";
aC.messages=[];
return true
}}else{aC.responseBody=aG
}return false
}function av(aC){a.util.log(p.logLevel,[aC]);
if(typeof(p.onTransportFailure)!=="undefined"){p.onTransportFailure(aC,p)
}else{if(typeof(a.util.onTransportFailure)!=="undefined"){a.util.onTransportFailure(aC,p)
}}p.transport=p.fallbackTransport;
var aD=p.connectTimeout===-1?0:p.connectTimeout;
if(p.reconnect&&p.transport!=="none"||p.transport==null){p.method=p.fallbackMethod;
an.transport=p.fallbackTransport;
p.fallbackTransport="none";
if(aD>0){p.reconnectId=setTimeout(function(){W()
},aD)
}else{W()
}}else{Q(500,"Unable to reconnect with fallback transport")
}}function o(aE,aC){var aD=p;
if((aE!=null)&&(typeof(aE)!=="undefined")){aD=aE
}if(aC==null){aC=aD.url
}if(!aD.attachHeadersAsQueryString){return aC
}if(aC.indexOf("X-Atmosphere-Framework")!==-1){return aC
}aC+=(aC.indexOf("?")!==-1)?"&":"?";
aC+="X-Atmosphere-tracking-id="+aD.uuid;
aC+="&X-Atmosphere-Framework="+c;
aC+="&X-Atmosphere-Transport="+aD.transport;
if(aD.trackMessageLength){aC+="&X-Atmosphere-TrackMessageSize=true"
}if(aD.heartbeat!==null&&aD.heartbeat.server!==null){aC+="&X-Heartbeat-Server="+aD.heartbeat.server
}if(aD.contentType!==""){aC+="&Content-Type="+(aD.transport==="websocket"?aD.contentType:encodeURIComponent(aD.contentType))
}if(aD.enableProtocol){aC+="&X-atmo-protocol=true"
}a.util.each(aD.headers,function(aF,aH){var aG=a.util.isFunction(aH)?aH.call(this,aD,aE,an):aH;
if(aG!=null){aC+="&"+encodeURIComponent(aF)+"="+encodeURIComponent(aG)
}});
return aC
}function V(aC){if(!aC.isOpen){aC.isOpen=true;
S("opening",aC.transport,aC)
}else{if(aC.isReopen){aC.isReopen=false;
S("re-opening",aC.transport,aC)
}else{if(an.state==="messageReceived"&&(aC.transport==="jsonp"||aC.transport==="long-polling")){al(an)
}}}}function I(aF){var aD=p;
if((aF!=null)||(typeof(aF)!=="undefined")){aD=aF
}aD.lastIndex=0;
aD.readyState=0;
if((aD.transport==="jsonp")||((aD.enableXDR)&&(a.util.checkCORSSupport()))){ax(aD);
return
}if(a.util.browser.msie&&+a.util.browser.version.split(".")[0]<10){if((aD.transport==="streaming")){if(aD.enableXDR&&window.XDomainRequest){M(aD)
}else{aw(aD)
}return
}if((aD.enableXDR)&&(window.XDomainRequest)){M(aD);
return
}}var aG=function(){aD.lastIndex=0;
if(aD.reconnect&&au++<aD.maxReconnectOnClose){an.ffTryingReconnect=true;
S("re-connecting",aF.transport,aF);
ai(aE,aD,aF.reconnectInterval)
}else{Q(0,"maxReconnectOnClose reached")
}};
var aC=function(){an.errorHandled=true;
k();
aG()
};
if(aD.force||(aD.reconnect&&(aD.maxRequest===-1||aD.requestCount++<aD.maxRequest))){aD.force=false;
var aE=a.util.xhr();
aE.hasData=false;
J(aE,aD,true);
if(aD.suspend){y=aE
}if(aD.transport!=="polling"){an.transport=aD.transport;
aE.onabort=function(){aa(true)
};
aE.onerror=function(){an.error=true;
an.ffTryingReconnect=true;
try{an.status=XMLHttpRequest.status
}catch(aI){an.status=500
}if(!an.status){an.status=500
}if(!an.errorHandled){k();
aG()
}}
}aE.onreadystatechange=function(){if(ak){return
}an.error=null;
var aJ=false;
var aP=false;
if(aD.transport==="streaming"&&aD.readyState>2&&aE.readyState===4){k();
aG();
return
}aD.readyState=aE.readyState;
if(aD.transport==="streaming"&&aE.readyState>=3){aP=true
}else{if(aD.transport==="long-polling"&&aE.readyState===4){aP=true
}}j(p);
if(aD.transport!=="polling"){var aI=200;
if(aE.readyState===4){aI=aE.status>1000?0:aE.status
}if(aI>=300||aI===0){aC();
return
}if((!aD.enableProtocol||!aF.firstMessage)&&aE.readyState===2){if(a.util.browser.mozilla&&an.ffTryingReconnect){an.ffTryingReconnect=false;
setTimeout(function(){if(!an.ffTryingReconnect){V(aD)
}},500)
}else{V(aD)
}}}else{if(aE.readyState===4){aP=true
}}if(aP){var aM=aE.responseText;
an.errorHandled=false;
if(a.util.trim(aM).length===0&&aD.transport==="long-polling"){if(!aE.hasData){ai(aE,aD,aD.pollingInterval)
}else{aE.hasData=false
}return
}aE.hasData=true;
E(aE,p);
if(aD.transport==="streaming"){if(!a.util.browser.opera){var aL=aM.substring(aD.lastIndex,aM.length);
aJ=r(aL,aD,an);
aD.lastIndex=aM.length;
if(aJ){return
}}else{a.util.iterate(function(){if(an.status!==500&&aE.responseText.length>aD.lastIndex){try{an.status=aE.status;
an.headers=a.util.parseHeaders(aE.getAllResponseHeaders());
E(aE,p)
}catch(aR){an.status=404
}j(p);
an.state="messageReceived";
var aQ=aE.responseText.substring(aD.lastIndex);
aD.lastIndex=aE.responseText.length;
aJ=r(aQ,aD,an);
if(!aJ){ae()
}if(G(aE,aD)){H(aE,aD);
return
}}else{if(an.status>400){aD.lastIndex=aE.responseText.length;
return false
}}},0)
}}else{aJ=r(aM,aD,an)
}var aO=G(aE,aD);
try{an.status=aE.status;
an.headers=a.util.parseHeaders(aE.getAllResponseHeaders());
E(aE,aD)
}catch(aN){an.status=404
}if(aD.suspend){an.state=an.status===0?"closed":"messageReceived"
}else{an.state="messagePublished"
}var aK=!aO&&aF.transport!=="streaming"&&aF.transport!=="polling";
if(aK&&!aD.executeCallbackBeforeReconnect){ai(aE,aD,aD.pollingInterval)
}if(an.responseBody.length!==0&&!aJ){ae()
}if(aK&&aD.executeCallbackBeforeReconnect){ai(aE,aD,aD.pollingInterval)
}if(aO){H(aE,aD)
}}};
try{aE.send(aD.data);
u=true
}catch(aH){a.util.log(aD.logLevel,["Unable to connect to "+aD.url]);
Q(0,aH)
}}else{if(aD.logLevel==="debug"){a.util.log(aD.logLevel,["Max re-connection reached."])
}Q(0,"maxRequest reached")
}}function H(aD,aC){F();
ak=false;
ai(aD,aC,500)
}function J(aE,aF,aD){var aC=aF.url;
if(aF.dispatchUrl!=null&&aF.method==="POST"){aC+=aF.dispatchUrl
}aC=o(aF,aC);
aC=a.util.prepareURL(aC);
if(aD){aE.open(aF.method,aC,aF.async);
if(aF.connectTimeout>0){aF.id=setTimeout(function(){if(aF.requestCount===0){k();
l("Connect timeout","closed",200,aF.transport)
}},aF.connectTimeout)
}}if(p.withCredentials&&p.transport!=="websocket"){if("withCredentials" in aE){aE.withCredentials=true
}}if(!p.dropHeaders){aE.setRequestHeader("X-Atmosphere-Framework",a.util.version);
aE.setRequestHeader("X-Atmosphere-Transport",aF.transport);
if(aE.heartbeat!==null&&aE.heartbeat.server!==null){aE.setRequestHeader("X-Heartbeat-Server",aE.heartbeat.server)
}if(aF.trackMessageLength){aE.setRequestHeader("X-Atmosphere-TrackMessageSize","true")
}aE.setRequestHeader("X-Atmosphere-tracking-id",aF.uuid);
a.util.each(aF.headers,function(aG,aI){var aH=a.util.isFunction(aI)?aI.call(this,aE,aF,aD,an):aI;
if(aH!=null){aE.setRequestHeader(aG,aH)
}})
}if(aF.contentType!==""){aE.setRequestHeader("Content-Type",aF.contentType)
}}function ai(aD,aE,aF){if(aE.reconnect||(aE.suspend&&u)){var aC=0;
if(aD&&aD.readyState>1){aC=aD.status>1000?0:aD.status
}an.status=aC===0?204:aC;
an.reason=aC===0?"Server resumed the connection or down.":"OK";
clearTimeout(aE.id);
if(aE.reconnectId){clearTimeout(aE.reconnectId);
delete aE.reconnectId
}if(aF>0){p.reconnectId=setTimeout(function(){I(aE)
},aF)
}else{I(aE)
}}}function q(aC){aC.state="re-connecting";
ag(aC)
}function al(aC){aC.state="openAfterResume";
ag(aC);
aC.state="messageReceived"
}function M(aC){if(aC.transport!=="polling"){n=Y(aC);
n.open()
}else{Y(aC).open()
}}function Y(aE){var aD=p;
if((aE!=null)&&(typeof(aE)!=="undefined")){aD=aE
}var aJ=aD.transport;
var aI=0;
var aC=new window.XDomainRequest();
var aG=function(){if(aD.transport==="long-polling"&&(aD.reconnect&&(aD.maxRequest===-1||aD.requestCount++<aD.maxRequest))){aC.status=200;
M(aD)
}};
var aH=aD.rewriteURL||function(aL){var aK=/(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
switch(aK&&aK[1]){case"JSESSIONID":return aL.replace(/;jsessionid=[^\?]*|(\?)|$/,";jsessionid="+aK[2]+"$1");
case"PHPSESSID":return aL.replace(/\?PHPSESSID=[^&]*&?|\?|$/,"?PHPSESSID="+aK[2]+"&").replace(/&$/,"")
}return aL
};
aC.onprogress=function(){aF(aC)
};
aC.onerror=function(){if(aD.transport!=="polling"){k();
if(au++<aD.maxReconnectOnClose){if(aD.reconnectInterval>0){aD.reconnectId=setTimeout(function(){S("re-connecting",aE.transport,aE);
M(aD)
},aD.reconnectInterval)
}else{S("re-connecting",aE.transport,aE);
M(aD)
}}else{Q(0,"maxReconnectOnClose reached")
}}};
aC.onload=function(){};
var aF=function(aK){clearTimeout(aD.id);
var aM=aK.responseText;
aM=aM.substring(aI);
aI+=aM.length;
if(aJ!=="polling"){j(aD);
var aL=r(aM,aD,an);
if(aJ==="long-polling"&&a.util.trim(aM).length===0){return
}if(aD.executeCallbackBeforeReconnect){aG()
}if(!aL){l(an.responseBody,"messageReceived",200,aJ)
}if(!aD.executeCallbackBeforeReconnect){aG()
}}};
return{open:function(){var aK=aD.url;
if(aD.dispatchUrl!=null){aK+=aD.dispatchUrl
}aK=o(aD,aK);
aC.open(aD.method,aH(aK));
if(aD.method==="GET"){aC.send()
}else{aC.send(aD.data)
}if(aD.connectTimeout>0){aD.id=setTimeout(function(){if(aD.requestCount===0){k();
l("Connect timeout","closed",200,aD.transport)
}},aD.connectTimeout)
}},close:function(){aC.abort()
}}
}function aw(aC){n=X(aC);
n.open()
}function X(aF){var aE=p;
if((aF!=null)&&(typeof(aF)!=="undefined")){aE=aF
}var aD;
var aG=new window.ActiveXObject("htmlfile");
aG.open();
aG.close();
var aC=aE.url;
if(aE.dispatchUrl!=null){aC+=aE.dispatchUrl
}if(aE.transport!=="polling"){an.transport=aE.transport
}return{open:function(){var aH=aG.createElement("iframe");
aC=o(aE);
if(aE.data!==""){aC+="&X-Atmosphere-Post-Body="+encodeURIComponent(aE.data)
}aC=a.util.prepareURL(aC);
aH.src=aC;
aG.body.appendChild(aH);
var aI=aH.contentDocument||aH.contentWindow.document;
aD=a.util.iterate(function(){try{if(!aI.firstChild){return
}var aL=aI.body?aI.body.lastChild:aI;
var aN=function(){var aP=aL.cloneNode(true);
aP.appendChild(aI.createTextNode("."));
var aO=aP.innerText;
aO=aO.substring(0,aO.length-1);
return aO
};
if(!aI.body||!aI.body.firstChild||aI.body.firstChild.nodeName.toLowerCase()!=="pre"){var aK=aI.head||aI.getElementsByTagName("head")[0]||aI.documentElement||aI;
var aJ=aI.createElement("script");
aJ.text="document.write('<plaintext>')";
aK.insertBefore(aJ,aK.firstChild);
aK.removeChild(aJ);
aL=aI.body.lastChild
}if(aE.closed){aE.isReopen=true
}aD=a.util.iterate(function(){var aP=aN();
if(aP.length>aE.lastIndex){j(p);
an.status=200;
an.error=null;
aL.innerText="";
var aO=r(aP,aE,an);
if(aO){return""
}l(an.responseBody,"messageReceived",200,aE.transport)
}aE.lastIndex=0;
if(aI.readyState==="complete"){aa(true);
S("re-connecting",aE.transport,aE);
if(aE.reconnectInterval>0){aE.reconnectId=setTimeout(function(){aw(aE)
},aE.reconnectInterval)
}else{aw(aE)
}return false
}},null);
return false
}catch(aM){an.error=true;
S("re-connecting",aE.transport,aE);
if(au++<aE.maxReconnectOnClose){if(aE.reconnectInterval>0){aE.reconnectId=setTimeout(function(){aw(aE)
},aE.reconnectInterval)
}else{aw(aE)
}}else{Q(0,"maxReconnectOnClose reached")
}aG.execCommand("Stop");
aG.close();
return false
}})
},close:function(){if(aD){aD()
}aG.execCommand("Stop");
aa(true)
}}
}function t(aC){if(at!=null){C(aC)
}else{if(y!=null||ac!=null){L(aC)
}else{if(n!=null){i(aC)
}else{if(U!=null){z(aC)
}else{if(ar!=null){T(aC)
}else{Q(0,"No suspended connection available");
a.util.error("No suspended connection available. Make sure atmosphere.subscribe has been called and request.onOpen invoked before invoking this method")
}}}}}}function ah(aD,aC){if(!aC){aC=w(aD)
}aC.transport="polling";
aC.method="GET";
aC.withCredentials=false;
aC.reconnect=false;
aC.force=true;
aC.suspend=false;
aC.timeout=1000;
I(aC)
}function C(aC){at.send(aC)
}function am(aD){if(aD.length===0){return
}try{if(at){at.localSend(aD)
}else{if(h){h.signal("localMessage",a.util.stringifyJSON({id:O,event:aD}))
}}}catch(aC){a.util.error(aC)
}}function L(aD){var aC=w(aD);
I(aC)
}function i(aD){if(p.enableXDR&&a.util.checkCORSSupport()){var aC=w(aD);
aC.reconnect=false;
ax(aC)
}else{L(aD)
}}function z(aC){L(aC)
}function K(aC){var aD=aC;
if(typeof(aD)==="object"){aD=aC.data
}return aD
}function w(aD){var aE=K(aD);
var aC={connected:false,timeout:60000,method:"POST",url:p.url,contentType:p.contentType,headers:p.headers,reconnect:true,callback:null,data:aE,suspend:false,maxRequest:-1,logLevel:"info",requestCount:0,withCredentials:p.withCredentials,async:p.async,transport:"polling",isOpen:true,attachHeadersAsQueryString:true,enableXDR:p.enableXDR,uuid:p.uuid,dispatchUrl:p.dispatchUrl,enableProtocol:false,messageDelimiter:"|",trackMessageLength:p.trackMessageLength,maxReconnectOnClose:p.maxReconnectOnClose,heartbeatTimer:p.heartbeatTimer,heartbeat:p.heartbeat};
if(typeof(aD)==="object"){aC=a.util.extend(aC,aD)
}return aC
}function T(aC){var aF=a.util.isBinary(aC)?aC:K(aC);
var aD;
try{if(p.dispatchUrl!=null){aD=p.webSocketPathDelimiter+p.dispatchUrl+p.webSocketPathDelimiter+aF
}else{aD=aF
}if(!ar.canSendMessage){a.util.error("WebSocket not connected.");
return
}ar.send(aD)
}catch(aE){ar.onclose=function(aG){};
k();
av("Websocket failed. Downgrading to Comet and resending "+aC);
L(aC)
}}function D(aD){var aC=a.util.parseJSON(aD);
if(aC.id!==O){if(typeof(p.onLocalMessage)!=="undefined"){p.onLocalMessage(aC.event)
}else{if(typeof(a.util.onLocalMessage)!=="undefined"){a.util.onLocalMessage(aC.event)
}}}}function l(aF,aC,aD,aE){an.responseBody=aF;
an.transport=aE;
an.status=aD;
an.state=aC;
ae()
}function E(aC,aE){if(!aE.readResponsesHeaders){if(!aE.enableProtocol){aE.uuid=O
}}else{try{var aD=aC.getResponseHeader("X-Atmosphere-tracking-id");
if(aD&&aD!=null){aE.uuid=aD.split(" ").pop()
}}catch(aF){}}}function ag(aC){m(aC,p);
m(aC,a.util)
}function m(aD,aE){switch(aD.state){case"messageReceived":au=0;
if(typeof(aE.onMessage)!=="undefined"){aE.onMessage(aD)
}if(typeof(aE.onmessage)!=="undefined"){aE.onmessage(aD)
}break;
case"error":if(typeof(aE.onError)!=="undefined"){aE.onError(aD)
}if(typeof(aE.onerror)!=="undefined"){aE.onerror(aD)
}break;
case"opening":delete p.closed;
if(typeof(aE.onOpen)!=="undefined"){aE.onOpen(aD)
}if(typeof(aE.onopen)!=="undefined"){aE.onopen(aD)
}break;
case"messagePublished":if(typeof(aE.onMessagePublished)!=="undefined"){aE.onMessagePublished(aD)
}break;
case"re-connecting":if(typeof(aE.onReconnect)!=="undefined"){aE.onReconnect(p,aD)
}break;
case"closedByClient":if(typeof(aE.onClientTimeout)!=="undefined"){aE.onClientTimeout(p)
}break;
case"re-opening":delete p.closed;
if(typeof(aE.onReopen)!=="undefined"){aE.onReopen(p,aD)
}break;
case"fail-to-reconnect":if(typeof(aE.onFailureToReconnect)!=="undefined"){aE.onFailureToReconnect(p,aD)
}break;
case"unsubscribe":case"closed":var aC=typeof(p.closed)!=="undefined"?p.closed:false;
if(!aC){if(typeof(aE.onClose)!=="undefined"){aE.onClose(aD)
}if(typeof(aE.onclose)!=="undefined"){aE.onclose(aD)
}}p.closed=true;
break;
case"openAfterResume":if(typeof(aE.onOpenAfterResume)!=="undefined"){aE.onOpenAfterResume(p)
}break
}}function aa(aC){if(an.state!=="closed"){an.state="closed";
an.responseBody="";
an.messages=[];
an.status=!aC?501:200;
ae()
}}function ae(){var aE=function(aH,aI){aI(an)
};
if(at==null&&N!=null){N(an.responseBody)
}p.reconnect=p.mrequest;
var aC=typeof(an.responseBody)==="string";
var aF=(aC&&p.trackMessageLength)?(an.messages.length>0?an.messages:[""]):new Array(an.responseBody);
for(var aD=0;
aD<aF.length;
aD++){if(aF.length>1&&aF[aD].length===0){continue
}an.responseBody=(aC)?a.util.trim(aF[aD]):aF[aD];
if(at==null&&N!=null){N(an.responseBody)
}if(an.responseBody.length===0&&an.state==="messageReceived"){continue
}ag(an);
if(f.length>0){if(p.logLevel==="debug"){a.util.debug("Invoking "+f.length+" global callbacks: "+an.state)
}try{a.util.each(f,aE)
}catch(aG){a.util.log(p.logLevel,["Callback exception"+aG])
}}if(typeof(p.callback)==="function"){if(p.logLevel==="debug"){a.util.debug("Invoking request callbacks")
}try{p.callback(an)
}catch(aG){a.util.log(p.logLevel,["Callback exception"+aG])
}}}}this.subscribe=function(aC){aj(aC);
W()
};
this.execute=function(){W()
};
this.close=function(){F()
};
this.disconnect=function(){B()
};
this.getUrl=function(){return p.url
};
this.push=function(aE,aD){if(aD!=null){var aC=p.dispatchUrl;
p.dispatchUrl=aD;
t(aE);
p.dispatchUrl=aC
}else{t(aE)
}};
this.getUUID=function(){return p.uuid
};
this.pushLocal=function(aC){am(aC)
};
this.enableProtocol=function(aC){return p.enableProtocol
};
this.request=p;
this.response=an
}};
a.subscribe=function(h,k,j){if(typeof(k)==="function"){a.addCallback(k)
}if(typeof(h)!=="string"){j=h
}else{j.url=h
}e=((typeof(j)!=="undefined")&&typeof(j.uuid)!=="undefined")?j.uuid:0;
var i=new a.AtmosphereRequest(j);
i.execute();
g[g.length]=i;
return i
};
a.unsubscribe=function(){if(g.length>0){var h=[].concat(g);
for(var k=0;
k<h.length;
k++){var j=h[k];
j.close();
clearTimeout(j.response.request.id);
if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}}}g=[];
f=[]
};
a.unsubscribeUrl=function(j){var h=-1;
if(g.length>0){for(var l=0;
l<g.length;
l++){var k=g[l];
if(k.getUrl()===j){k.close();
clearTimeout(k.response.request.id);
if(k.heartbeatTimer){clearTimeout(k.heartbeatTimer)
}h=l;
break
}}}if(h>=0){g.splice(h,1)
}};
a.addCallback=function(h){if(a.util.inArray(h,f)===-1){f.push(h)
}};
a.removeCallback=function(i){var h=a.util.inArray(i,f);
if(h!==-1){f.splice(h,1)
}};
a.util={browser:{},parseHeaders:function(i){var h,k=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,j={};
while(h=k.exec(i)){j[h[1]]=h[2]
}return j
},now:function(){return new Date().getTime()
},isArray:function(h){return Object.prototype.toString.call(h)==="[object Array]"
},inArray:function(k,l){if(!Array.prototype.indexOf){var h=l.length;
for(var j=0;
j<h;
++j){if(l[j]===k){return j
}}return -1
}return l.indexOf(k)
},isBinary:function(h){return/^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call(h))
},isFunction:function(h){return Object.prototype.toString.call(h)==="[object Function]"
},getAbsoluteURL:function(h){var i=document.createElement("div");
i.innerHTML='<a href="'+h+'"/>';
return encodeURI(decodeURI(i.firstChild.href))
},prepareURL:function(i){var j=a.util.now();
var h=i.replace(/([?&])_=[^&]*/,"$1_="+j);
return h+(h===i?(/\?/.test(i)?"&":"?")+"_="+j:"")
},trim:function(h){if(!String.prototype.trim){return h.toString().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"").replace(/\s+/g," ")
}else{return h.toString().trim()
}},param:function(l){var j,h=[];
function k(m,n){n=a.util.isFunction(n)?n():(n==null?"":n);
h.push(encodeURIComponent(m)+"="+encodeURIComponent(n))
}function i(n,o){var m;
if(a.util.isArray(o)){a.util.each(o,function(q,p){if(/\[\]$/.test(n)){k(n,p)
}else{i(n+"["+(typeof p==="object"?q:"")+"]",p)
}})
}else{if(Object.prototype.toString.call(o)==="[object Object]"){for(m in o){i(n+"["+m+"]",o[m])
}}else{k(n,o)
}}}for(j in l){i(j,l[j])
}return h.join("&").replace(/%20/g,"+")
},storage:function(){try{return !!(window.localStorage&&window.StorageEvent)
}catch(h){return false
}},iterate:function(j,i){var k;
i=i||0;
(function h(){k=setTimeout(function(){if(j()===false){return
}h()
},i)
})();
return function(){clearTimeout(k)
}
},each:function(n,o,j){if(!n){return
}var m,k=0,l=n.length,h=a.util.isArray(n);
if(j){if(h){for(;
k<l;
k++){m=o.apply(n[k],j);
if(m===false){break
}}}else{for(k in n){m=o.apply(n[k],j);
if(m===false){break
}}}}else{if(h){for(;
k<l;
k++){m=o.call(n[k],k,n[k]);
if(m===false){break
}}}else{for(k in n){m=o.call(n[k],k,n[k]);
if(m===false){break
}}}}return n
},extend:function(l){var k,j,h;
for(k=1;
k<arguments.length;
k++){if((j=arguments[k])!=null){for(h in j){l[h]=j[h]
}}}return l
},on:function(j,i,h){if(j.addEventListener){j.addEventListener(i,h,false)
}else{if(j.attachEvent){j.attachEvent("on"+i,h)
}}},off:function(j,i,h){if(j.removeEventListener){j.removeEventListener(i,h,false)
}else{if(j.detachEvent){j.detachEvent("on"+i,h)
}}},log:function(j,i){if(window.console){var h=window.console[j];
if(typeof h==="function"){h.apply(window.console,i)
}}},warn:function(){a.util.log("warn",arguments)
},info:function(){a.util.log("info",arguments)
},debug:function(){a.util.log("debug",arguments)
},error:function(){a.util.log("error",arguments)
},xhr:function(){try{return new window.XMLHttpRequest()
}catch(i){try{return new window.ActiveXObject("Microsoft.XMLHTTP")
}catch(h){}}},parseJSON:function(h){return !h?null:window.JSON&&window.JSON.parse?window.JSON.parse(h):new Function("return "+h)()
},stringifyJSON:function(j){var m=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,k={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function h(n){return'"'+n.replace(m,function(o){var p=k[o];
return typeof p==="string"?p:"\\u"+("0000"+o.charCodeAt(0).toString(16)).slice(-4)
})+'"'
}function i(o){return o<10?"0"+o:o
}return window.JSON&&window.JSON.stringify?window.JSON.stringify(j):(function l(s,r){var q,p,n,o,u=r[s],t=typeof u;
if(u&&typeof u==="object"&&typeof u.toJSON==="function"){u=u.toJSON(s);
t=typeof u
}switch(t){case"string":return h(u);
case"number":return isFinite(u)?String(u):"null";
case"boolean":return String(u);
case"object":if(!u){return"null"
}switch(Object.prototype.toString.call(u)){case"[object Date]":return isFinite(u.valueOf())?'"'+u.getUTCFullYear()+"-"+i(u.getUTCMonth()+1)+"-"+i(u.getUTCDate())+"T"+i(u.getUTCHours())+":"+i(u.getUTCMinutes())+":"+i(u.getUTCSeconds())+'Z"':"null";
case"[object Array]":n=u.length;
o=[];
for(q=0;
q<n;
q++){o.push(l(q,u)||"null")
}return"["+o.join(",")+"]";
default:o=[];
for(q in u){if(b.call(u,q)){p=l(q,u);
if(p){o.push(h(q)+":"+p)
}}}return"{"+o.join(",")+"}"
}}})("",{"":j})
},checkCORSSupport:function(){if(a.util.browser.msie&&!window.XDomainRequest&&+a.util.browser.version.split(".")[0]<11){return true
}else{if(a.util.browser.opera&&+a.util.browser.version.split(".")<12){return true
}else{if(a.util.trim(navigator.userAgent).slice(0,16)==="KreaTVWebKit/531"){return true
}else{if(a.util.trim(navigator.userAgent).slice(-7).toLowerCase()==="kreatel"){return true
}}}}var h=navigator.userAgent.toLowerCase();
var i=h.indexOf("android")>-1;
if(i){return true
}return false
}};
d=a.util.now();
(function(){var i=navigator.userAgent.toLowerCase(),h=/(chrome)[ \/]([\w.]+)/.exec(i)||/(webkit)[ \/]([\w.]+)/.exec(i)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(i)||/(msie) ([\w.]+)/.exec(i)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(i)||i.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i)||[];
a.util.browser[h[1]||""]=true;
a.util.browser.version=h[2]||"0";
if(a.util.browser.trident){a.util.browser.msie=true
}if(a.util.browser.msie||(a.util.browser.mozilla&&+a.util.browser.version.split(".")[0]===1)){a.util.storage=false
}})();
a.util.on(window,"unload",function(h){a.unsubscribe()
});
a.util.on(window,"keypress",function(h){if(h.charCode===27||h.keyCode===27){if(h.preventDefault){h.preventDefault()
}}});
a.util.on(window,"offline",function(){if(g.length>0){var h=[].concat(g);
for(var k=0;
k<h.length;
k++){var j=h[k];
j.close();
clearTimeout(j.response.request.id);
if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}}}});
a.util.on(window,"online",function(){if(g.length>0){for(var h=0;
h<g.length;
h++){g[h].execute()
}}});
return a
}));