var dae, skin;
var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae, skin;
var controls;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'collada/WestVillage_&comps_cleaned.dae', function ( collada ) {

	dae = collada.scene;
	// skin = collada.skins[ 0 ];

	dae.scale.x = dae.scale.y = dae.scale.z = 1;
	dae.updateMatrix();

	init();
	animate();
} );


function init(){
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 2, 2, 3 );

	scene = new THREE.Scene(); 

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	scene.add( new THREE.AmbientLight( 0xFF0000 );

	// Add the COLLADA
	scene.add( dae );

	// Add the controls
	controls = new THREE.OrbitControls( camera );
}

// particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
// scene.add( particleLight );

var t = 0;
var clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );

	render();
}

function render() {

	var timer = Date.now() * 0.0005;

	camera.position.x = 10;
	camera.position.y = 10;
	camera.position.z = 10;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );
}