ss = window.ss || {};

ss.Settings = {
	// categories: ["living", "outside", "workshop", "food", "technology", "play"],
	viewThreshold: 18000,
	maxIblesPerAuthor: 30,
	width: document.body.clientWidth,
	height: document.body.clientHeight,
	cameraDefaultPosition: new THREE.Vector3( 222.3842933874708, 388.94164021652136, 224.33347974950735),
	cameraDefaultTarget: new THREE.Vector3(0, 0, 0),
	cameraDefaultUp: (new THREE.Vector3(0, 0.93, 0.36)).normalize(),
	cameraDefaultFOV: 45
};

ss.Status = {
	cameraAnimating: false,
	firstClick: true,
}