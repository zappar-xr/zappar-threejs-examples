/// Zappar for ThreeJS Examples
/// Face Tracking 3D Model

// In this example we track a 3D model to the user's face

import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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

// Create a FaceTracker and a FaceAnchorGroup from it
// to put Three content in 
const face_tracker = new ZapparThree.FaceTrackerLoader().load()
const face_tracker_group = new ZapparThree.FaceAnchorGroup(camera, face_tracker);
// Add our face tracker group into the ThreeJS scene
scene.add(face_tracker_group);

// Start with the content group invisible
face_tracker_group.visible = false;


// Get the URL of the "masked_helmet.glb" 3D model
const gltfUrl = require("file-loader!../assets/masked_helmet.glb").default;
// Since we're using webpack, we can use the 'file-loader' to make sure it's
// automatically included in our output folder

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
const gltfLoader = new GLTFLoader();
gltfLoader.load(gltfUrl, (gltf) => {

    // Position the loaded content to overlay user's face
    gltf.scene.position.set(0.3, -1.3, 0);
    gltf.scene.scale.set(1.1, 1.1, 1.1);

    // One of the helmet's children is a 'mask' object that we want
    // to use to hide the elements of the helmet where the user's face
    // should appear. To achieve this, we loop through the meshes in the
    // model, and set the 'colorWrite' material property for the mask to false
    // This, in combination with its render order in the mesh, should achieve
    // the effect we desire
    for (let child of gltf.scene.getObjectByName('Helmet_Mask')!.children as THREE.Mesh[]) {
        (child.material as THREE.Material).colorWrite = false;
    }

    // Add the scene to the tracker group
    face_tracker_group.add(gltf.scene)

}, undefined, () => {
    console.log("An error ocurred loading the GLTF model");
});

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambeintLight = new THREE.AmbientLight("white", 0.4);
scene.add(ambeintLight);

// Hide the 3D content when the face is out of view
face_tracker_group.faceTracker.onVisible.bind(() => face_tracker_group.visible = true);
face_tracker_group.faceTracker.onNotVisible.bind(() => face_tracker_group.visible = false);

// Use a function to render our scene as usual
function render(): void {

    // The Zappar camera must have updateFrame called every frame
    camera.updateFrame(renderer);

    // Draw the ThreeJS scene in the usual way, but using the Zappar camera
    renderer.render(scene, camera);

    // Call render() again next frame
    requestAnimationFrame(render);
}

// Start things off
render();
