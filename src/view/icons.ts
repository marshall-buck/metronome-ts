interface IconPropsI {
  iconGroup: string;
  degreeConstraints: DegConstr;
  pointerDown: (e: Event) => void;
  pointerUp: (e: Event) => void;
  pointerMove: (e: Event) => void;
  invertAxis?: boolean;
}

interface Coords {
  x: number;
  y: number;
}

interface DegConstr {
  min: number;
  max: number;
}

class IconController {
  static icons: Icon[];

  constructor(icons: Icon[]) {
    IconController.icons = icons;
    console.log(icons);
  }
  static getCurrentIcon(e: Event): Icon | undefined {
    const evt = e as PointerEvent;

    const target = evt.target as HTMLElement;

    return IconController.icons.find((icon: Icon) =>
      target.closest(icon.iconGroupId as string)
    );
  }

  static setHomePosition(element: Element, centerAxis: Coords) {
    element.setAttribute(
      "transform",
      `rotate(0,${centerAxis.x}, ${centerAxis.y})`
    );
  }
}
const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
class Icon {
  degreeConstraints: DegConstr;
  isDraggable: boolean = true;
  isDragging: boolean = false;
  isColliding: boolean = false;
  cx: string;
  cy: string;
  r: string;
  iconGroupId: string | null;
  symbolGroupId: string | null;
  bgId: string | null;
  iconGroup: Element | null;
  symbolGroup: Element | null;
  iconBg: Element | null;

  static pointerId: number;
  invertAxis: boolean | undefined;

  constructor(props: IconPropsI) {
    this.invertAxis = props.invertAxis ?? undefined;
    this.degreeConstraints = props.degreeConstraints;
    this.iconGroupId = props.iconGroup;
    this.symbolGroupId = `${props.iconGroup}-symbol`;
    this.bgId = `${props.iconGroup}-bg`;
    this.iconGroup = document.querySelector(props.iconGroup);
    this.symbolGroup = document.querySelector(this.symbolGroupId);
    this.iconBg = document.querySelector(this.bgId);
    this.cx = this.iconBg?.getAttribute("cx") as string;
    this.cy = this.iconBg?.getAttribute("cy") as string;
    this.r = this.iconBg?.getAttribute("r") as string;

    this.iconGroup?.addEventListener("pointerdown", props.pointerDown);
    this.iconGroup?.addEventListener("pointerup", props.pointerUp);
    this.iconGroup?.addEventListener("pointermove", props.pointerMove);
  }

  setHomePosition(centerCoords: Coords) {
    this.iconGroup?.setAttribute(
      "transform",
      `rotate(0,${centerCoords.x}, ${centerCoords.y})`
    );
    this.symbolGroup?.setAttribute(
      "transform",
      `rotate(0,${this.cx}, ${this.cy})`
    );
  }
  rotateIcon(dy: number, centerCoords: Coords) {
    // console.log(dy);

    this.iconGroup?.setAttribute(
      "transform",
      `rotate(${clamp(
        this.invertAxis ? -dy * 0.5 : dy * 0.5,
        this.degreeConstraints.min,
        this.degreeConstraints.max
      )} ,${centerCoords.x}, ${centerCoords.y})`
    );
    console.log(this.invertAxis ? -dy * 0.5 : dy * 0.5);

    this.symbolGroup?.setAttribute(
      "transform",
      `rotate(${dy * 5},${this.cx}, ${this.cy})`
    );
  }
}

export { Icon, IconController };
