/// Zappar for ThreeJS Examples
/// Instant Tracking 3D Model

// In this example we track a 3D model using instant world tracking

import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


// The SDK is supported on many different browsers, but there are some that
// don't provide camera access. This function detects if the browser is supported
// For more information on support, check out the readme over at
// https://www.npmjs.com/package/@zappar/zappar-threejs
if (ZapparThree.browserIncompatible()) {
    // The browserIncompatibleUI() function shows a full-page dialog that informs the user
    // they're using an unsupported browser, and provides a button to 'copy' the current page
    // URL so they can 'paste' it into the address bar of a compatible alternative.
    ZapparThree.browserIncompatibleUI();

    // If the browser is not compatible, we can avoid setting up the rest of the page
    // so we throw an exception here.
    throw new Error("Unsupported browser")
}

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded. You can use this if it's helpful, or use
// your own loading UI - it's up to you :-)
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
    if (granted) camera.start();
    else ZapparThree.permissionDeniedUI();
})


// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Create an InstantWorldTracker and wrap it in an InstantWorldAnchorGroup for us
// to put our ThreeJS content into
const instant_tracker = new ZapparThree.InstantWorldTracker();
const instant_tracker_group = new ZapparThree.InstantWorldAnchorGroup(camera, instant_tracker);

// Add our instant tracker group into the ThreeJS scene
scene.add(instant_tracker_group);

// Get the URL of the "waving.glb" 3D model
// Since we're using webpack, we can use the 'file-loader' to make sure it's
// automatically included in our output folder
const gltfUrl = require("file-loader!../assets/waving.glb").default;

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
// Pass our loading manager in to ensure the progress bar works correctly
let gltfLoader = new GLTFLoader(manager);
gltfLoader.load(gltfUrl, gltf => {
    // Now the model has been loaded, we can add it to our instant_tracker_group
    instant_tracker_group.add(gltf.scene);
}, undefined, () => {
    console.log("An error ocurred loading the GLTF model");
});

// Let's add some lighting, first a directional light above the model pointing down
let directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
instant_tracker_group.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
let ambientLight = new THREE.AmbientLight("white", 0.4);
instant_tracker_group.add(ambientLight);

// When the experience loads we'll let the user choose a place in their room for
// the content to appear using setAnchorPoseFromCameraOffset (see below)
// The user can confirm the location by tapping on the screen
let hasPlaced = false;
let placeButton = document.getElementById("tap-to-place") || document.createElement("div");
placeButton.addEventListener("click", () => {
    hasPlaced = true;
    placeButton.remove();
});

// Use a function to render our scene as usual
function render(): void {

    if (!hasPlaced) {
        // If the user hasn't chosen a place in their room yet, update the instant tracker
        // to be directly in front of the user
        instant_tracker_group.setAnchorPoseFromCameraOffset(0, 0, -5);
    }

    // The Zappar camera must have updateFrame called every frame
    camera.updateFrame(renderer);

    // Draw the ThreeJS scene in the usual way, but using the Zappar camera
    renderer.render(scene, camera);

    // Call render() again next frame
    requestAnimationFrame(render);
}

// Start things off
render();