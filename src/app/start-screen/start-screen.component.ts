import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
import { collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {

  constructor(
    private firestore: Firestore,
    private router: Router 
  ) {}

  ngOnInit(): void {
      
  }

  async newGame(){
    // Start Game
    let game = new Game();
    await addDoc(this.getGamesRef(), game.gameJson())
    .then( (gameInfo: any) => {
      console.log('Game Id:', gameInfo.id);
      this.router.navigateByUrl(`/game/${gameInfo.id}`);
    });
  }
  //.then fuer einmalige abrufe | .subscribe oder .onSnapshot fuer dauerhafte abrufe

  getGamesRef(){
    return collection(this.firestore, 'Games')
  }

}
