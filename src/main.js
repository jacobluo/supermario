import { createGame } from './game.js';

const bootstrap = () => {
  const canvas =
    document.querySelector('#game') ||
    document.querySelector('canvas') ||
    (() => {
      const el = document.createElement('canvas');
      el.id = 'game';
      document.body.appendChild(el);
      return el;
    })();

  const game = createGame(canvas);
  game.start();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
}
