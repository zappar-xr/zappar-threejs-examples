/// Zappar for ThreeJS Examples
/// Face Tracking Face Mesh

// In this example we apply a face-fitting textured mesh
// to the user's face

import * as ZapparThree from "@zappar/zappar-threejs"
import * as THREE from "three";

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded
const manager = new ZapparThree.LoadingManager();

// Construct our ThreeJS renderer and scene as usual
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

// As with a normal ThreeJS scene, resize the canvas if the window resizes
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a Zappar camera that we'll use instead of a ThreeJS camera
const camera = new ZapparThree.Camera();

// In order to use camera and motion data, we need to ask the users for permission
// The Zappar library comes with some UI to help with that, so let's use it
ZapparThree.permissionRequestUI().then(granted => {
    // If the user granted us the permissions we need then we can start the camera
    // Otherwise let's them know that it's necessary with Zappar's permission denied UI
    if (granted) camera.start(true); // true parameter for user facing camera
    else ZapparThree.permissionDeniedUI();
})

// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Create a FaceTracker and a FaceAnchorGroup from it to put our Three content in
// Pass our loading manager in to ensure the progress bar works correctly
const face_tracker = new ZapparThree.FaceTrackerLoader(manager).load()
const face_tracker_group = new ZapparThree.FaceAnchorGroup(camera, face_tracker);

// Add our face tracker group into the ThreeJS scene
scene.add(face_tracker_group);

// Load the face mesh and create a THREE BufferGeometry from it
// Pass our loading manager in to ensure the progress bar works correctly
let faceMesh = new ZapparThree.FaceMeshLoader(manager).load();
let faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);

// Load the face template texture to render on the mesh
// Pass our loading manager in to ensure the progress bar works correctly
let textureLoader = new THREE.TextureLoader(manager);
let faceTexture = textureLoader.load(require("file-loader!../assets/faceMeshTemplate.png").default);
faceTexture.flipY = false;

// Construct a THREE Mesh object from our geometry and texture, and add it to our tracker group
let faceMeshMesh = new THREE.Mesh(faceBufferGeometry, new THREE.MeshStandardMaterial({
    map: faceTexture, transparent: true
}));
face_tracker_group.add(faceMeshMesh);


// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambeintLight = new THREE.AmbientLight("white", 0.4);
scene.add(ambeintLight);

// Hide the 3D content when the face goes out of view
face_tracker_group.faceTracker.onVisible.bind(() => face_tracker_group.visible = true);
face_tracker_group.faceTracker.onNotVisible.bind(() => face_tracker_group.visible = false);

// Use a function to render our scene as usual
function render(): void {
    // The Zappar camera must have updateFrame called every frame
    camera.updateFrame(renderer);
    
    // Each frame, after camera.updateFrame we want to update the mesh geometry
    // with the latest data from the face tracker
    faceBufferGeometry.updateFromFaceAnchorGroup(face_tracker_group);

    // Draw the ThreeJS scene in the usual way, but using the Zappar camera
    renderer.render(scene, camera);

    // Call render() again next frame
    requestAnimationFrame(render);
}

// Start things off
render();
