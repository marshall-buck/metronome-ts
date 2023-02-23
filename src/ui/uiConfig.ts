import { Icon } from "./Icon";
interface PadSettings {
  cx: string;
  cy: string;
  r: string;
  deg: number;
}
interface Pads {
  [key: string]: PadSettings;
}

const TOP_CENTER = { x: 176.3, y: 177.318 };
const BOTTOM_CENTER = { x: 176.3, y: 477.318 };
const DRAG_SPEED_MODIFIER = 0.5;
const DEGREE_COLLISION_MODIFIER = 18;
const DEGREE_CONSTRAINTS = { min: -90, max: 90 };
// const SLIDING_RANGE = 180;
const centerX = "176.274";
const PADS: Pads = {
  "3": { cx: centerX, cy: "405.954", r: "46.125", deg: 360 / 3 },
  "4": { cx: centerX, cy: "405.93", r: "46.125", deg: 360 / 4 },
  "5": { cx: centerX, cy: "396.83", r: "37", deg: 360 / 5 },
  "6": { cx: centerX, cy: "396.83", r: "37", deg: 360 / 6 },
  "7": { cx: centerX, cy: "393.83", r: "34", deg: 360 / 7 },
  "8": { cx: centerX, cy: "393.83", r: "30", deg: 360 / 8 },
  "9": { cx: centerX, cy: "387.83", r: "28", deg: 360 / 9 },
  "11": { cx: centerX, cy: "387.83", r: "23", deg: 360 / 11 },
  "12": { cx: centerX, cy: "382.83", r: "23", deg: 360 / 12 },
};

/** Initial Icons */
const divisionIcon = new Icon({
  iconGroup: "#division",
  collisionMod: "both",
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",
  collisionMod: "both",
});

const bpmIcon = new Icon({
  iconGroup: "#bpm",
  bottomCircle: true,
  collisionMod: "both",
});

const volumeIcon = new Icon({
  iconGroup: "#volume",
  bottomCircle: true,
  collisionMod: "max",
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

export {
  TOP_CENTER,
  BOTTOM_CENTER,
  DRAG_SPEED_MODIFIER,
  DEGREE_CONSTRAINTS,
  DEGREE_COLLISION_MODIFIER,
  // SLIDING_RANGE,
  divisionIcon,
  timeSigIcon,
  bpmIcon,
  volumeIcon,
  playIcon,
  pauseIcon,
  resetIcon,
  settingsIcon,
  PADS,
  type PadSettings,
};
