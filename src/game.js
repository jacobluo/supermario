import { createLoop } from './loop.js';
import { createInput } from './input.js';
import { Camera } from './camera.js';

export const createGame = (canvas) => {
  const ctx = canvas.getContext('2d');
  const input = createInput();
  const camera = new Camera();

  const loop = createLoop({
    update: (dt) => {
      // TODO: wire player, physics, and level updates in later phases.
      camera.update(dt);
    },
    render: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // TODO: draw level and entities once implemented.
    }
  });

  return {
    start: () => {
      input.start();
      loop.start();
    }
  };
};
