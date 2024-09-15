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
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  public pickCardAnimation = false;
  public currentCard: string = '';
  game!: Game;
  gameId!: string;

  unsubGames!: () => void;



  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore = inject(Firestore),
    public dialog: MatDialog){
  }

  subGames(docId: string) {
    const gameDocRef = doc(this.getGamesRef(), docId); // Erstellen einer Referenz zum spezifischen Dokument
    return onSnapshot(gameDocRef, (docSnap) => {
        const gameData = docSnap.data();
        console.log('Game update', gameData);
        this.updateGameData(gameData);
    });
  }
// zuerst schreiben wir onSnapshot fuer die Verbindung,
// dann sagen wir was wir machen wollen: in diesem Fall; doc (read befehl)
// doc braucht die collection reference und die document ID: collection(this.firestore, 'Games'), docId)
//
// dann die nachdem man die verbindung hergestellt hat, gibt man eine Funktion weiter, und kann eine Variabel dafuer benennen fuer das Document; (docSnap)
//
// mit (docSnap) => { ... } koennen wir nun auf das dokument zugreifen, damit handeln. zb ausloggen oder es updaten.
//         const gameData = docSnap.data(); ermoeglicht uns den reinen zugriff auf das document json, in diesem Fall.


  async saveGame(){
    console.log(this.gameId);
    const docRef = doc(this.getGamesRef(), this.gameId);
    await updateDoc(docRef, this.game.gameJson())
  }
  

  ngOnInit(): void {
      this.newGame();
      this.route.params.subscribe((params) => {
        this.gameId = params['id'];
        console.log(this.gameId);
        this.unsubGames = this.subGames(params['id']);
      });
  }

  updateGameData(gameData: any) {
    this.game.currentPlayer = gameData.currentPlayer;
    this.game.playedCards = gameData.playedCards;
    this.game.players = gameData.players;
    this.game.stack = gameData.stack;
    this.game.pickCardAnimation = gameData.pickCardAnimation;
    this.game.currentCard = gameData.currentCard;
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
  }

  takeCard(){
    if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;   
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();   

      setTimeout(()=>{
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 750);
    } 

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
        console.log('game saved by adding player', this.game.players);
      }
    });
  }


}
