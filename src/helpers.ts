/** returns a number: num clamped  to min and max */
function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
/** is n: in between min and max, */
function isBetween(n: number, min: number, max: number): boolean {
  if (n < max && n > min) return true;
  return false;
}

// const toSVGPoint = (svg, x, y) => {
//   let p = new DOMPoint(x, y);
//   return p.matrixTransform(svg.getScreenCTM().inverse());
// };
export { clamp, isBetween };
