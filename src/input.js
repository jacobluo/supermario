const keys = new Set();

const keyMap = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'jump',
  Space: 'jump',
  KeyZ: 'jump',
  KeyX: 'action'
};

export const createInput = () => {
  const handleKeyDown = (event) => {
    const mapped = keyMap[event.code];
    if (mapped) keys.add(mapped);
  };

  const handleKeyUp = (event) => {
    const mapped = keyMap[event.code];
    if (mapped) keys.delete(mapped);
  };

  return {
    start() {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    },
    stop() {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keys.clear();
    },
    isDown(action) {
      return keys.has(action);
    },
    snapshot() {
      return Array.from(keys);
    }
  };
};
