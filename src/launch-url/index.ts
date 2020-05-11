/// Zappar for ThreeJS Examples
/// Launch URL

// In this image tracked example we'll use a THREE.Raycaster to detect if 
// the user has tapped a button that's tracked on the image. When they do
// we'll launch a website in a new tab.

import * as THREE from "three";
import * as ZapparThree from "@zappar/zappar-threejs"
import { InteractionHelper } from '../interactionhelper';


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

// The InteractionHelper class let's us listen for when 3D objects
// are tapped on screen. See interactionhelper.ts for its implementation
const interactionHelper = new InteractionHelper(camera, renderer);

// Standard three js loader, will help us check if there are issues loading content.
const loading_manager = new THREE.LoadingManager();
loading_manager.onError = (url) => console.log('There was an error loading ' + url);

// Since we're using webpack, we can use the 'file-loader' to make sure these assets are
// automatically included in our output folder
const font_url = require('file-loader!../assets/fonts/Passion.js').default
const target_url = require("file-loader!../assets/example-tracking-image.zpt").default;
const flyer_url = require("file-loader!../assets/example-tracking-image.png").default;


// Create a zappar image_tracker and wrap it in an image_tracker_group for us
// to put our ThreeJS content into
const image_tracker = new ZapparThree.ImageTrackerLoader(loading_manager).load(target_url);
const image_tracker_group = new ZapparThree.ImageAnchorGroup(camera, image_tracker);
const content_group = new THREE.Group();

// Add our image tracker group into the ThreeJS scene
scene.add(image_tracker_group);

// Create the button's background
const button_background_plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.4),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: new THREE.Color("#DE4C42")
    })
)

// Push it back a little so it does not clip with text we will create.
button_background_plane.position.z = 0.001;

// Loaders are used to load external files
const font_loader = new THREE.FontLoader();
const texture_loader = new THREE.TextureLoader();

// Create a plane geometry mesh, apply the flyer texture and scale it.
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.473, 2.05),
    new THREE.MeshBasicMaterial({
        map: texture_loader.load(flyer_url),
        side: THREE.DoubleSide,
        color: new THREE.Color(0.5, 0.5, 0.5),
    }),
);

// add our content to the tracking group.
content_group.add(plane);

// load the font and size it appropriately.
font_loader.load(font_url, function (font: THREE.Font) {
    const text = new THREE.Mesh(
        new THREE.TextGeometry(
            'Visit Website', { font, size: 0.1, height: 0.01, }).center(),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, color: new THREE.Color("#fff")
        })
    );

    // add the background plane and the text to our tracker group
    content_group.add(text);
    content_group.add(button_background_plane);
});

image_tracker_group.add(content_group);

// Use interaction helper to listen for mouse down events on button_background_plane,
// on mouse down, launch Zappar.com in a new tab.
interactionHelper.addMouseDownListener(button_background_plane, () => {
    window.open("https://www.zappar.com", '_blank');
});

// when we lose sight of the camera, hide the scene contents.
image_tracker.onVisible.bind(() => scene.visible = true)
image_tracker.onNotVisible.bind(() => scene.visible = false)

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