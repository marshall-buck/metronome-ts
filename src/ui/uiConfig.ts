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

const topPadPosition = {
  cx: centerX.toString(),
  cy: topPadY.toString(),
  r: "23",
};

/*********SUBDIVISIONS PATH********************/
const SUB_PATH = `M195.117,371.464c-6.361,-10.995 -20.431,-14.752
                  -31.426,-8.391c-3.495,2.021 -6.396,4.927 -8.412,8.425l8.976,
                  5.172c1.108,-1.922 2.702,-3.519 4.623,-4.631c6.043,
                  -3.496 13.776,-1.431 17.272,4.612l8.967,-5.187Z`;

export {
  TOP_CENTER,
  BOTTOM_CENTER,
  DRAG_SPEED_MODIFIER,
  DEGREE_CONSTRAINTS_MAX,
  DEGREE_CONSTRAINTS_MIN,
  DEGREE_COLLISION_MODIFIER,
  topPadPosition,
  SUB_PATH,
  type PadSettings,
};
