import * as THREE from 'three';

interface ObjectCallbackPair {
    object: THREE.Object3D,
    callback: Function
}

// This class uses a THREE.Raycaster to detect when a user taps on
// an object in 3D space. You can use `addMouseDownListener` to
// register an object for callbacks when it's tapped.

export class InteractionHelper {
    private _camera: THREE.Camera;
    private _raycaster = new THREE.Raycaster();
    private _mouse: THREE.Vector2 = new THREE.Vector2();
    private _domElement : HTMLCanvasElement;

    private objectCallbackPairs: ObjectCallbackPair[] = [];

    constructor(camera: THREE.Camera, renderer: THREE.Renderer) {
        this._domElement = renderer.domElement;
        this._domElement.addEventListener('mousedown', this._search, false);
        this._camera = camera;
    }

    public addMouseDownListener = (object: THREE.Object3D, callback: Function): void => {
        this.objectCallbackPairs.push({
            object,
            callback
        });
        //accept an object and a callback pair and s tore it for our search function
    }

    private _search = (event: MouseEvent): void => {

        // Set our Raycaster to point down the camera where the user tapped
        this._mouse.x = (event.clientX / this._domElement.clientWidth) * 2 - 1;
        this._mouse.y = - (event.clientY / this._domElement.clientHeight) * 2 + 1;
        this._raycaster.setFromCamera(this._mouse, this._camera);

        for (let pair of this.objectCallbackPairs) {
            let intersections = this._raycaster.intersectObject(pair.object);
            if (intersections.length > 0) pair.callback();
        }
    }
}
