import { Icon } from "./Icon";

import { BOTTOM_CENTER, DEGREE_CONSTRAINTS, TOP_CENTER } from "./config.js";

interface NeighboringIcons {
  [key: string]: Icon[];
}

const beatsIcon = new Icon({
  iconGroup: "#beats",
  degreeConstraints: DEGREE_CONSTRAINTS,
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",
  degreeConstraints: DEGREE_CONSTRAINTS,
});
const volumeIcon = new Icon({
  iconGroup: "#volume",
  degreeConstraints: DEGREE_CONSTRAINTS,
  bottomCircle: true,
});
const bpmIcon = new Icon({
  iconGroup: "#bpm",
  degreeConstraints: DEGREE_CONSTRAINTS,
  bottomCircle: true,
});

class UIController {
  static icons: Icon[] = [beatsIcon, timeSigIcon, volumeIcon, bpmIcon];

  static getCurrentIcon(e: Event): Icon | undefined {
    const evt = e as PointerEvent;
    const target = evt.target as HTMLElement;
    return UIController.icons.find((icon: Icon) =>
      target.closest(icon.iconGroupId)
    );
  }

  static controlAnimation(e: Event, dy: number) {
    const icon = UIController.getCurrentIcon(e) as Icon;

    if (icon?.iconGroupId !== "#bpm") {
      if (!icon?.bottomCircle) icon?.rotateIcon(dy, TOP_CENTER);
      else icon?.rotateIcon(dy, BOTTOM_CENTER);
    } else {
      if (dy < 0) {
        icon.bottomCircle = false;
      }

      if (dy > 0) {
        icon.bottomCircle = true;
      }
      if (!icon.bottomCircle) icon?.rotateIcon(dy, TOP_CENTER);
      else icon?.rotateIcon(dy, BOTTOM_CENTER);
    }
  }

  static isColliding(icons: Icon[], currentIcon: Icon) {
    const currentBounds =
      currentIcon.iconGroup?.getBoundingClientRect() as DOMRect;
    console.log(currentBounds);
    const centerX = currentBounds.x + currentBounds.width / 2;
    const centerY = currentBounds.y + currentBounds.height / 2;

    const r = currentBounds.width;
    console.log(r);

    for (const icon of icons) {
      const iconBounds = icon.iconGroup?.getBoundingClientRect() as DOMRect;
      const dx = centerX - iconBounds.x;
      const dy = centerY - iconBounds.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < r) return true;
    }
    return false;
  }
}
export { UIController };
