const keyMap = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'jump',
  Space: 'jump',
  KeyZ: 'jump',
  KeyX: 'action'
};

export const createInput = () => {
  const keys = new Set();
  let recording = false;
  let playback = null;
  let playbackTime = 0;
  let recordStart = 0;
  const events = [];

  const applyEvent = (type, code, time) => {
    const mapped = keyMap[code];
    if (!mapped) return;
    if (type === 'down') {
      keys.add(mapped);
    } else if (type === 'up') {
      keys.delete(mapped);
    }
    if (recording) events.push({ time, code, type });
  };

  const handleKeyDown = (event) => applyEvent('down', event.code, performance.now());
  const handleKeyUp = (event) => applyEvent('up', event.code, performance.now());

  const updatePlayback = (dt) => {
    if (!playback) return;
    playbackTime += dt;
    while (playback.index < playback.events.length && playback.events[playback.index].time <= playbackTime) {
      const evt = playback.events[playback.index];
      applyEvent(evt.type, evt.code, playbackTime);
      playback.index += 1;
    }
    if (playback.index >= playback.events.length) {
      playback = null;
    }
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
      recording = false;
      playback = null;
    },
    isDown(action) {
      return keys.has(action);
    },
    snapshot() {
      return Array.from(keys);
    },
    startRecording() {
      events.length = 0;
      recording = true;
      recordStart = performance.now();
    },
    stopRecording() {
      recording = false;
      return events.map((e) => ({ ...e, time: e.time - recordStart }));
    },
    startPlayback(recordedEvents = []) {
      keys.clear();
      playbackTime = 0;
      playback = { events: recordedEvents, index: 0 };
    },
    update(dt) {
      updatePlayback(dt);
    }
  };
};
