(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
	LocalStorage signaling server - used in tests
*/
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmxvYXRkcm9wL2dyaWQuanMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZmFrZV9iZmI0MTRiMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcblx0TG9jYWxTdG9yYWdlIHNpZ25hbGluZyBzZXJ2ZXIgLSB1c2VkIGluIHRlc3RzXG4qLyJdfQ==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
	WebSocket signaling server - used in production
*/
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmxvYXRkcm9wL2dyaWQuanMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZmFrZV9kY2ZhNmI3YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcblx0V2ViU29ja2V0IHNpZ25hbGluZyBzZXJ2ZXIgLSB1c2VkIGluIHByb2R1Y3Rpb25cbiovIl19

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function Grid(options) {

};
/*
var configuration = { iceServers: [
    {url:'stun:stun01.sipphone.com'},
    {url:'stun:stun.ekiga.net'},
    {url:'stun:stun.fwdnet.net'},
    {url:'stun:stun.ideasip.com'},
    {url:'stun:stun.iptel.org'},
    {url:'stun:stun.rixtelecom.se'},
    {url:'stun:stun.schlund.de'},
    {url:'stun:stun.l.google.com:19302'},
    {url:'stun:stun1.l.google.com:19302'},
    {url:'stun:stun2.l.google.com:19302'},
    {url:'stun:stun3.l.google.com:19302'},
    {url:'stun:stun4.l.google.com:19302'},
    {url:'stun:stunserver.org'},
    {url:'stun:stun.softjoys.com'},
    {url:'stun:stun.voiparound.com'},
    {url:'stun:stun.voipbuster.com'},
    {url:'stun:stun.voipstunt.com'},
    {url:'stun:stun.voxgratia.org'},
    {url:'stun:stun.xten.com'}
], optional: [{ RtpDataChannels: true }]};


Grid.prototype.connect = function connect(id) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.candidate(evt.candidate);
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteView.src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        selfView.src = URL.createObjectURL(stream);
        pc.addStream(stream);
        pc.createOffer(gotDescription);
        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            signalingChannel.send(JSON.stringify({ "sdp": desc }));
        }
    });
}

signalingChannel.onmessage = function (evt) {
    if (!pc)
        start(false);

    var signal = JSON.parse(evt.data);
    if (signal.sdp)
        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    else
        pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
};
*/
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmxvYXRkcm9wL2dyaWQuanMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZmFrZV83YTg0ZWQwNS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBHcmlkKG9wdGlvbnMpIHtcblxufTtcbi8qXG52YXIgY29uZmlndXJhdGlvbiA9IHsgaWNlU2VydmVyczogW1xuICAgIHt1cmw6J3N0dW46c3R1bjAxLnNpcHBob25lLmNvbSd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi5la2lnYS5uZXQnfSxcbiAgICB7dXJsOidzdHVuOnN0dW4uZndkbmV0Lm5ldCd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi5pZGVhc2lwLmNvbSd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi5pcHRlbC5vcmcnfSxcbiAgICB7dXJsOidzdHVuOnN0dW4ucml4dGVsZWNvbS5zZSd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi5zY2hsdW5kLmRlJ30sXG4gICAge3VybDonc3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMid9LFxuICAgIHt1cmw6J3N0dW46c3R1bjEubC5nb29nbGUuY29tOjE5MzAyJ30sXG4gICAge3VybDonc3R1bjpzdHVuMi5sLmdvb2dsZS5jb206MTkzMDInfSxcbiAgICB7dXJsOidzdHVuOnN0dW4zLmwuZ29vZ2xlLmNvbToxOTMwMid9LFxuICAgIHt1cmw6J3N0dW46c3R1bjQubC5nb29nbGUuY29tOjE5MzAyJ30sXG4gICAge3VybDonc3R1bjpzdHVuc2VydmVyLm9yZyd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi5zb2Z0am95cy5jb20nfSxcbiAgICB7dXJsOidzdHVuOnN0dW4udm9pcGFyb3VuZC5jb20nfSxcbiAgICB7dXJsOidzdHVuOnN0dW4udm9pcGJ1c3Rlci5jb20nfSxcbiAgICB7dXJsOidzdHVuOnN0dW4udm9pcHN0dW50LmNvbSd9LFxuICAgIHt1cmw6J3N0dW46c3R1bi52b3hncmF0aWEub3JnJ30sXG4gICAge3VybDonc3R1bjpzdHVuLnh0ZW4uY29tJ31cbl0sIG9wdGlvbmFsOiBbeyBSdHBEYXRhQ2hhbm5lbHM6IHRydWUgfV19O1xuXG5cbkdyaWQucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiBjb25uZWN0KGlkKSB7XG4gICAgcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oY29uZmlndXJhdGlvbik7XG5cbiAgICAvLyBzZW5kIGFueSBpY2UgY2FuZGlkYXRlcyB0byB0aGUgb3RoZXIgcGVlclxuICAgIHBjLm9uaWNlY2FuZGlkYXRlID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBzaWduYWxpbmdDaGFubmVsLmNhbmRpZGF0ZShldnQuY2FuZGlkYXRlKTtcbiAgICB9O1xuXG4gICAgLy8gb25jZSByZW1vdGUgc3RyZWFtIGFycml2ZXMsIHNob3cgaXQgaW4gdGhlIHJlbW90ZSB2aWRlbyBlbGVtZW50XG4gICAgcGMub25hZGRzdHJlYW0gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHJlbW90ZVZpZXcuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChldnQuc3RyZWFtKTtcbiAgICB9O1xuXG4gICAgLy8gZ2V0IHRoZSBsb2NhbCBzdHJlYW0sIHNob3cgaXQgaW4gdGhlIGxvY2FsIHZpZGVvIGVsZW1lbnQgYW5kIHNlbmQgaXRcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgXCJhdWRpb1wiOiB0cnVlLCBcInZpZGVvXCI6IHRydWUgfSwgZnVuY3Rpb24gKHN0cmVhbSkge1xuICAgICAgICBzZWxmVmlldy5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG4gICAgICAgIHBjLmFkZFN0cmVhbShzdHJlYW0pO1xuICAgICAgICBwYy5jcmVhdGVPZmZlcihnb3REZXNjcmlwdGlvbik7XG4gICAgICAgIGZ1bmN0aW9uIGdvdERlc2NyaXB0aW9uKGRlc2MpIHtcbiAgICAgICAgICAgIHBjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYyk7XG4gICAgICAgICAgICBzaWduYWxpbmdDaGFubmVsLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBcInNkcFwiOiBkZXNjIH0pKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5zaWduYWxpbmdDaGFubmVsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoIXBjKVxuICAgICAgICBzdGFydChmYWxzZSk7XG5cbiAgICB2YXIgc2lnbmFsID0gSlNPTi5wYXJzZShldnQuZGF0YSk7XG4gICAgaWYgKHNpZ25hbC5zZHApXG4gICAgICAgIHBjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2lnbmFsLnNkcCkpO1xuICAgIGVsc2VcbiAgICAgICAgcGMuYWRkSWNlQ2FuZGlkYXRlKG5ldyBSVENJY2VDYW5kaWRhdGUoc2lnbmFsLmNhbmRpZGF0ZSkpO1xufTtcbiovIl19
