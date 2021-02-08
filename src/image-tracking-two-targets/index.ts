import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs";

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded
let manager = new ZapparThree.LoadingManager();

// Setup ThreeJS in the usual way
let renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Setup a Zappar camera instead of one of ThreeJS's cameras
let camera = new ZapparThree.Camera();

// The Zappar library needs your WebGL context, so pass it
ZapparThree.glContextSet(renderer.getContext());

// Create a ThreeJS Scene and set its background to be the camera background texture
let scene = new THREE.Scene();
scene.background = camera.backgroundTexture;

// Request the necessary permission from the user
ZapparThree.permissionRequestUI().then(function(granted) {
    if (granted) camera.start();
    else ZapparThree.permissionDeniedUI();
});

// Set up our image tracker groups
// Pass our loading manager in to ensure the progress bar works correctly
let tracker1 = new ZapparThree.ImageTrackerLoader(manager).load(require("file-loader!../assets/two-targets/target1.zpt").default);
let tracker2 = new ZapparThree.ImageTrackerLoader(manager).load(require("file-loader!../assets/two-targets/target2.zpt").default);
let trackerGroup1 = new ZapparThree.ImageAnchorGroup(camera, tracker1);
let trackerGroup2 = new ZapparThree.ImageAnchorGroup(camera, tracker2);
scene.add(trackerGroup1);
scene.add(trackerGroup2);
// Add some content
let box1 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshBasicMaterial()
);
let box2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshBasicMaterial()
);
box1.position.set(0, 0, 0.5);
box2.position.set(0, 0, 0.5);

trackerGroup1.add(box1);
trackerGroup2.add(box2);

// Set up our render loop
function render() {
    requestAnimationFrame(render);
    camera.updateFrame(renderer);

    renderer.render(scene, camera);
}

requestAnimationFrame(render);
