export class Camera {
  constructor({ width = 320, height = 180 } = {}) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.target = null;
    this.bounds = { width: width * 2, height: height * 2 };
  }

  follow(target) {
    this.target = target;
  }

  setBounds(bounds) {
    this.bounds = bounds;
  }

  update() {
    if (!this.target) return;
    this.x = Math.max(0, Math.min(this.target.x - this.width / 2, this.bounds.width - this.width));
    this.y = Math.max(0, Math.min(this.target.y - this.height / 2, this.bounds.height - this.height));
  }
}
