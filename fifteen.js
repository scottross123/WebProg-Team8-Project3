/*
Akash Rama- This page has the JavaScript elements for fifteen tiles which is 
a classic game
*/

"use strict";
(function() {
    let cheatWin;

    let timeElapsed = 0;
    let timer;

    let movesMade = 0;

    let gameStart = false;

    window.onload = function() {
        create();
        let empty = "L3T3";
        highlight(empty);

        // random background selection
        let rndBkg = Math.floor(Math.random() * 3) + 1;
        document.body.style.backgroundImage = "url('./images/bkg" + rndBkg + ".jpeg')";

        // music
        document.getElementById('music').addEventListener('ended', function(){
        let rndSong = Math.floor(Math.random() * 3) + 1;
        let song = new Audio("./music/" + rndSong + ".mp3");
        song.play();
        });

        let win = currentTiles();
        
        let pieces = document.querySelectorAll(".pieces");
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].onclick = function() {
                if (pieces[i].classList.contains("red")) {
                    let pass = pieces[i];
                    empty = move(pass, empty);
                    moveCounter();
                    clear();
                    highlight(empty);
                }

                //check if game is won each move
                if (gameStart == true && isFinished(win)){
                    console.log('winner winner chicken dinner');
                    winScreen();
                }
            };

        cheatWin = document.querySelectorAll(".pieces");
        }
        
        document.getElementById("shufflebutton").onclick = function() {
            empty = shuffle(empty);
        };

        document.getElementById("cheatbutton").onclick = function() {
            cheat();
        };

    }

    // creates the inital tile set
    function create() {
        let input = document.getElementById("puzzlearea");
        for (let i = 0; i < 15; i++) {
            let div = document.createElement("div");
            div.className = "pieces";
            div.innerHTML = i + 1;
            div.id = "L" + (i % 4) + "T" + Math.floor(i / 4);
            div.currentPos = div.id;

            let left = (100 * (i % 4))
            div.style.left = left + "px";
            let top = (Math.floor(i / 4) * 100)
            div.style.top = top + "px";
            div.style.backgroundPosition = (left * -1) + "px " + (top * -1) + "px";
            input.appendChild(div);
        }
    }
    
    //returns an array of all current tiles
    function currentTiles() {
        let present = document.querySelectorAll(".pieces");
        console.log(present);
        let everything = [];
        for (let i = 0; i < present.length; i++) {
            everything.push(present[i].currentPos);
        }
        console.log(everything);
        return everything;
    }
    
    // finds pieces next to empty
    function nextToEmpty(empty) {
        let neighbors = []
        let current = currentTiles();
        let left = parseInt(empty.charAt(1));
        let top = parseInt(empty.charAt(3));
        let leftPossible = [];
        let topPossible = [];
        
        if (left == 0 ) {
            leftPossible.push(1);
        }
        else if (left == 3) {
            leftPossible.push(2);
        }
        else {
            leftPossible.push(left - 1);
            leftPossible.push(left + 1);
        }
        
        if (top == 0 ) {
        topPossible.push(1);
        }
        else if (top == 3) {
            topPossible.push(2);
        }
        else {
            topPossible.push(top - 1);
            topPossible.push(top + 1);
        }
        
        for (let i = 0; i < leftPossible.length; i++) {
            neighbors.push("L" + leftPossible[i] + "T" + top);
        }
        for (let i = 0; i < topPossible.length; i++) {
            neighbors.push("L" + left + "T" + topPossible[i]);
        }
        return neighbors;
    }
    
    // turns red tiles next to empty space
    function highlight(empty) {
       let neighbors = nextToEmpty(empty)
        for (let i = 0; i < neighbors.length; i++) {
            let now = neighbors[i];
            let next = document.querySelectorAll(".pieces");
            for (let j = 0; j < next.length; j++) {
                if (next[j].currentPos == now) {
                    next[j].classList.add("red");
                }
            }
        }
    }
    
    // moves a tile next to empty space to empty space when clicked
    function move(pass, emptySpace) {
        let choice = document.querySelectorAll(".pieces");
        let former = pass.currentPos;
        pass.currentPos = emptySpace;
        emptySpace = former;
        let left = pass.currentPos.charAt(1);
        let top = pass.currentPos.charAt(3);
        pass.style.left = (100 * (left % 4)) + "px";
        pass.style.top = (100 * (top % 4)) + "px";
        return emptySpace;
    }
    
    // gets rid of class Names to start new cycle
    function clear() {
        let red = document.querySelectorAll(".red");
        for (let i = 0; i < red.length; i++) {
            red[i].classList.remove("red");
        }
    }
    
    // produces a random order of tiles
    function shuffle(empty) {
        rest();
        let emptySpace = empty;
        for (let i = 0; i < 1000; i++) {
            let red = document.querySelectorAll(".red");
            let size = red.length;
            let choose = Math.floor(Math.random() * size);
            emptySpace = move(red[choose], emptySpace);
            clear();
            highlight(emptySpace);
        }
        startTime();

        return emptySpace;
    }

    // helper function to reset everything for shufflexx
    function rest() {
        gameStart = true;
        endTime();
        resetTime();
        resetMoves();
        stopSong();
        playSong();
        if (document.getElementById("victory") != null) document.getElementById("victory").remove();
    }

    // check if board as been won
    function isFinished(win) {
        for (let i = 0; i < 15; i++)
            if (currentTiles()[i] != win[i]) return false;

        return true;
    }

    function winScreen() {
        let img = document.createElement("img");
        img.src = "victory.png";
        img.id = "victory";
        img.setAttribute("style", "z-index: 9");

        let area = document.getElementById("puzzlearea");
        area.appendChild(img);
    }

    function cheat() {

        // incomplete

        //let currentPieces = document.getElementsByClassName("puzzlearea").innerHTML;

        console.log(cheatWin);
        console.log(document.querySelectorAll(".pieces"));

        for (let i = 0; i < 15; i++) {
           console.log(document.querySelectorAll(".pieces")[i].currentPos);
           document.querySelectorAll(".pieces")[i].currentPos = cheatWin[i].currentPos;
        }

    }

    function tick() {
        timeElapsed++;
        document.getElementById("timer").innerHTML = "Time: " + timeElapsed + "s";
    }

    // these functions control the game timer
    function startTime() {
        timer = setInterval(tick, 1000);
        console.log(timer);
    }

    function endTime() {
        clearInterval(timer);
    }

    function resetTime() {
        timeElapsed = 0;
        document.getElementById("timer").innerHTML = "Time: 0s"; 
    }


    // these functions controls move count
    function moveCounter() {
        movesMade++;
        document.getElementById("moves").innerHTML = "Moves: " + movesMade; 
    }

    function resetMoves() {
        movesMade = 0;
        document.getElementById("moves").innerHTML = "Moves: " + 0; 
    }

    // music

    function playSong() {
        let rndSong = Math.floor(Math.random() * 3) + 1;
        document.getElementById("music").setAttribute('src', "./music/" + rndSong + ".mp3");
        document.getElementById("music").play();
    }

    function stopSong() {
        document.getElementById("music").pause();
        document.getElementById("music").currentTime = 0;
    }

})();

    function backgroundSelect(bkg) {  
        document.body.style.backgroundImage = "url('./images/" + bkg + ".jpeg')";
    }

