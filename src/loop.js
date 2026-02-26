export const createLoop = ({ update = () => {}, render = () => {}, timestep = 1000 / 60 } = {}) => {
  let last = 0;
  let accumulator = 0;
  let running = false;

  const frame = (now) => {
    if (!running) return;
    const delta = now - last;
    last = now;
    accumulator += delta;

    while (accumulator >= timestep) {
      update(timestep);
      accumulator -= timestep;
    }

    render();
    requestAnimationFrame(frame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    },
    stop() {
      running = false;
    }
  };
};
