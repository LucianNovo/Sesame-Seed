
var ss = {};
ss.Settings = {
  viewThreshold: 18000,
  maxIblesPerAuthor: 30,
  width: document.body.clientWidth,
  height: document.body.clientHeight,
  cameraDefaultPosition: new THREE.Vector3( 222.3842933874708, 388.94164021652136, 224.33347974950735),
  cameraDefaultTarget: new THREE.Vector3(0, 0, 0),
  cameraDefaultUp: (new THREE.Vector3(0, 0.93, 0.36)).normalize(),
  cameraDefaultFOV: 45
};

//renderer setup
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor( 0x0000000, 1);
renderer.clear();

//setting up the camera
var fov = 45;
var width  = renderer.domElement.width; 
var height = renderer.domElement.height;

var aspect = width/height;

var near = 1;
var far = 10000;

var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position = ss.Settings.cameraDefaultPosition;
camera.lookAt(ss.Settings.cameraDefaultTarget.x,ss.Settings.cameraDefaultTarget.y,ss.Settings.cameraDefaultTarget.z);


//Controls for user navigation.
var controls; 
controls = new THREE.OrbitControls( camera );
controls.target.set(0,0,0);
controls.addEventListener( 'change', loop );

var scene = new THREE.Scene();
renderer.render(scene, camera);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

init();
function init(){
    // Creating the light
    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    dirLight.position.set( 0, -1, 0 ).normalize();
    scene.add( dirLight );
    dirLight.color.setHSL( 0.1, 0.7, 0.5 );

    //creating the sphere geometry
    var redEmissive = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } );

    var sphereGeom =  new THREE.SphereGeometry( 21, 7, 7 );
    sphereGeom.dynamic = true;
    sphereGeom.normalsNeedUpdate = true; 
    sphereGeom.verticesNeedUpdate = true;
    var blueMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 } );
    var sphere = new THREE.Mesh( sphereGeom, redEmissive );
    scene.add(sphere);

    var clearOrange = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending, opacity: .2 } );

    var sphereGeom2 =  new THREE.SphereGeometry( 80, 7, 7 );
    sphereGeom2.dynamic = true;
    sphereGeom2.normalsNeedUpdate = true; 
    sphereGeom2.verticesNeedUpdate = true;
    var blueMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity:1 } );
    var sphere2 = new THREE.Mesh( sphereGeom2, clearOrange );
    scene.add(sphere2);

    var orangeMat = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } );

    var inner = new TweenMax.to(sphere.scale,8,{x:4,y:4,z:4,repeat:-1,yoyo:true,ease:Quint.easeInOut})

    setInterval(loop, 1000/60);
  }
  function loop(){
    // console.log("here");
    renderer.clear();
    renderer.render(scene,camera);
  }