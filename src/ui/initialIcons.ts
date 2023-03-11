import { Icon } from "./Icon";

/*************** Initial Icons ******************/
const divisionIcon = new Icon({
  iconGroup: "#division",
  collisionMod: "both",
});
const subDivisionIcon = new Icon({
  iconGroup: "#subdivision",
  isDraggable: false,
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",
  bottomCircle: true,
  collisionMod: "max",
});

const bpmIcon = new Icon({
  iconGroup: "#bpm",
  bottomCircle: true,
  collisionMod: "both",
});

const volumeIcon = new Icon({
  iconGroup: "#volume",
  collisionMod: "both",
  reverseRotate: true,
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
  divisionIcon,
  timeSigIcon,
  bpmIcon,
  volumeIcon,
  playIcon,
  pauseIcon,
  resetIcon,
  settingsIcon,
  subDivisionIcon,
};
