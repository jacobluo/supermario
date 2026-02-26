const defaults = {
  gravity: 0.0025, // px per ms^2
  jumpImpulse: -0.8, // px per ms
  terminalVelocity: 1.2 // px per ms
};

export const integrate = (body, input, dt) => {
  if (!body) return;
  const gravity = body.gravity ?? defaults.gravity;
  const terminalVelocity = body.terminalVelocity ?? defaults.terminalVelocity;
  const jumpImpulse = body.jumpImpulse ?? defaults.jumpImpulse;

  const vy = (body.vy ?? 0) + gravity * dt;
  body.vy = Math.min(vy, terminalVelocity);

  if (input?.jump && body.canJump) {
    body.vy = jumpImpulse;
    body.canJump = false;
  }

  body.x += (body.vx ?? 0) * dt;
  body.y += (body.vy ?? 0) * dt;
};

export const applyGroundContact = (body, groundY) => {
  if (body.y > groundY) {
    body.y = groundY;
    body.vy = 0;
    body.canJump = true;
  }
};
