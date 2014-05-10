!function t(n,e,i){function o(r,c){if(!e[r]){if(!n[r]){var a="function"==typeof require&&require;if(!c&&a)return a(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+r+"'")}var l=e[r]={exports:{}};n[r][0].call(l.exports,function(t){var e=n[r][1][t];return o(e?e:t)},l,l.exports,t,n,e,i)}return e[r].exports}for(var s="function"==typeof require&&require,r=0;r<i.length;r++)o(i[r]);return o}({1:[function(t,n){"use strict";function e(n,s){return this instanceof e?(n instanceof i||(s=n,n=void 0),this.options=s||{},this.options.path=this.options.path||"",this.options.signaling=n||t("../lib/signal-local.js"),this.signalingChannel=this.options.signaling(this.options),this.p2p=o({signaling:n}),this.p2p.on("ready",this.emit.bind(this,"ready")),void i.call(this)):new e(s)}var i=t("wildemitter"),o=t("./p2p.js");e.prototype=new i,e.prototype.send=function(){},n.exports=e},{"../lib/signal-local.js":5,"./p2p.js":4,wildemitter:7}],2:[function(t,n){"use strict";function e(t,n,o,s){return this instanceof e?(this.src=t,this.dst=n,this.connection=o,s&&o.on("open",function(){this.startNegotiating()}.bind(this)),void i.call(this)):new e(t,n)}var i=t("wildemitter"),o=t("./webrtc-shim.js");e.prototype=new i,e.prototype.startNegotiating=function(){var n=this;this.peerConnection=new o.PeerConnection(t("./p2p-iceServers.js"),{optional:[{RtpDataChannels:!0}]}),this._setupChannel(this.peerConnection.createDataChannel("sendDataChannel",{reliable:!1})),this.peerConnection.onicecandidate=function(t){return t.candidate?(n.connection.send("icecandidate",JSON.stringify(t.candidate)),void(n.peerConnection.onicecandidate=null)):void console.error("Failed to get ICE candidate!",t)},this.peerConnection.createOffer(function(t){n.peerConnection.setLocalDescription(t),n.connection.send("offer",JSON.stringify(t))},n.emit.bind(n,"error"))},e.prototype._setupChannel=function(t){this.channel=t,this.channel.onmessage=this.emit.bind(this,"message"),this.channel.onopen=this.emit.bind(this,"open"),this.channel.onclose=this.emit.bind(this,"close")},e.prototype._onDataChannel=function(t){this._setupChannel(t.channel)},e.prototype.icecandidate=function(t){var n=new o.IceCandidate(JSON.parse(t));this.peerConnection.addIceCandidate(n)},e.prototype.offer=function(n){var e=this;n=new o.SessionDescription(JSON.parse(n)),e.peerConnection=new o.PeerConnection(t("./p2p-iceServers.js"),{optional:[{RtpDataChannels:!0}]}),e.peerConnection.ondatachannel=e._onDataChannel.bind(e),e.peerConnection.setRemoteDescription(n),e.peerConnection.onicecandidate=function(t){return t.candidate?(e.connection.send("icecandidate",JSON.stringify(t.candidate)),void(e.peerConnection.onicecandidate=null)):void console.error("Failed to get ICE candidate!",t)},e.peerConnection.createAnswer(function(t){e.peerConnection.setLocalDescription(t),e.connection.send("answer",JSON.stringify(t))},e.emit.bind(e,"error"))},e.prototype.answer=function(t){t=new o.SessionDescription(JSON.parse(t)),this.peerConnection.setRemoteDescription(t)},e.prototype.send=function(t){this.channel.send(t)},n.exports=e},{"./p2p-iceServers.js":3,"./webrtc-shim.js":6,wildemitter:7}],3:[function(t,n){n.exports={iceServers:[{url:"stun:stun01.sipphone.com"},{url:"stun:stun.ekiga.net"},{url:"stun:stun.fwdnet.net"},{url:"stun:stun.ideasip.com"},{url:"stun:stun.iptel.org"},{url:"stun:stun.rixtelecom.se"},{url:"stun:stun.schlund.de"},{url:"stun:stun.l.google.com:19302"},{url:"stun:stun1.l.google.com:19302"},{url:"stun:stun2.l.google.com:19302"},{url:"stun:stun3.l.google.com:19302"},{url:"stun:stun4.l.google.com:19302"},{url:"stun:stunserver.org"},{url:"stun:stun.softjoys.com"},{url:"stun:stun.voiparound.com"},{url:"stun:stun.voipbuster.com"},{url:"stun:stun.voipstunt.com"},{url:"stun:stun.voxgratia.org"},{url:"stun:stun.xten.com"}]}},{}],4:[function(t,n){"use strict";function e(n){if(!(this instanceof e))return new e(n);this.options=n||{},this.options.signaling=this.options.signaling||t("../lib/signal-local.js"),this.signalingChannel=this.options.signaling({host:this.options.host,port:this.options.port}),this.peers={};var o=this;this.signalingChannel.on("ready",function(t){o.id=t,o.emit("ready")}),this.signalingChannel.on("message",this.dispatch.bind(this)),i.call(this)}var i=t("wildemitter"),o=t("./p2p-connection.js");e.prototype=new i,e.prototype.dispatch=function(t,n){if(!this.peers[n]){var e=this.signalingChannel.connect(n);this.peers[n]=new o(this.id,n,e),this.emit("connection",this.peers[n]),this.peers[n].on("close",function(){delete this.peers[n]})}var i=this.peers[n];t.type||(t={type:"message",msg:t}),i[t.type].call(i,t.msg)},e.prototype.connect=function(t){var n=this,e=this.signalingChannel.connect(t),i=n.peers[t]=new o(n.id,t,e,!0);return i},n.exports=e},{"../lib/signal-local.js":5,"./p2p-connection.js":2,wildemitter:7}],5:[function(t,n){"use strict";function e(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function i(t){if(t=t||{},!(this instanceof i))return new i(t);"string"==typeof t&&(t={id:t}),t.id=t.id||e(),this.options=t,this.id=this.options.id;for(var n in r)r[n].emit("connected",this.id);r[this.id]=this,s.call(this),setTimeout(this.emit.bind(this,"ready",this.id),10)}function o(t,n){return this instanceof o?(this.src=t,this.dst=n,void s.call(this)):new o(t,n)}var s=t("wildemitter"),r={};i.prototype=new s,i.prototype.connect=function(t){var n=new o(this.id,t);return setTimeout(n.emit.bind(n,"open"),10),n},i.prototype.close=function(){delete r[this.id];for(var t in r)r[t].emit("disconnected",this.id)},o.prototype=new s,o.prototype.send=function(t,n){n=n?{type:t,msg:n}:t,r[this.dst].emit("message",n,this.src)},o.prototype.close=function(){},n.exports=i},{wildemitter:7}],6:[function(t,n){n.exports={PeerConnection:window.mozRTCPeerConnection||window.webkitRTCPeerConnection,IceCandidate:window.mozRTCIceCandidate||window.RTCIceCandidate,SessionDescription:window.mozRTCSessionDescription||window.RTCSessionDescription}},{}],7:[function(t,n){function e(){this.callbacks={}}n.exports=e,e.prototype.on=function(t){var n=3===arguments.length,e=n?arguments[1]:void 0,i=n?arguments[2]:arguments[1];return i._groupName=e,(this.callbacks[t]=this.callbacks[t]||[]).push(i),this},e.prototype.once=function(t){function n(){e.off(t,n),s.apply(this,arguments)}var e=this,i=3===arguments.length,o=i?arguments[1]:void 0,s=i?arguments[2]:arguments[1];return this.on(t,o,n),this},e.prototype.releaseGroup=function(t){var n,e,i,o;for(n in this.callbacks)for(o=this.callbacks[n],e=0,i=o.length;i>e;e++)o[e]._groupName===t&&(o.splice(e,1),e--,i--);return this},e.prototype.off=function(t,n){var e,i=this.callbacks[t];return i?1===arguments.length?(delete this.callbacks[t],this):(e=i.indexOf(n),i.splice(e,1),this):this},e.prototype.emit=function(t){var n,e,i,o=[].slice.call(arguments,1),s=this.callbacks[t],r=this.getWildcardCallbacks(t);if(s)for(i=s.slice(),n=0,e=i.length;e>n&&i[n];++n)i[n].apply(this,o);if(r)for(e=r.length,i=r.slice(),n=0,e=i.length;e>n&&i[n];++n)i[n].apply(this,[t].concat(o));return this},e.prototype.getWildcardCallbacks=function(t){var n,e,i=[];for(n in this.callbacks)e=n.split("*"),("*"===n||2===e.length&&t.slice(0,e[0].length)===e[0])&&(i=i.concat(this.callbacks[n]));return i}},{}]},{},[1]);