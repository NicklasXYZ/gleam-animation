// Import code from node modules
import * as THREE from "three";
// Import local code
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

class Sky {
    group: THREE.Group;
    daySky:THREE.Group;
    nightSky: THREE.Group;
    colors: Record<string, Array<any>>;
    particles: number;

    constructor(particles: number) {
        this.particles = particles;
        this.group = new THREE.Group();      
        this.daySky = new THREE.Group();
        this.nightSky = new THREE.Group();
        this.group.add(this.daySky);
        this.group.add(this.nightSky);
        this.colors = {
            day: [0xFFD6F9, 0xFFD0F8, 0xFFCBF7, 0xFFC5F6, 0xFFBFF5],
            night: [0xFF8FEE, 0xFF52E5, 0xFF14DC, 0xD600B6, 0x990082],
        };
        this.drawSky("day");
        this.drawSky("night");
    }

    public drawSky(phase: string) {
        for (let i = 0; i < this.particles; i ++) {
            const geometry = new THREE.IcosahedronGeometry(i % 10.0 + 5, 0);
            const material = new THREE.MeshToonMaterial({
                color: this.colors[phase][Math.floor(Math.random() * this.colors[phase].length)],
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set((
                Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 1200,
            );
            if (phase === "day") {
                this.daySky.add(mesh);  
            } else {
                this.nightSky.add(mesh);
            }
        }
    }

    public moveSky() {
        this.group.rotation.x -= 0.001;
        this.group.rotation.y += 0.005;
    }
}

export default class Shape {
    scene: THREE.Scene;
    material: THREE.MeshToonMaterial;
    svgGroup: THREE.Group;
    sky: Sky;

    constructor(parentScene: THREE.Scene) {
        this.scene = parentScene;
        this.svgGroup = new THREE.Group();
        this.scene.background = new THREE.Color(0x282828);
        this.sky = new Sky(40);      
    }

    private _loadSvg(): void {
        const svgMarkup = document.querySelector("svg").outerHTML;
        const loader = new SVGLoader();
        const svgData = loader.parse(svgMarkup);
        this.svgGroup.scale.y *= -1;
        this.material = new THREE.MeshToonMaterial({color: 0xFF8FEE});
        svgData.paths.forEach((path, i) => {
            const shapes = path.toShapes(true);
            shapes.forEach((shape, j) => {
              const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 10,
                bevelEnabled: false,
              });
        
              // Create a mesh and add it to the group
              const mesh = new THREE.Mesh(geometry, this.material);
        
              this.svgGroup.add(mesh);
            });
        });
        const box = new THREE.Box3().setFromObject(this.svgGroup);
        const size = new THREE.Vector3();
        box.getSize(size);
        const yOffset = size.y / -2;
        const xOffset = size.x / -2;
        // Offset all of group's elements, to center them
        this.svgGroup.children.forEach(item => {
          item.position.x = xOffset;
          item.position.y = yOffset;
        });
        // Finally we add svg group to the scene
        this.scene.add(this.svgGroup);
    }

    private _setLights(): void {
        const light0 = new THREE.DirectionalLight( 0xffffff, 0.225);
        light0.position.set( 0, 0.025, 0.975 ).normalize(); // Light from camera angle
        light0.castShadow = true;
        this.scene.add(light0);
      
        const light1 = new THREE.DirectionalLight( 0xffffff, 0.20);
        light1.position.set( 0, 0.975, 0.025 ).normalize(); // Light shining from top
        light1.castShadow = false;
        this.scene.add(light1);
      
        const light2 = new THREE.HemisphereLight(0xFFFFFF, 0x282828, 0.80);
        this.scene.add(light2);
        
        const light3 = new THREE.AmbientLight(0xFFFFFF, 0.10)
        this.scene.add(light3);
    }

    private _drawSky(): void {
        this.scene.add(this.sky.group);
    }

    public draw(): void {
        this._loadSvg();
        this._setLights();
        this._drawSky();
    }

    public update(): void {
        this.svgGroup.rotation.y += 0.005;
        this.sky.moveSky();
    }
}