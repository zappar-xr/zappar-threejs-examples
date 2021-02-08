/// Zappar for ThreeJS Examples
/// Play animation from button tap

// In this image tracked example we load a 3D model that contains an animation
// that we'll play if the user taps on an on-screen button

import * as ZapparThree from "@zappar/zappar-threejs"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

// Set an error handler on the loader to help us check if there are issues loading content.
manager.onError = (url) => console.log('There was an error loading ' + url);


// Since we're using webpack, we can use the 'file-loader' to make sure these assets are
// automatically included in our output folder
const gltf_url = require("file-loader!../assets/waving.glb").default;
const target_url = require("file-loader!../assets/example-tracking-image.zpt").default;


// Create a zappar image_tracker and wrap it in an image_tracker_group for us
// to put our ThreeJS content into
// Pass our loading manager in to ensure the progress bar works correctly
const image_tracker = new ZapparThree.ImageTrackerLoader(manager).load(target_url);
const image_tracker_group = new ZapparThree.ImageAnchorGroup(camera, image_tracker);

// Add our image tracker group into the ThreeJS scene
scene.add(image_tracker_group);


// Since we're using webpack, we can use the 'file-loader' to make sure these assets are
// automatically included in our output folder

let action: THREE.AnimationAction;
let mixer: THREE.AnimationMixer;

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
let gltfLoader = new GLTFLoader(manager);
gltfLoader.load(gltf_url, gltf => {

    // get the animation and re-declare mixer and action.
    // which will then be triggered on button press
    mixer = new THREE.AnimationMixer(gltf.scene);
    action = mixer.clipAction(gltf.animations[0]);

    // Now the model has been loaded, we can roate it and add it to our image_tracker_group
    image_tracker_group.add(gltf.scene.rotateX(Math.PI / 2));
}, undefined, () => {
    console.log("An error ocurred loading the GLTF model");
});

// Light up our scene with an ambient light
image_tracker_group.add(new THREE.AmbientLight(0xffffff));

// Create a new div element on the document
const button = document.createElement('div');

// Set its class to the 'circle' class we've declared in the CSS of play-animation-from-button-tap.html
button.setAttribute('class', 'circle');

// On click, play the gltf's action
button.onclick = () => { action.play() };

// Append the button to our document's body
document.body.appendChild(button);

// When we lose sight of the camera, hide the scene contents.
image_tracker.onVisible.bind(() => scene.visible = true)
image_tracker.onNotVisible.bind(() => scene.visible = false)

// Used to get deltaTime for our animations.
const clock = new THREE.Clock();

// Use a function to render our scene as usual
function render(): void {

    // If the mixer has been declared, update our animations with delta time
    if (mixer) mixer.update(clock.getDelta());

    // The Zappar camera must have updateFrame called every frame
    camera.updateFrame(renderer);

    // Draw the ThreeJS scene in the usual way, but using the Zappar camera
    renderer.render(scene, camera);

    // Call render() again next frame
    requestAnimationFrame(render);
}

// Start things off
render();
