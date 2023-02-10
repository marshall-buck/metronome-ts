function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

// const toSVGPoint = (svg, x, y) => {
//   let p = new DOMPoint(x, y);
//   return p.matrixTransform(svg.getScreenCTM().inverse());
// };
export { clamp };
