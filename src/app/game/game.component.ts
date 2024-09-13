import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";
import { unsubscribe } from 'diagnostics_channel';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy{

  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  unsubGames!: () => void;



  constructor(private firestore: Firestore = inject(Firestore), public dialog: MatDialog){
    this.unsubGames = this.subGames();
  }

  subGames(): () => void {
    return onSnapshot(this.getGamesRef(), (games) => {
      games.forEach(gameSnap => {
        console.log(gameSnap.data());
      });
    });
  }

  ngOnInit(): void {
      this.newGame();
  }

  ngOnDestroy(): void {
    if (this.unsubGames) {
      this.unsubGames();
    }
  }

  getGamesRef(){
    return collection(this.firestore, 'Games')
  }

  newGame(){
    this.game = new Game();
    addDoc(this.getGamesRef(), this.game.gameJson());
  }

  takeCard(){
    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop() || '';
      this.pickCardAnimation = true;      
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      setTimeout(()=>{
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 750);
    } 

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }


}
