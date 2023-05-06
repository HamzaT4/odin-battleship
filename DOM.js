
import {mainGameLoop } from "./index.js";

const grid1 =document.querySelector('.player1-grid');
const grid2 =document.querySelector('.player2-grid');
const pvpButton= document.querySelector('.pvp-button');
const pvaiButton= document.querySelector('.pvai-button');
const player1Inputs = document.querySelector('.p1-ships');
const player1Button = document.querySelector('.p1-done');
const player1ShipsPos = document.querySelectorAll('[id^=ship]')

let game1={};

pvaiButton.addEventListener('click',()=>{
    grid1.innerHTML='';
    grid2.innerHTML='';
    game1 = mainGameLoop();
    game1.gameMode='vsAI';
    console.log(player1Inputs);
    player1Inputs.style.visibility='visible';
    
})
player1Button.addEventListener('click',()=>{
    player1Inputs.style.visibility='hidden';
    let positions=[];
    let aligns=[]
    game1.setUpGame();
    console.log(game1.players[0].playerBase);
    game1.players[0].playerBase.board=new Array(10).fill().map(() => new Array(10).fill(null));
    game1.players[0].availableShips=[2,2,2,3,3,4,5,6];
    game1.players[0].playerBase.ships=[];
    
    for (let i = 0; i < 8; i++) {
        
        positions.push([player1ShipsPos[i].value[0]*1,player1ShipsPos[i].value[1]*1]);
        aligns.push(player1ShipsPos[i].value[2]);
    }

    for (let i = 0; i < 8; i++) {
      game1.players[0].choseShip(positions[i],game1.players[0].availableShips[0],aligns[i]);
        
    }
    game1.createGrides(game1.players[0].playerBase.board,game1.players[1].playerBase.board)
})

export const createGrid1=function(board){
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let unit = document.createElement('div');
        unit.classList.add('unit');
        unit.setAttribute('pos1',[i,j]);
        unit.setAttribute('player',1);
        if (board[i][j]==null) {
            unit.classList.add('empty-unit');
        }
        else{
            unit.classList.add('ship-unit');
        }
       
        grid1.appendChild(unit);
        unit.addEventListener('click',game1.attackHandler.bind(game1));
       
    }
    
}
let name1 = document.createElement('h3');
    name1.innerText='Your Base';
    name1.classList.add('player-name');
    grid1.appendChild(name1);
    
}

export const createGrid2=function(board,){
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let unit = document.createElement('div');
            unit.classList.add('unit');
            unit.setAttribute('pos2',[i,j]);
            unit.setAttribute('player',2);
            if (board[i][j]==null) {
                unit.classList.add('empty-unit');
            }
            else{
                unit.classList.add('empty-unit');
            }
           
            grid2.appendChild(unit);
            unit.addEventListener('click',game1.attackHandler.bind(game1));
        }
        
    }
    let name2 = document.createElement('h3');
    name2.innerText='Enemy Base';
    name2.classList.add('player-name');
    grid2.appendChild(name2);
    
    }

export const sinkTheShip=function(sunkShip,base){
        let arrayOfUnits = [];
        
        if (sunkShip.align=='H') {
           
            for (let i = sunkShip.position[0][1]; i <= sunkShip.position[1][1]; i++) {
                arrayOfUnits.push([sunkShip.position[0][0],i]);
                
            }
           
        }
        else if(sunkShip.align=='V'){
            for (let i = sunkShip.position[0][0]; i <= sunkShip.position[1][0]; i++) {
                arrayOfUnits.push([i,sunkShip.position[0][1]]);
                
            }
        }
        for (let i = 0; i < arrayOfUnits.length; i++) {
            if (base=='p1') {
                let unit = document.querySelector(`[pos1='${arrayOfUnits[i][0]},${arrayOfUnits[i][1]}']`);
                unit.classList.add('sunk-unit');
            } else  {
                let unit = document.querySelector(`[pos2='${arrayOfUnits[i][0]},${arrayOfUnits[i][1]}']`);
                unit.classList.add('sunk-unit');
            }

        }

    }
    




