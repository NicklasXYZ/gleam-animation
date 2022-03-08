// Import code from node modules
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Shape from "./Shape";


// Main class. This is the topmost class!
export default class View {
    // Variables: scene, camera and renderer
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    SCREEN_WIDTH: number;
    SCREEN_HEIGHT: number;
    ASPECT: number;
    VIEW_ANGLE: number;
    NEAR: number;
    FAR: number;
    CAMERA_Z: number;
    controls: OrbitControls;
    shape: Shape;
    svgGroup: THREE.Group;
    material: THREE.MeshToonMaterial;

    // Class constructor
    constructor(canvasElem: HTMLCanvasElement) {
        // Set default values for the scene and camera
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        this.ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
        this.VIEW_ANGLE = 100;
        this.NEAR = 0.01;
        this.FAR = 1000;
        this.CAMERA_Z = 300;

        // Setup: scene and camera
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.TextureLoader().load("./textures/background.png");
        this.camera = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR,
        );
        this.camera.position.z = this.CAMERA_Z;

        // Setup: renderer - to eventually be able to render the scene with an added shape
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElem,
            antialias: true,
        });

        // Setup: camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Setup: create a shape to add to the scene
        this.shape = new Shape(this.scene);

        // Setup: the initial canvas size
        this.onWindowResize(window.innerWidth, window.innerHeight);
        this.shape.draw();
    }

    onWindowResize(windowWidth: number, windowHeight: number): void {
        this.renderer.setSize(windowWidth, windowHeight);
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;
        this.ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
        this.camera.aspect = this.ASPECT;
        this.camera.updateProjectionMatrix();
    }

    update(): void {
        this.shape.update();
        this.renderer.render(this.scene, this.camera);
    }
}