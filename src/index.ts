import View from "./core/View";

class App {
    private view: View;

    constructor() {
        const canvasBox = <HTMLCanvasElement>document.getElementById("canvas");
        this.view = new View(canvasBox);

        window.addEventListener("resize", this.resize);
        this.update();
    }

    resize = (): void => {
        this.view.onWindowResize(window.innerWidth, window.innerHeight);
    }

    update = (): void => {
        this.view.update();
        requestAnimationFrame(this.update);
    }
}

const app = new App();