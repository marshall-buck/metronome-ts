interface Position {
  x: number;
  y: number;
  radius: number;
}

class Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  type: string;
  isDragging: boolean = false;
  position: Position = { x: 0, y: 0, radius: 0 };

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    type: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.type = type;
  }

  changeRadius(value: number) {
    this.radius = value;
  }

  startPosition({ x, y, radius }: Position) {
    this.position = { x, y, radius };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move(clientX: number, clientY: number) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentX = this.x;
    const currentY = this.y;
    const dx: number = clientX - currentX;
    const dy: number = clientY - currentY;
    this.x += dx;
    this.y += dy;
    this.draw(ctx);
    this.x = clientX;
    this.y = clientY;
  }
}

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const iconSizes = 50;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasItems: Circle[] = [];

const center = {
  x: canvas.getBoundingClientRect().width / 2,
  y: canvas.getBoundingClientRect().height / 2,
};
let currentRadius = radius(center.x, center.y);
const mainCircle = new Circle(
  center.x,
  center.y,
  currentRadius,
  "black",
  "main"
);

const bottomCircle = new Circle(
  center.x,
  center.y + currentRadius - iconSizes,
  iconSizes,
  "red",
  "volume"
);
canvasItems.push(mainCircle, bottomCircle);

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const circle of canvasItems) {
    if (!circle.isDragging) circle.draw(ctx);
  }
}
drawShapes();
window.addEventListener("resize", (e: Event) => {
  const target = e.target as Window;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = target.innerWidth / 2;
  center.y = target.innerHeight / 2;
  currentRadius = radius(center.x, center.y);
  mainCircle.changeRadius(currentRadius);
});

/** determines smallest of width or height to draw circle */
function radius(centerX: number, centerY: number): number {
  return centerX >= centerY ? centerY : centerX;
}

canvas.addEventListener("mousedown", (e: MouseEvent) => {
  e.preventDefault();
  for (const circle of canvasItems) {
    if (
      isInsideCircle(circle.x, circle.y, circle.radius, e.x, e.y) &&
      circle.type !== "main"
    ) {
      const start = { x: circle.x, y: circle.y, radius: circle.radius };
      circle.startPosition(start);
      circle.isDragging = true;
    }
  }
});
canvas.addEventListener("mousemove", (e: MouseEvent) => {
  e.preventDefault();
  for (const circle of canvasItems) {
    if (circle.isDragging) {
      drawShapes();
      circle.move(e.x, e.y);
    }
  }
});
canvas.addEventListener("mouseup", (e: MouseEvent) => {
  e.preventDefault();
  for (const circle of canvasItems) {
    if (circle.isDragging) {
      drawShapes();
      circle.move(circle.position.x, circle.position.y);
      circle.isDragging = false;
    }
  }
});
/** checks if mouse is inside a circle. of x,y and radius
 * compared to m0use position
 */
function isInsideCircle(
  x: number,
  y: number,
  radius: number,
  mouseX: number,
  mouseY: number
): boolean {
  if (
    mouseX >= x - radius &&
    mouseX <= x + radius &&
    mouseY >= y - radius &&
    mouseY <= y + radius
  )
    return true;

  return false;
}

export {};
