import { handlePointerDown, handlePointerMove, handlePointerUp } from "../main";
import { clamp } from "../helpers";
import {
  DRAG_SPEED_MODIFIER,
  DEGREE_COLLISION_MODIFIER,
  DEGREE_CONSTRAINTS_MAX,
  DEGREE_CONSTRAINTS_MIN,
} from "./uiConfig";

interface IconPropsI {
  iconGroup: string;
  isDraggable?: boolean;
  bottomCircle?: boolean;
  collisionMod?: "min" | "max" | "both";
  reverseRotate?: boolean;
}

interface Coords {
  x: number;
  y: number;
}

interface DegConstr {
  min: number;
  max: number;
}
/** Class for icons */
class Icon {
  degreeConstraints: DegConstr;
  isDraggable?: boolean;

  collisionMod?: "min" | "max" | "both";
  reverseRotate?: boolean;
  cx: string;
  cy: string;
  r: string;

  iconGroupId: string;
  private symbolGroupId: string;
  bgId: string | null;

  iconGroup: Element | null;
  symbolGroup: Element | null;
  iconBg: Element | null;

  name: string;

  bottomCircle: boolean | undefined;

  constructor(props: IconPropsI) {
    this.bottomCircle = props.bottomCircle ?? undefined;
    this.reverseRotate = props.reverseRotate ?? undefined;

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
    this.collisionMod = props.collisionMod;
    this.degreeConstraints = this.setDegreeMinMax();
    this.isDraggable = props.isDraggable ?? true;

    this.iconGroup?.addEventListener("pointerdown", handlePointerDown);
    this.iconGroup?.addEventListener("pointerup", handlePointerUp);
    this.iconGroup?.addEventListener("pointermove", handlePointerMove);
  }

  setDegreeMinMax(): DegConstr {
    if (this.collisionMod === "max") {
      return {
        min: DEGREE_CONSTRAINTS_MIN,
        max: DEGREE_CONSTRAINTS_MAX - DEGREE_COLLISION_MODIFIER,
      };
    } else if (this.collisionMod === "min") {
      return {
        min: DEGREE_COLLISION_MODIFIER - DEGREE_CONSTRAINTS_MAX,
        max: DEGREE_CONSTRAINTS_MAX,
      };
    } else
      return {
        min: DEGREE_CONSTRAINTS_MIN + DEGREE_COLLISION_MODIFIER,
        max: 90 - DEGREE_COLLISION_MODIFIER,
      };
  }

  setHomePosition() {
    this.iconGroup?.setAttribute(
      "transform",
      `rotate(0,${this.cx}, ${this.cy})`
    );
    this.symbolGroup?.setAttribute(
      "transform",
      `rotate(0,${this.cx}, ${this.cy})`
    );
  }
  rotateIcon(dy: number, centerCoords: Coords) {
    this.iconGroup?.setAttribute(
      "transform",
      `rotate(${clamp(
        this.bottomCircle || this.reverseRotate
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
}

export { Icon };
