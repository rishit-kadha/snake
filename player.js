class Player {
  constructor({ position }) {
    this.position = position;
  }
  draw() {}
}

class Map {
  constructor({ mapsrc }) {
    this.mapsrc = mapsrc;
  }
  draw() {
    const map = new Image();
    map.src = this.mapsrc;
    ctx.drawImage();
  }
}
