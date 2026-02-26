const intersects = (a, b) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

export const resolveTileCollision = (body, tiles = [], tileSize = 16) => {
  const collisions = [];
  const moveAxis = (axis) => {
    for (const tile of tiles) {
      if (!tile.solid) continue;
      if (intersects(body, tile)) {
        collisions.push(tile);
        if (axis === 'x') {
          if (body.vx > 0) body.x = tile.x - body.width;
          else if (body.vx < 0) body.x = tile.x + tile.width;
          body.vx = 0;
        } else {
          if (body.vy > 0) {
            body.y = tile.y - body.height;
            body.canJump = true;
          } else if (body.vy < 0) {
            body.y = tile.y + tile.height;
          }
          body.vy = 0;
        }
      }
    }
  };

  body.width = body.width ?? tileSize;
  body.height = body.height ?? tileSize;

  // Resolve x first, then y for axis-separated handling.
  moveAxis('x');
  moveAxis('y');

  return { body, collisions };
};
