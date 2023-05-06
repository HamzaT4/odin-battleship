import { ship } from ".";
import {gameBoard} from ".";
import { player, createBot } from ".";
test('ship',()=>{
    let ship1 = ship(5)
    expect(ship1.length).toBe(5);
    expect(ship1.hits).toBe(0);
    expect(ship1.isSunk()).toBe(false);
    ship1.hit();
    expect(ship1.hits).toBe(1);   

});

test('gameBoard',()=>{
    let game1 = gameBoard();

     game1.placeShip([3,5],2,'V')
    expect(game1.ships[0].position).toEqual([[3,5],[4,5]]);

    game1.placeShip([0,0],2,'H')
    expect(game1.ships[1].position).toEqual([[0,0],[0,1]]);

    expect(game1.board[3][5]).toBe('2V');
    expect(game1.board[0][1]).toBe('2H');


    game1.receiveAttack([5,3]);
    game1.receiveAttack([0,0]);
    game1.receiveAttack([4,5]);
    game1.receiveAttack([5,6]);
    game1.receiveAttack([3,5]);
    expect(game1.board[5][3]).toBe('miss');
    expect(game1.board[0][0]).toBe('hit');
    expect(game1.board[4][5]).toBe('hit');
    expect(game1.board[5][6]).toBe('miss');
    expect(game1.board[3][5]).toBe('hit');
    expect(game1.receiveAttack([3,5])).toBe('already attacked here');
  
    
   expect(game1.ships[1].hits).toBe(1);
   expect(game1.ships[0].hits).toBe(2);

   expect(game1.gameResult).toBe('not over');
   game1.receiveAttack([0,1]);
   expect(game1.gameResult).toBe('over');



});

test('Player',()=>{
    let player1 = player();
    expect(player1.turn).toBe(false);
    expect(player1.ready()).toBe(false);
    expect(player1.availableShips).toEqual([2,2,2,3,3,4,5,6]);
    

});

test('bot',()=>{

let bot1=createBot();
expect(bot1.ready()).toBe(true);     
expect(bot1.playerBase.ships.length).toBe(8);
expect(bot1.playerBase.ships[0].isSunk()).toBe(false);     
bot1.playerBase.ships[0].hit();
expect(bot1.playerBase.ships[0].hits).toBe(1);
bot1.enemyBase.receiveAttack(bot1.newAttack());  
bot1.enemyBase.receiveAttack(bot1.newAttack());  
 

})