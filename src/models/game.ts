
export class Game {
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0; 
    public pickCardAnimation = false;
    public currentCard: string = '';

    public gameJson(): object {
        return {
          players: this.players,
          stack: this.stack,
          playedCards: this.playedCards,
          currentPlayer: this.currentPlayer,
          pickCardAnimation: this.pickCardAnimation,
          currentCard: this.currentCard,
        };
      }

    constructor(){
        for (let i = 1; i < 14; i++) {
            this.stack.push('ace_' + i + '.png');
            this.stack.push('clubs_' + i + '.png');
            this.stack.push('diamonds_' + i + '.png');
            this.stack.push('hearts_' + i + '.png');
        }
        this.stack = this.shuffle(this.stack);
    }

    /**
    * Shuffles array in place.
    * @param {Array} a items An array containing the items.
    * @returns {string[]} Das gemischte Array.
    */
    shuffle(a: string[]): string[] {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

}