export const applyPhysics = (body, dt) => {
  if (!body) return;
  body.vy = (body.vy ?? 0) + (body.gravity ?? 0) * dt;
  body.x += (body.vx ?? 0) * dt;
  body.y += (body.vy ?? 0) * dt;
};
