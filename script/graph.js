export class Graph {
  constructor() {
    (this.size = { width: 1920, height: 1080 }),
      (this.points = { count: 0, coordinates: [], circleSize: 15 }),
      (this.step = 0),
      (this.animation = {
        time: 300,
        offset: [],
        steps: { count: 0, duration: 10 },
      });
  }

  initialize() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = this.size.width;
    canvas.height = this.size.height;
    this.clean(ctx);
    this.points.count = this.randomize(2, 10);
    this.setPointsCoordinates();
    this.draw(ctx);

    canvas.addEventListener('click', () => {
      this.calculate();
      this.move(ctx);
    });
  }

  randomize(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  getStep() {
    this.step = this.size.width / (this.points.count + 1);
  }

  setPointsCoordinates() {
    this.getStep();
    for (let i = 0; i < this.points.count; i++) {
      this.points.coordinates.push({
        X: this.step + this.step * i,
        Y: this.randomize(0 + this.points.circleSize, this.size.height - this.points.circleSize),
      });
    }
    this.points.coordinates.sort((a, b) => {
      return a.X > b.X ? 1 : -1;
    });
  }

  clean() {
    this.points.count = 0;
    this.points.coordinates = [];
    this.animation.offset = [];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.size.width, this.size.height);
    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    for (let i = 0; i < this.points.coordinates.length - 1; i++) {
      ctx.beginPath();
      ctx.arc(
        this.points.coordinates[i].X,
        this.points.coordinates[i].Y,
        this.points.circleSize,
        0,
        2 * Math.PI
      );
      ctx.moveTo(this.points.coordinates[i].X, this.points.coordinates[i].Y);
      ctx.lineTo(this.points.coordinates[i + 1].X, this.points.coordinates[i + 1].Y);
      ctx.stroke();
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(
      this.points.coordinates[this.points.coordinates.length - 1].X,
      this.points.coordinates[this.points.coordinates.length - 1].Y,
      this.points.circleSize,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
  }

  move(ctx) {
    let timerId = setInterval(() => {
      for (let i = 0; i < this.points.count; i++) {
        this.points.coordinates[i].Y += this.animation.offset[i];
      }
      this.draw(ctx);
    }, this.animation.steps.duration);

    setTimeout(() => {
      clearInterval(timerId);
    }, this.animation.time);
  }

  calculate() {
    this.animation.steps.count = this.animation.time / this.animation.steps.duration;
    let oldPointsCount = this.points.count;
    let oldPointsCoordinates = JSON.parse(JSON.stringify(this.points.coordinates));
    this.clean();
    this.points.count = this.randomize(2, 10);
    console.log(this.points.count);
    this.setPointsCoordinates();
    if (oldPointsCount > this.points.count) {
      oldPointsCoordinates = oldPointsCoordinates.splice(oldPointsCount - this.points.count);
    }
    if (oldPointsCount < this.points.count) {
      this.points.coordinates.slice(oldPointsCount).forEach((element) => {
        oldPointsCoordinates.splice(oldPointsCount, 0, element);
      });
    }
    oldPointsCount = this.points.count;
    for (let i = 0; i < oldPointsCount; i++) {
      let offset = 0;
      offset =
        (this.points.coordinates[i].Y - oldPointsCoordinates[i].Y) / this.animation.steps.count;
      this.animation.offset.push(offset);
    }
    this.points.count = oldPointsCount;
    this.points.coordinates = JSON.parse(JSON.stringify(oldPointsCoordinates));
    this.getStep();
    for (let i = 0; i < this.points.count; i++) {
      this.points.coordinates[i].X = this.step + this.step * i;
    }
  }
}
