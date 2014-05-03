/* global window */

module.exports = {
	PeerConnection: window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
	IceCandidate: window.mozRTCIceCandidate || window.RTCIceCandidate,
	SessionDescription: window.mozRTCSessionDescription || window.RTCSessionDescription
};

// navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;