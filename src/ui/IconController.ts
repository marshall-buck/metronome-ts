import { Icon } from "./Icon";
import {
  divisionIcon,
  subDivisionIcon,
  timeSigIcon,
  volumeIcon,
  bpmIcon,
  pauseIcon,
  playIcon,
  resetIcon,
  settingsIcon,
} from "./initialIcons";

import { BOTTOM_CENTER, TOP_CENTER } from "./uiConfig.js";

/** Class to control icon dragging and touches */
class IconController {
  static icons: Icon[] = [
    divisionIcon,
    subDivisionIcon,
    timeSigIcon,
    volumeIcon,
    bpmIcon,
    pauseIcon,
    playIcon,
    resetIcon,
    settingsIcon,
  ];
  /** Returns the icon, based on the event target */
  static getCurrentIcon(evt: PointerEvent): Icon | null {
    const target = evt.target as Element;
    return (
      IconController.icons.find((icon: Icon) =>
        target.closest(icon.iconGroupId)
      ) ?? null
    );
  }

  static dragIcon(evt: PointerEvent, dy: number) {
    const icon = IconController.getCurrentIcon(evt) as Icon;
    if (icon.isDraggable === false) return;

    if (icon?.iconGroupId !== "#bpm") {
      if (!icon?.bottomCircle) icon?.rotateIcon(dy, TOP_CENTER);
      else icon?.rotateIcon(dy, BOTTOM_CENTER);
    }
    // Icon is bpm icon
    else {
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
}

export { IconController };
