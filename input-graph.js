import { CanvasElement } from "./CanvasElement.js";
import { extendUI } from "https://js.sabae.cc/extendUI.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const COLOR_F = [0, 0, 0];
const COLOR_B = [255, 255, 255];
const COLOR_B_SELECED = [200, 228, 255];

const FH = 40;

const drawTextBox = (g, colf, colb, s, x, y, h) => {
  const fh = h * .7;
  g.setFontSize(fh);
  const sw = g.measureText(s).width;
  const w = sw / .8;
  g.setColor(colb);
  const b = [x - w / 2, y - h / 2, w, h];
  g.fillRect(b[0], b[1], b[2], b[3]);
  g.setColor(colf);
  g.drawRect(b[0], b[1], b[2], b[3]);
  g.fillText(s, x - sw / 2, y + fh * .4);
  return b;
};
const hitCheckBBox = (bbox, x, y) => {
  return x >= bbox[0] && x < bbox[0] + bbox[2] && y >= bbox[1] && y < bbox[1] + bbox[3];
}

class Item {
  name;
  x;
  y;
  vx;
  vy;
  m;
  constructor(name) {
    this.name = name;
  }
  draw(g, w, h) {
    if (this.x == undefined) {
      this.x = w / 2 + Math.random(); //rnd(w);
      this.y = h / 2 + Math.random(); // + rnd(3);
      this.vx = this.vy = this.a = 0;
      this.m = 50;
    }
    const x = this.x;
    const y = this.y;
    this.bbox = drawTextBox(g, COLOR_F, this.selected ? COLOR_B_SELECED : COLOR_B, this.name, x, y, FH);
  }
  contains(x, y) {
    if (!this.bbox) {
      return false;
    }
    return hitCheckBBox(this.bbox, x, y);
  }
}

class Link {
  constructor(s, p, o) {
    this.s = s;
    this.p = p;
    this.o = o;
  }
  draw(g, w, h) {
    g.setColor(128, 128, 128);
    const x1 = this.s.x;
    const y1 = this.s.y;
    const x2 = this.o.x;
    const y2 = this.o.y;
    g.drawLine(x1, y1, x2, y2);
    //g.drawArrow(x1, y1, x2, y2, 4, 20, true);

    const cx = (x2 + x1) / 2;
    const cy = (y2 + y1) / 2;
    //drawTextBox(g, COLOR_F, COLOR_B, this.p, cx, cy, FH);
  }
}

const tickSpace = (objs, w, h) => {
  const cx = w / 2;
  const cy = h / 2;

  for (const o of objs) {
    o.bkvx = o.vx;
    o.bkvy = o.vy;
    o.vx = 0;
    o.vy = 0;
  }
  
  const k = 0.5; // ばね定数
  const damp = .05; // 減衰率
  const distance = FH * 30;
  for (let i = 0; i < objs.length - 1; i++) {
    for (let j = i + 1; j < objs.length; j++) {
      const o1 = objs[i];
      const o2 = objs[j];

      const dx2 = o1.x - o2.x;
      const dy2 = o1.y - o2.y;
      const th = Math.atan2(dy2, dx2); //  + Math.random() * .001;
      const cx2 = o1.x + dx2 / 2;
      const cy2 = o1.y + dy2 / 2;
      const tx1 = cx2 + Math.cos(th) * distance / 2;
      const ty1 = cy2 + Math.sin(th) * distance / 2;
      const tx2 = cx2 - Math.cos(th) * distance / 2;
      const ty2 = cy2 - Math.sin(th) * distance / 2;

      // 力：f=-ky、-ばね定数()*(現在位置-自然長)
      // 加速度：f=ma => a=f/m 加速度は力/質量
      // 速度：(今の速度+加速度)に減衰率を掛ける
      const fx1 = -k * (o1.x - tx1);
      const ax1 = fx1 / o1.m;
      o1.vx += damp * (o1.bkvx + ax1);

      const fy1 = -k * (o1.y - ty1);
      const ay1 = fy1 / o1.m;
      o1.vy += damp * (o1.bkvy + ay1);

      const fx2 = -k * (o2.x - tx2);
      const ax2 = fx2 / o2.m;
      o2.vx += damp * (o2.bkvx + ax2);
      
      const fy2 = -k * (o2.y - ty2);
      const ay2 = fy2 / o2.m;
      o2.vy += damp * (o2.bkvy + ay2);
    }
  }
  
  // 中央へ
  const distance2 = 100;
  const k2 = 1;
  const damp2 = .5;
  for (let i = 0; i < objs.length; i++) {
    const o1 = objs[i];
    const dx2 = o1.x - cx;
    const dy2 = o1.y - cy;
    const th = Math.atan2(dy2, dx2);
    const tx1 = cx + Math.cos(th) * distance2;
    const ty1 = cy + Math.sin(th) * distance2;
    // 力：f=-ky、-ばね定数()*(現在位置-自然長)
    // 加速度：f=ma => a=f/m 加速度は力/質量
    // 速度：(今の速度+加速度)に減衰率を掛ける
    const fx1 = -k2 * (o1.x - tx1);
    const ax1 = fx1 / o1.m;
    o1.vx += damp2 * (o1.bkvx + ax1);

    const fy1 = -k2 * (o1.y - ty1);
    const ay1 = fy1 / o1.m;
    o1.vy += damp2 * (o1.bkvy + ay1);
  }

  // 動こう
  for (const o of objs) {
    o.x += o.vx;
    o.y += o.vy;
  }
};

class InputGraph extends CanvasElement {
  constructor() {
    super();
    this.objs = [];
    this.links = [];

    this.value = [
      { s: "ねこ", p: "is_a", o: "animal" },
      { s: "dag", p: "is_a", o: "animal" },
      { s: "animal", p: "is_a", o: "lives" },
    ];
    
    //this.value = [ { s: "cat", p: "", o: "cat" } ];

    const f = () => {
      tickSpace(this.objs, this.bkw, this.bkh);
      this.redraw();
      requestAnimationFrame(f);
    };
    f();

    this.canvas.ratio = window.devicePixelRatio;
    extendUI(this.canvas);
    this.canvas.onuimove = (x, y) => {
      if (this.drag) {
        const dx = x - this.bkx;
        const dy = y - this.bky;
        this.drag.x += dx;
        this.drag.y += dy;
        this.bkx = x;
        this.bky = y;
        return;
      }
      this.objs.forEach(o => o.selected = false);
      const o = this.objs.find(o => o.contains(x, y));
      if (o) {
        o.selected = true;
      }
    };
    this.canvas.onuidown = (x, y) => {
      this.objs.forEach(o => o.selected = false);
      const o = this.objs.find(o => o.contains(x, y));
      if (o) {
        o.selected = true;
        this.drag = o;
        this.bkx = x;
        this.bky = y;
      }
    };
    this.canvas.onuiup = (x, y) => {
      this.drag = null;
    };
  }
  draw(g, w, h) {
    g.setColor(255, 255, 255);
    g.fillRect(0, 0, w + 1, h + 1);
    for (const l of this.links) {
      l.draw(g, w, h);
    }
    for (const o of this.objs) {
      o.draw(g, w, h);
    }
    g.setColor(0, 0, 0);
    //g.fillRect(w / 2, h / 2, 10, 10);
  }
  changed() {
    if (this.onchange != null) {
      this.onchange();
    }
  }
  get value() {
    return null;
  }
  set value(data) {
    if (typeof data == "string") {
      data = CSV.toJSON(CSV.decode(data));
    }
    this.data = data;
    this.objs = [];
    this.links = [];
    const obj = new Set();
    data.forEach(d => {
      obj.add(d.s);
      obj.add(d.o);
    });
    for (const o of obj) {
      if (!this.objs.find(o => o.name == o)) {
        this.objs.push(new Item(o));
      }
    }
    data.forEach(d => {
      const s1 = this.objs.find(o => o.name == d.s);
      const o1 = this.objs.find(o => o.name == d.o);
      this.links.push(new Link(s1, d.p, o1));
    });

    this.redraw();
  }
}

customElements.define("input-graph", InputGraph);

export { InputGraph };
