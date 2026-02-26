const defaultRaf = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : () => {};
const defaultNow = typeof performance !== 'undefined' ? () => performance.now() : () => 0;

export const createLoop = ({
  update = () => {},
  render = () => {},
  timestep = 1000 / 60,
  maxFrameDelta = 100,
  raf = defaultRaf,
  now = defaultNow
} = {}) => {
  let last = 0;
  let accumulator = 0;
  let running = false;

  const stepFrame = (frameTime) => {
    if (!running) return;
    const delta = Math.min(maxFrameDelta, frameTime - last);
    last = frameTime;
    accumulator += delta;

    while (accumulator >= timestep) {
      update(timestep);
      accumulator -= timestep;
    }

    render();
    raf(stepFrame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      last = now();
      raf(stepFrame);
    },
    stop() {
      running = false;
    },
    advance(ms) {
      // Testing helper: simulate a frame jump without raf.
      if (!running) running = true;
      const frameTime = (last || now()) + ms;
      stepFrame(frameTime);
    }
  };
};
