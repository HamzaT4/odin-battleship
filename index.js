import { createGrid1 } from "./DOM.js";
import { createGrid2 } from "./DOM.js";
import { sinkTheShip } from "./DOM.js";
export const ship =function(length,position,align) {
    
    return {length,
        align,
        position,
        hits:0,
        isSunk: function(){return this.hits==this.length} ,
        hit: function(){this.hits++}
    };
}

export const gameBoard = function(){

    return {
        gameResult:'not over',
        ships:[],
        board:new Array(10).fill().map(() => new Array(10).fill(null)),
        placeShip: function (pos,len,align) {
            
            if (align=='V') {
                let position = [[pos[0],pos[1]],[pos[0]+len-1,pos[1]]]
                for (let i = 0; i < len; i++) {
                   this.board[pos[0]+i][pos[1]]=`${len}V`;
                }
                this.ships.push(ship(len,position,align));
               
                
            } else if(align=='H') {
                let position = [[pos[0],pos[1]],[pos[0],pos[1]+len-1]]
                for (let i = 0; i < len; i++) {
                    this.board[pos[0]][pos[1]+i]=`${len}H`;
                 }
                 this.ships.push(ship(len,position,align));
                
            }
             
        },
        receiveAttack: function(cor){
            if (this.board[cor[0]][cor[1]]=='miss'||this.board[cor[0]][cor[1]]=='hit') {
                return'already attacked here';
                
            }
           else if (this.board[cor[0]][cor[1]]==null) {
                this.board[cor[0]][cor[1]]='miss';
           } else {
            this.board[cor[0]][cor[1]]='hit';
           let damagedShip = this.ships.filter((sh)=>{
                return ((sh.align=='H'&&(cor[0]==sh.position[0][0])&&(cor[1]>=sh.position[0][1]&&cor[1]<=sh.position[1][1]))||(sh.align=='V'&&(cor[1]==sh.position[0][1])&&(cor[0]>=sh.position[0][0]&&cor[0]<=sh.position[1][0])));
            });
            
            damagedShip[0].hit();
            
            let shipsStatus= this.ships.map((sh)=> sh.isSunk());
            if(!shipsStatus.includes(false)) this.gameResult = 'over';
            if(damagedShip[0]!=undefined && damagedShip[0].isSunk()==true){return damagedShip[0]}

           }
        }

    };
}

 const player = function() {
  
    return {
      turn: false,
      availableShips:[2, 2, 2, 3, 3, 4, 5, 6],
      ready :function(){return this.availableShips.length == 0},
      playerBase: gameBoard(),
      enemyBase:gameBoard(),
      choseShip:function(pos,len,align){    
        if ( this.availableShips.includes(len)) {
            this.availableShips.splice(this.availableShips.indexOf(len),1);
            this.playerBase.placeShip(pos,len,align);
        } else {
            throw new Error('there is no such a ship');
        }
      },
      attackEnemy:function (cor) {
        this.enemyBase.receiveAttack(cor);
      }
    };
  };

function createBot() {
   let bot=player();
   let aligns = ['H','V'];
outerLoop:for (let i = 0; i < 8; i++) {
    let botPosition=[Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
    let botAlign = aligns[Math.floor(Math.random()*2)];
    let botLength = bot.availableShips[0];
    if ((botAlign=='H'&&botPosition[1]+botLength>9)||(botAlign=='V'&&botPosition[0]+botLength>9) ){
        i--;
        continue;
    }
    for (let j = 0; j <= botLength; j++) {
       if((botAlign=='H'&&bot.playerBase.board[botPosition[0]][botPosition[1]+j]!=null)||(botAlign=='V'&&bot.playerBase.board[botPosition[0]+j][botPosition[1]]!=null)){
            i--;
            continue outerLoop;
       }
        
    };
    
    bot.choseShip(botPosition,botLength,botAlign);
   }
   bot.previousAttacks=[];
   let attackCor=[];
    bot.newAttack=function(){
        
        do {
            attackCor=[Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
        } while (this.previousAttacks.some(atk =>
            atk.every((value, index) => value === attackCor[index])
          ));
        
      
      this.previousAttacks.push(attackCor);
     
        return attackCor;
    }
   
return bot;
};
export const mainGameLoop = function(){return{
  gameMode:'vsAI',  
  players:[], 
  createGrides:function(board1,board2){
    createGrid1(board1);
    createGrid2(board2);
  },setUpGame:function(){
    if(this.gameMode=='vsAI'){
        let bot1= createBot();
        let bot2= createBot();
        bot1.turn=true;
        this.players.push(bot1);
        this.players.push(bot2);
        
        
    }


},randomAttack:true,
  attackHandler:function(e) {
    let bot1=this.players[0];
    let bot2=this.players[1];
    bot1.enemyBase=bot2.playerBase;
    bot2.enemyBase=bot1.playerBase;
    //Player 1 turn in both modes
    if(e.target.getAttribute('player')==2 && this.players[0].turn){

        
        let destroyedShip = bot2.playerBase.receiveAttack([e.target.getAttribute('pos2')[0],e.target.getAttribute('pos2')[2]]);
        if(destroyedShip=='already attacked here'){return}
        if (destroyedShip!=undefined) {
            sinkTheShip(destroyedShip,'p2')
        }        if(bot2.playerBase.board[e.target.getAttribute('pos2')[0]][e.target.getAttribute('pos2')[2]]=='hit'){
            e.target.classList.add('hit-unit');   
          
            if(bot2.playerBase.gameResult=='over'){
                alert('player1 won');
                location. reload()
            }  
        }else if (bot2.playerBase.board[e.target.getAttribute('pos2')[0]][e.target.getAttribute('pos2')[2]]=='miss'){
            e.target.classList.remove('empty-unit');   
            e.target.classList.add('miss-unit');   


        }
        bot2.turn=true;
        this.players[0].turn=false;
    }//Ai turn in PvAI mode
    if(this.players[1].turn && this.gameMode=='vsAI'){
        
        let botAttack=[];
        if (this.randomAttack===true) {
            botAttack = this.players[1].newAttack(); 
        }else{
                   
            console.log(bot1.playerBase.board);
            if(bot1.playerBase.board[this.randomAttack[0],this.randomAttack[1]+1]=='hit'&&this.randomAttack[1]-1>=0){
                botAttack=[this.randomAttack[0],this.randomAttack[1]-1];
            }else if(bot1.playerBase.board[this.randomAttack[0],this.randomAttack[1]-1]=='hit'&&this.randomAttack[1]+1<=9){
                botAttack=[this.randomAttack[0],this.randomAttack[1]+1];
            }else if(bot1.playerBase.board[this.randomAttack[0]+1,this.randomAttack[1]]=='hit'&&this.randomAttack[0]-1>=0){
                botAttack=[this.randomAttack[0]-1,this.randomAttack[1]];
            }else if(bot1.playerBase.board[this.randomAttack[0]-1,this.randomAttack[1]]=='hit'&&this.randomAttack[0]+1<=9``){
                botAttack=[this.randomAttack[0]+1,this.randomAttack[1]];
            }else if(this.randomAttack[1]+1<=9&&bot1.playerBase.board[this.randomAttack[0],this.randomAttack[1]+1]!='miss'){
                botAttack=[this.randomAttack[0],this.randomAttack[1]+1];
            }else if (this.randomAttack[1]-1>=0&&bot1.playerBase.board[this.randomAttack[0],this.randomAttack[1]-1]!='miss'){
                botAttack=[this.randomAttack[0],this.randomAttack[1]-1];
            }else if(this.randomAttack[1]+1<=9&&bot1.playerBase.board[this.randomAttack[0]+1,this.randomAttack[1]]!='miss'){
                botAttack=[this.randomAttack[0]+1,this.randomAttack[1]];
            }else if (this.randomAttack[1]-1>=0&&bot1.playerBase.board[this.randomAttack[0]-1,this.randomAttack[1]]!='miss'){
                botAttack=[this.randomAttack[0]-1,this.randomAttack[1]];
            }else{botAttack = this.players[1].newAttack(); }
            console.log(botAttack);
            if(bot2.previousAttacks.some(atk =>
                atk.every((value, index) => value === botAttack[index])
              )){
                botAttack = this.players[1].newAttack(); 
              }
            bot2.previousAttacks.push(botAttack);
         
           
            
  
        }
        

        
        let clickedUnit = document.querySelector(`[pos1="${botAttack[0]},${botAttack[1]}"]`); 
        let destroyedShip = bot1.playerBase.receiveAttack([botAttack[0],botAttack[1]]);
       
        if (destroyedShip!=undefined) {
            sinkTheShip(destroyedShip,'p1')
        }
        if(bot1.playerBase.board[botAttack[0]][botAttack[1]]=='hit'){
            clickedUnit.classList.add('hit-unit');  
            this.randomAttack=[];
            this.randomAttack.push(botAttack[0]);
            this.randomAttack.push(botAttack[1]);
          
            if(bot1.playerBase.gameResult=='over'){
                alert('AI WON');
                location. reload()
            }  
        }else if (bot1.playerBase.board[botAttack[0]][botAttack[1]]=='miss'){
            clickedUnit.classList.remove('empty-unit');   
            clickedUnit.classList.add('miss-unit');   
            this.randomAttack=true;


        }
        this.players[1].turn=false;
        this.players[0].turn=true;

    }//Player2 turn in PvP mode
    if(e.target.getAttribute('player')==1 && this.players[1].turn && this.gameMode=='PvP'){

        
        let destroyedShip = bot1.playerBase.receiveAttack([e.target.getAttribute('pos1')[0],e.target.getAttribute('pos1')[2]]);
        if (destroyedShip='already attacked here') {return}
        if (destroyedShip!=undefined) {
            sinkTheShip(destroyedShip,'p1')
        }
        if(bot1.playerBase.board[e.target.getAttribute('pos1')[0]][e.target.getAttribute('pos1')[2]]=='hit'){
            e.target.classList.add('hit-unit');   
          
            if(bot1.playerBase.gameResult=='over'){
                alert('player2 won');
                location. reload();
            }  
        }else if (bot1.playerBase.board[e.target.getAttribute('pos1')[0]][e.target.getAttribute('pos1')[2]]=='miss'){
            e.target.classList.remove('empty-unit');   
            e.target.classList.add('miss-unit');   


        }
        this.players[1].turn=false;
        this.players[0].turn=true;
    }
}


}}





export { player,createBot };

