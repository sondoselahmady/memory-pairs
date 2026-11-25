const THEMES = [
  {
    name: 'Animals',
    bg: '#e8f5e9',
    cardBack: '#388e3c',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮']
  },
  {
    name: 'Food',
    bg: '#fff3e0',
    cardBack: '#f57c00',
    emojis: ['🍎', '🍕', '🌮', '🍣', '🍦', '🍩', '🍇', '🍔', '🥞', '🥐', '🍓', '🍒']
  },
  {
    name: 'Sports',
    bg: '#e1f5fe',
    cardBack: '#0288d1',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎯', '🎱', '🏓', '🏸', '🥊', '🛹']
  },
  {
    name: 'Halloween',
    bg: '#fbe9e7',
    cardBack: '#d84315',
    emojis: ['🎃', '👻', '🦇', '🕷️', '🕸️', '🍬', '💀', '🧛', '🧙', '🧟', '🌕', '🕯️']
  }
];

let cardButtons = [];
let assignedEmojis = [];

const boardEl = document.getElementById('board');
const flipsEl = document.getElementById('flip-count');
const scoreEl = document.getElementById('score-count');
const winMessageEl = document.getElementById('win-message');
const newGameBtn = document.getElementById('new-game-btn');

function applyRandomTheme() {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  document.body.style.backgroundColor = theme.bg;
  document.documentElement.style.setProperty('--card-back', theme.cardBack);
  return theme;
}

function updateScreen() {
  Game.cards.forEach((card, index) => {
    const btn = cardButtons[index];
    if (card.isFaceUp || card.isMatched) {
      btn.textContent = assignedEmojis[card.pairId];
      btn.classList.add('face-up');
    } else {
      btn.textContent = '';
      btn.classList.remove('face-up');
    }
  });

  flipsEl.textContent = Game.flips;
  scoreEl.textContent = Game.score;
}

function startNewGame() {
  cardButtons = Array.from(document.querySelectorAll('.card'));
  const totalCards = cardButtons.length;

  const currentTheme = applyRandomTheme();
  assignedEmojis = currentTheme.emojis.slice(0, totalCards / 2);

  Game.init(totalCards);

  winMessageEl.classList.add('hidden');
  winMessageEl.textContent = '';
  updateScreen();
}

boardEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.card');
  if (!btn) return;

  const index = cardButtons.indexOf(btn);
  if (index === -1) return;

  const result = Game.flipCard(index);
  if (!result) return;

  updateScreen();

  if (result.action === 'mismatch') {
    setTimeout(() => {
      Game.resetMismatched(result.indexA, result.indexB);
      updateScreen();
    }, 800);
  } else if (result.action === 'match' && result.won) {
    winMessageEl.textContent = `You won in ${Game.flips} flips! Final Score: ${Game.score}`;
    winMessageEl.classList.remove('hidden');
  }
});

newGameBtn.addEventListener('click', startNewGame);

startNewGame();
