import { Icon } from "./Icon";

import { BOTTOM_CENTER, TOP_CENTER } from "./config.js";

// interface NeighboringIcons {
//   [key: string]: Icon[];
// }

const beatsIcon = new Icon({
  iconGroup: "#beats",

  degreeMod: "max",
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",

  degreeMod: "min",
});

const bpmIcon = new Icon({
  iconGroup: "#bpm",

  bottomCircle: true,
  degreeMod: "both",
});

const volumeIcon = new Icon({
  iconGroup: "#volume",

  bottomCircle: true,
  degreeMod: "max",
});

const playIcon = new Icon({
  iconGroup: "#play",
  isDraggable: false,
});
const pauseIcon = new Icon({
  iconGroup: "#pause",
  isDraggable: false,
});
const resetIcon = new Icon({
  iconGroup: "#reset",
  isDraggable: false,
});
const settingsIcon = new Icon({
  iconGroup: "#settings",
  isDraggable: false,
});
class UIController {
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

  static getCurrentIcon(evt: PointerEvent): Icon | undefined {
    const target = evt.target as HTMLElement;
    return UIController.icons.find((icon: Icon) =>
      target.closest(icon.iconGroupId)
    );
  }

  static controlAnimation(evt: PointerEvent, dy: number) {
    const icon = UIController.getCurrentIcon(evt) as Icon;
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
}

export { UIController };
