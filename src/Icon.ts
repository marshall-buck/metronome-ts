import { handlePointerDown, handlePointerMove, handlePointerUp } from "./main";
import { clamp } from "./helpers";
import { DRAG_SPEED_MODIFIER } from "./config";

interface IconPropsI {
  iconGroup: string;
  degreeConstraints: DegConstr;

  bottomCircle?: boolean;
}

interface Coords {
  x: number;
  y: number;
}

interface DegConstr {
  min: number;
  max: number;
}

class Icon {
  degreeConstraints: DegConstr;
  isDraggable: boolean = true;
  isColliding: boolean = false;

  cx: string;
  cy: string;
  r: string;

  iconGroupId: string;
  symbolGroupId: string;
  bgId: string | null;

  iconGroup: Element | null;
  symbolGroup: Element | null;
  iconBg: Element | null;

  name: string;

  static pointerId: number;
  bottomCircle: boolean | undefined;

  constructor(props: IconPropsI) {
    this.bottomCircle = props.bottomCircle ?? undefined;
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
    this.name = this.iconGroupId?.slice(1);

    this.iconGroup?.addEventListener("pointerdown", handlePointerDown);
    this.iconGroup?.addEventListener("pointerup", handlePointerUp);
    this.iconGroup?.addEventListener("pointermove", handlePointerMove);
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
    // if (this.name.startsWith("time")) dy = dy * -1;
    this.iconGroup?.setAttribute(
      "transform",
      `rotate(${clamp(
        this.bottomCircle || this.name.startsWith("time")
          ? -dy * DRAG_SPEED_MODIFIER
          : dy * DRAG_SPEED_MODIFIER,
        this.degreeConstraints.min,
        this.degreeConstraints.max
      )} ,${centerCoords.x}, ${centerCoords.y})`
    );

    this.symbolGroup?.setAttribute(
      "transform",
      `rotate(${dy * 5},${this.cx}, ${this.cy})`
    );
  }

  getGroupRect(): DOMRect {
    return this.iconGroup?.getBoundingClientRect() as DOMRect;
  }
}

export { Icon };
