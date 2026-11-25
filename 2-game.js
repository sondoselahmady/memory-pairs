const Game = {
  cards: [],
  flips: 0,
  score: 0,
  firstCardIndex: null,
  isWaiting: false,

  init(cardCount) {
    this.flips = 0;
    this.score = 0;
    this.firstCardIndex = null;
    this.isWaiting = false;
    this.cards = [];

    const pairsNeeded = cardCount / 2;
    const pairIds = [];

    for (let i = 0; i < pairsNeeded; i++) {
      pairIds.push(i, i);
    }

    for (let i = pairIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = pairIds[i];
      pairIds[i] = pairIds[j];
      pairIds[j] = temp;
    }

    this.cards = pairIds.map((pairId) => ({
      pairId: pairId,
      isFaceUp: false,
      isMatched: false,
      hasBeenSeen: false,
    }));
  },

  canFlip(index) {
    if (this.isWaiting) return false;
    const card = this.cards[index];
    if (!card || card.isFaceUp || card.isMatched) return false;
    return true;
  },

  flipCard(index) {
    if (!this.canFlip(index)) return null;

    this.flips++;
    const currentCard = this.cards[index];
    currentCard.isFaceUp = true;

    if (this.firstCardIndex === null) {
      this.firstCardIndex = index;
      return { action: 'flip' };
    }

    const firstCard = this.cards[this.firstCardIndex];
    const firstIndex = this.firstCardIndex;
    this.firstCardIndex = null;

    if (firstCard.pairId === currentCard.pairId) {
      firstCard.isMatched = true;
      currentCard.isMatched = true;
      firstCard.hasBeenSeen = true;
      currentCard.hasBeenSeen = true;
      this.score += 2;

      const won = this.cards.every((c) => c.isMatched);
      return { action: 'match', won: won };
    } else {
      let penalty = 0;
      if (firstCard.hasBeenSeen) penalty++;
      if (currentCard.hasBeenSeen) penalty++;
      this.score -= penalty;
      firstCard.hasBeenSeen = true;
      currentCard.hasBeenSeen = true;
      this.isWaiting = true;
      return { action: 'mismatch', indexA: firstIndex, indexB: index };
    }
  },

  resetMismatched(indexA, indexB) {
    this.cards[indexA].isFaceUp = false;
    this.cards[indexB].isFaceUp = false;
    this.isWaiting = false;
  }
};