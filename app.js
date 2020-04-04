//import { EffectComposer } from "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/postprocessing/EffectComposer.js"
//import * as THREE from './vendor/three/three.module';
import * as THREE from "/build/three.module.js";
import { OrbitControls } from '/examples/jsm/controls/OrbitControls.js';
import { AsciiEffect } from '/examples/jsm/effects/AsciiEffect.js';
///// global
var container;
var scene;
var camera;
var renderer;
var controls;
var mesh;
var effect;
var ground;
var meshes = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
///// Main function 
function Main() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#scene-container' );
  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener('click',onMouseClick);

  createScene();
  createCamera();
  //createMeshes('textures/uv_test_bw.png');
  ground = createMeshes('textures/tex.png');
  ground.position.set(0,-5,0);
  ground.scale.set(20,1,20);
  createLights();
  createControls();
  createRenderer();

  effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
  effect.setSize( window.innerWidth, window.innerHeight );
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'black';

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

  document.body.appendChild( effect.domElement );

  //

  window.addEventListener( 'resize', onWindowResize, false );



  renderLoop();
  
} onload = Main;

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  effect.setSize( window.innerWidth, window.innerHeight );

}


function onMouseClick(){
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  if(intersects.length > 0 && intersects[0].object == ground){
    var newMesh = createMeshes('textures/uv_test_bw.png');
    newMesh.position.set(intersects[0].point.x, intersects[0].point.y + 1, intersects[0].point.z)
  }

}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function createMeshes(url) {
  const texture = createTexture(url);
  // create a geometry
  mesh = createCube();
  mesh.material.map = texture;
  mesh.scale.set(2, 2, 2);
  mesh.castShadow = true; //default is false
  mesh.receiveShadow = true; //default
  // add the mesh to the scene
  scene.add(mesh);
  meshes.push(mesh);
  return mesh;
}

function createLights() {

  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // sky color
    0x202020, // ground color
    5, // intensity
  );

  const light = new THREE.DirectionalLight(0xffffff, 5.0);
  // move the light back and up a bit
  light.position.set(10, 10, 10);
  light.rotation.set(0.4,0,0);

  // remember to add the light to the scene
  scene.add(ambientLight,light);

  light.castShadow = true; 
  light.shadow.mapSize.width = 512;  // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500;     // default
}

function update(deltaTime) {


}

function render() {
  effect.render(scene, camera);
}


function renderLoop() {
  var then = 0;
  // Draw the scene repeatedly
  renderer.setAnimationLoop((now) => {
    //calculate deltaTime
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    update(deltaTime);
    render();
  });
}

function createTexture(src) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(src);
  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;
  // reduce blurring at glancing angles
  texture.anisotropy = 16;
  return texture;
}


function createCube() {
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  // create a default (white) Basic material
  const material = new THREE.MeshStandardMaterial();
  // create a Mesh containing the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createScene() {
  scene = new THREE.Scene();
  // Set the background color
  scene.background = new THREE.Color('skyblue');

}

function createCamera() {
  const fov = 35; // AKA Field of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(-4, 4, 10);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);


  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // add the automatically created <canvas> element to the page
  //container.appendChild(renderer.domElement);
}



