interface IconPropsI {
  iconGroup: string;
  pointerDown: (e: Event) => void;
  pointerUp: (e: Event) => void;
  pointerMove: (e: Event) => void;
}

interface Coords {
  x: number;
  y: number;
}

class IconController {
  static icons: Icon[];
  currentIcon: Icon | null = null;
  constructor(icons: Icon[]) {
    IconController.icons = icons;
    console.log(icons);
  }
  static handlePointerDown(e: Event): Icon | undefined {
    const evt = e as PointerEvent;

    const target = evt.target as HTMLElement;

    return IconController.icons.find((icon: Icon) =>
      target.closest(icon.iconGroupId as string)
    );
  }
}

class Icon {
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

  // bindPointerDown: (e: Event) => void;
  static pointerId: number;

  constructor(props: IconPropsI) {
    // console.log(props);
    this.iconGroupId = props.iconGroup;
    this.symbolGroupId = `${props.iconGroup}-symbol`;
    this.bgId = `${props.iconGroup}-bg`;
    this.iconGroup = document.querySelector(props.iconGroup);
    this.symbolGroup = document.querySelector(this.symbolGroupId);
    this.iconBg = document.querySelector(this.bgId);
    this.cx = this.iconBg?.getAttribute("cx") as string;
    this.cy = this.iconBg?.getAttribute("cy") as string;
    this.r = this.iconBg?.getAttribute("r") as string;
    // this.bindPointerDown = props.pointerDown.bind(this);

    this.iconGroup?.addEventListener("pointerdown", props.pointerDown);
    // this.iconGroup?.addEventListener("pointerup", this.handlePointerUp);
    // this.iconGroup?.addEventListener("pointermove", this.handlePointerMove);
  }

  // handlePointerMove(e: Event) {
  //   console.log("from function", e, this);
  // }

  // getCenterPoint() {
  //   return { x: 0, y: 0 };
  // }

  // clientBox(): DOMRect | null {
  //   return this.element?.getBoundingClientRect() ?? null;
  // }

  // bBox(): SVGRect | null {
  //   if (this.element instanceof SVGGraphicsElement) {
  //     return this.element.getBBox();
  //   }
  //   return null;
  // }
}

export { Icon, IconController };
