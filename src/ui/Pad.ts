import { PadSettings, SUB_PATH } from "./uiConfig";
/**Base class for a pad- */
class Pad {
  currentBeat: number;
  isBar?: boolean;
  isBeat?: boolean;
  isSub?: boolean;
  element?: SVGElement;

  constructor(currentBeat: number) {
    this.currentBeat = currentBeat;
    // this.element?.addEventListener("pointerdown", this.handlePadClick);
  }

  node() {
    return this.element as Node;
  }

  show() {
    this.element?.classList.remove("hide");
  }
  hide() {
    this.element?.classList.add("hide");
  }
  makeActive() {
    this.element?.setAttribute("class", "active beat");
  }
  makeInactive() {
    this.element?.setAttribute("class", "beat");
  }
  rotate(rotation: number, x: number | string, y: number | string) {
    this.element?.setAttribute("transform", `rotate(${rotation}, ${x}, ${y})`);
  }

  // handlePadClick = (e: PointerEvent) => {
  //   console.log(e);
  // };
}

class Beat extends Pad {
  constructor(currentBeat: number, defaultAttrs: PadSettings) {
    super(currentBeat);
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    this.element.setAttribute("r", defaultAttrs.r);
    this.element.setAttribute("cx", defaultAttrs.cx);
    this.element.setAttribute("cy", defaultAttrs.cy);
    this.element.setAttribute("data-current-beat", `${this.currentBeat}`);
    this.isBar = currentBeat === 0 ? true : false;
    this.isBeat = currentBeat !== 0 ? true : false;
  }
}

class Subdivision extends Pad {
  path: string = SUB_PATH;
  constructor(currentBeat: number) {
    super(currentBeat);

    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.element.setAttribute("class", "beat hide");
    this.element.setAttribute("data-current-beat", `${this.currentBeat}`);
    this.element.setAttribute("d", this.path);
    this.isSub = true;
  }
}

export { Beat, Subdivision, Pad };
