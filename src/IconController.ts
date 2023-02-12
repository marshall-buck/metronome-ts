import { Icon } from "./Icon";
import { clamp } from "./helpers";
import {
  BOTTOM_CENTER,
  TOP_CENTER,
  beatsIcon,
  bpmIcon,
  pauseIcon,
  playIcon,
  resetIcon,
  settingsIcon,
  timeSigIcon,
  volumeIcon,
} from "./config.js";

// interface NeighboringIcons {
//   [key: string]: Icon[];
// }

/** Class to control icon dragging and touches */
class IconController {
  static icons: Icon[] = [
    beatsIcon,
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

  static changeBpm(label: SVGTextElement, dy: number) {
    label.textContent = `${clamp(dy, 20, 180)}`;
  }

  static settingsIconDown() {
    const mainSvg = document.querySelector("#main-svg") as SVGElement;
    const settingsScale = [
      { transform: "scale(1)" },
      { transform: "scaleY(.5)", offset: 0.5 },
      { transform: "scaleY(0) scaleX(0)" },
    ];
    const settingsTiming: KeyframeAnimationOptions = {
      duration: 500,
      iterations: 1,
      fill: "forwards",
    };
    mainSvg.animate(settingsScale, settingsTiming);
  }
}

export { IconController };
