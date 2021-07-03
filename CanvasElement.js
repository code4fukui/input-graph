import { extendGraphics } from "https://js.sabae.cc/extendGraphics.js";

class CanvasElement extends HTMLElement {
  constructor() {
    super();
    this.style.display = "inline-block";
    const canvas = document.createElement("canvas");
    this.appendChild(canvas);
    canvas.style.width = "100%"; // this.style.width; // "100%";
    canvas.style.height = "100%"; // this.style.height; //"100%";
    const g = canvas.getContext("2d");
    extendGraphics(g);
    this.canvas = canvas;
    this.g = g;
    //this.redraw();
    addEventListener("resize", () => this.redraw());
  }
  redraw() {
    const ratio = window.devicePixelRatio;
    const w = this.offsetWidth * ratio;
    const h = this.offsetHeight * ratio;
    if (this.bkw != w || this.bkh != h) {
      this.canvas.width = w;
      this.canvas.height = h;

    };
    const g = this.g;
    this.draw(g, w, h);
    this.bkw = w;
    this.bkh = h;
  }
  draw(g, w, h) {
    g.setColor(255, 0, 0);
    g.drawLine(0, 0, w, h);
  }
}

export { CanvasElement };
