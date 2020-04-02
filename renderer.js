
document.body.onload = async () => {

	//Create new canvs
	const canvas = document.createElement ("canvas");
	//Fix width and height so encoding is not too expensive
	canvas.height = 64;
	canvas.width = 64;

	//Draw number
	var ctx = canvas.getContext ("2d");

	//Periodically update it
	let num = 0;
	const track = canvas.captureStream ().getTracks ()[0];

	function loopAnimationFrames () {
		var ctx = canvas.getContext ("2d");
		ctx.beginPath ();
		ctx.fillStyle = "white";
		ctx.fillRect (0, 0, 64, 64);
		ctx.fillStyle = "red";
		ctx.font = "32pt Arial";
		ctx.fillText ("0", 20, 48);
		ctx.lineWidth = 6;
		ctx.strokeStyle = 'white';
		ctx.arc (32, 32, 20, 0, 2 * Math.PI);
		ctx.stroke ();
		ctx.beginPath ();
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'black';
		ctx.arc (32, 32, 20, -Math.PI / 2, -Math.PI / 2 + (num++ % 11) * Math.PI / 5);
		ctx.stroke ();

		let start = Date.now ();
		requestAnimationFrame (function () {
			let delta = Date.now () - start;
			if (delta > 33) {
				console.error ('Time since last animation frame exceeds 33ms:', delta);
				document.body.innerHTML += '<div>Time since last animation frame exceeds 33ms:' + delta + '<div>';
			}
			loopAnimationFrames ();
		})
	}

	loopAnimationFrames ();

	//Create pcs
	const sender = window.sender = new RTCPeerConnection ();
	const receiver = window.receiver = new RTCPeerConnection ();

	//Interchange candidates
	sender.onicecandidate = ({candidate}) => candidate && receiver.addIceCandidate (candidate);
	receiver.onicecandidate = ({candidate}) => candidate && sender.addIceCandidate (candidate);
	sender.addTrack (track);

	const offer = await sender.createOffer ();
	await sender.setLocalDescription (offer);
	await receiver.setRemoteDescription (offer);

	const answer = await receiver.createAnswer ();
	await receiver.setLocalDescription (answer);
	await sender.setRemoteDescription (answer);

};
