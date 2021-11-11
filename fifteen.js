/*
Akash Rama- This page has the JavaScript elements for fifteen tiles which is 
a classic game
*/

"use strict";

(function() {
    window.onload = function() {
        create();
        let empty = "L3T3";
        highlight(empty);
        
        let pieces = document.querySelectorAll(".pieces");
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].onclick = function() {
                if (pieces[i].classList.contains("red")) {
                    let pass = pieces[i];
                    empty = move(pass, empty);
                    clear();
                    highlight(empty);
                }
            };
                
        }
        
        document.getElementById("shufflebutton").onclick = function() {
            empty = shuffle(empty);
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
        let everything = [];
        for (let i = 0; i < present.length; i++) {
            everything.push(present[i].currentPos);
        }
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
        let emptySpace = empty;
        for (let i = 0; i < 1000; i++) {
            let red = document.querySelectorAll(".red");
            let size = red.length;
            let choose = Math.floor(Math.random() * size);
            emptySpace = move(red[choose], emptySpace);
            clear();
            highlight(emptySpace);
        }
        return emptySpace;
    }
    
})()