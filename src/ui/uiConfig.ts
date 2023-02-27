import { Icon } from "./Icon";
interface PadSettings {
  cx: string;
  cy: string;
  r: string;
}
// interface Pads {
//   [key: string]: PadSettings;
// }

const centerX = 175.359;

const TOP_CENTER = { x: centerX, y: 177.095 };
const BOTTOM_CENTER = { x: centerX, y: 477.095 };
const DRAG_SPEED_MODIFIER = 0.5;
const DEGREE_COLLISION_MODIFIER = 18;
const DEGREE_CONSTRAINTS_MIN = -90;
const DEGREE_CONSTRAINTS_MAX = 90;

const topPadY = 382.92;

const topPad = { cx: centerX.toString(), cy: topPadY.toString(), r: "23" };

/*********SUBDIVISIONS PATHS********************/
const SUB_1 = `M195.117,371.464c-6.361,-10.995 -20.431,-14.752
                  -31.426,-8.391c-3.495,2.021 -6.396,4.927 -8.412,8.425l8.976,
                  5.172c1.108,-1.922 2.702,-3.519 4.623,-4.631c6.043,
                  -3.496 13.776,-1.431 17.272,4.612l8.967,-5.187Z`;
const SUB_2 = `M155.279,371.498c-6.341,11.007 -2.56,25.07 8.446,31.412c3.498,
                  2.015 7.465,3.075 11.503,3.071l-0.009,-10.359c-2.219,
                  0.002 -4.4,-0.58 -6.322,-1.688c-6.049,-3.485 -8.127,
                  -11.215 -4.642,-17.264l-8.976,-5.172Z`;
const SUB_3 = `M175.228,405.981c12.702,-0.011 22.991,-10.317 22.98,-23.02c-0.004,
                  -4.037 -1.07,-8.002 -3.091,-11.497l-8.967,5.187c1.111,1.921 1.697,
                  4.1 1.699,6.319c0.006,6.982 -5.649,12.646 -12.63,
                  12.652l0.009,10.359Z`;

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
  collisionMod: "both",
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
  TOP_CENTER,
  BOTTOM_CENTER,
  DRAG_SPEED_MODIFIER,
  DEGREE_CONSTRAINTS_MAX,
  DEGREE_CONSTRAINTS_MIN,
  DEGREE_COLLISION_MODIFIER,
  divisionIcon,
  timeSigIcon,
  bpmIcon,
  volumeIcon,
  playIcon,
  pauseIcon,
  resetIcon,
  settingsIcon,
  subDivisionIcon,
  topPad,
  SUB_1,
  SUB_2,
  SUB_3,
  type PadSettings,
};
