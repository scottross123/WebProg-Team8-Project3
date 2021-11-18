// Records the total number of moves and total time.
var movescount = 0;
var timeElapse = 0;

// The available div elements
var cell = [
"one",  "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", 
"fourteen", "fifteen", ""
];

// Since we're going to shuffle the divs, copy the ids into the shuffle_t array
var shuffle_t = cell.slice();

// Once shuffle_t, it's difficult to figure out which number is a digit, so just mapped numbers to digits
var cellsD = {
"one":1,  "two":2, "three":3, "four":4, "five":5, "six":6, "seven":7,"eight":8, "nine":9, "ten":10, "eleven":11, "twelve":12, 
"thirteen":13, "fourteen":14, "fifteen":15, "sixteen":16
};

// Once the person changes the background, the current background is stored here
var selected_background;

// Maps the available movement. Looking at the ids array above, you can see that at array 0, value one,
// if the empty block was currently there, it can't move to the top or left, but it can move to the right and the bottom.
// top right bottom left
//[ 0,   1,    1,    0  ]
var movement = [
    [0, 1, 1, 0], //0: one
    [0, 1, 1, 1], //1: two
    [0, 1, 1, 1], //2: three
    [0, 0, 1, 1], //3: four
    [1, 1, 1, 0], //4: five
    [1, 1, 1, 1], //5: six
    [1, 1, 1, 1], //6: seven
    [1, 0, 1, 1], //7: eight
    [1, 1, 1, 0], //8: nine
    [1, 1, 1, 1], //9: ten
    [1, 1, 1, 1], //10: eleven
    [1, 0, 1, 1], //11: twelve
    [1, 1, 0, 0], //12: thirteen
    [1, 1, 0, 1], //13: fourteen
    [1, 1, 0, 1], //14: fifteen
    [1, 0, 0, 1]  //15: sixteen
];

// The available board backgrounds
var background = ["mario", "luigi", "mariao2", "toad"];

// random webpage background selection
let rndBkg = Math.floor(Math.random() * 3) + 1;
document.body.style.backgroundImage = "url('./images/bkg" + rndBkg + ".jpeg')";

function backgroundSelect(bkg) {  
    document.body.style.backgroundImage = "url('./images/" + bkg + ".jpeg')";
}

// adds music

function playSong() {
    let rndSong = Math.floor(Math.random() * 3) + 1;
    document.getElementById("music").setAttribute('src', "./music/" + rndSong + ".mp3");
    document.getElementById("music").play();
}

function stopSong() {
    document.getElementById("music").pause();
    document.getElementById("music").currentTime = 0;
}

document.getElementById('music').addEventListener('ended', function(){
    let rndSong = Math.floor(Math.random() * 3) + 1;
    console.log("song: " + rndSong);
    this.src = "./music/" + rndSong + ".mp3";
    this.play();
});

/**
 * Initializes the game to play
 * Displays a random image: one of the four possible options from the background array
 * Sets all of the different div (100x100) blocks to have a class of title and the random background
 */
function Gamebagin() {
    var background_id = Math.floor((Math.random() * 4));
    selected_background = "./images/" + background[background_id];

    document.getElementById(background[background_id]).selected = true; // Grab the selected option and mark it as selected

    for (var i = 0; i < cell.length - 1; i++) {
        document.getElementById(cell[i]).className = "tile " + background[background_id];
    }
}

/**
 * Once the user selects a new option from the drop-down menu, the image selected is populated
 * The background image of the main div and each of the block divs is replaced
 */
function changeBackground() {
    var class_name_img = document.getElementById("characters").value;

    if (background.indexOf(class_name_img) < 0) {
        return;
    }

    selected_background = class_name_img;

    document.getElementById("main").innerHTML = "";

    for (var i = 0; i < cell.length; i++) {
        if (cell[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = cell[i];
            document.getElementById("main").innerHTML += '<div id="' + cell[i] + '" class="tile' + " " + selected_background + '">' + cellsD[id_name] + '</div>';
        }
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
    movescount++;
    document.getElementById("moves").innerHTML = "Moves: " + movescount; 
}

function resetMoves() {
    movescount = 0;
    document.getElementById("moves").innerHTML = "Moves: " + 0; 
}

// helper function to reset everything for shuffle
function rest() {
    endTime();
    resetTime();
    startTime();
    resetMoves();
    stopSong();
    playSong();
    removeWon();
}

/**
 * Shuffles the board
 * Initializes the shuffle array to regular
 * Sets the empty block position
 * Loops through 500 times making sure the board is really shufflet
 * Generates a random number between 0 and 3: used for the movement array.
 * Checks to see if the movement that it selected for that particular block is set to 1, meaning that it can move,
 * otherwise it keeps trying a new random number.
 *   i.e. if the empty block is in the sixteenth block (helps to look at the ids array), the only movement that it can
 *        do is to the top or to the left (i.e. swap the position with it's neighbor). Otherwise, it can't move
 * Once the corrent movement is generated, the id of that movement is stored in movement. Looking at the movement
 * array, you'll notice that its indexes are mapped to top, right, bottom, left. If it needs to move to the top, you'll
 * need to subtract 4 from the current position.
 * Afterwards, the moved to and moved from are swapped in the shufflet array.
 * Finally, after all of the different possible shuffles, the displayBoard() function is called to display the board.
 */
function shuffle() {
    // play new music every shuffle
    rest();

    shuffle_t = cell.slice(); // Reinitialize the shufflet array
    var sixteen = 15;

    // Set a loop to go through 500 times
    for (var i = 0; i < 500; i++) {

        var movement_cell = Math.floor((Math.random() * 4));

        while(movement[sixteen][movement_cell] != 1) {
            movement_cell = Math.floor((Math.random() * 4));
        }

        // The index id where the blank space will go to
        var next;

        switch(movement_cell) {
            case 0:
                next = sixteen - 4;
                break;
                // subtract 4 to go to the top
            case 1:
                next = sixteen + 1;
                break;
                // add 1 to go to the right
            case 2:
                next = sixteen + 4;
                break;
                // subtract 4 to go to the bottom
            case 3:
                next = sixteen - 1;
                break;
                // subtract 1 to go to the left
        }

        // swap sixteen and next
        var temp = shuffle_t[sixteen];
        shuffle_t[sixteen] = shuffle_t[next];
        shuffle_t[next] = temp;
        sixteen = next;
    }

    displayBoard();
}

/**
 * Clears the inner html of the file and cycles through the shufflet array displaying the div's within main in the correct order.
 */
function displayBoard() {
    document.getElementById("main").innerHTML = "";

    for (var i = 0; i < shuffle_t.length; i++) {
        if (shuffle_t[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = shuffle_t[i];
            document.getElementById("main").innerHTML += '<div id="' + shuffle_t[i] + '" class="tile' + " " + selected_background + '">' + cellsD[id_name] + '</div>';
        }
    }

    var clickable_id;

    if (movement[shuffle_t.indexOf("")][0] == 1) {
        clickable_id = shuffle_t.indexOf("") - 4;
        document.getElementById(shuffle_t[clickable_id]).className += " clickable";
        document.getElementById(shuffle_t[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffle_t.indexOf("") + ")");
    }

    if (movement[shuffle_t.indexOf("")][1] == 1) {
        clickable_id = shuffle_t.indexOf("") + 1;
        document.getElementById(shuffle_t[clickable_id]).className += " clickable";
        document.getElementById(shuffle_t[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffle_t.indexOf("") + ")");
    }

    if (movement[shuffle_t.indexOf("")][2] == 1) {
        clickable_id = shuffle_t.indexOf("") + 4;
        document.getElementById(shuffle_t[clickable_id]).className += " clickable";
        document.getElementById(shuffle_t[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffle_t.indexOf("") + ")");
    }

    if (movement[shuffle_t.indexOf("")][3] == 1) {
        clickable_id = shuffle_t.indexOf("") -1;
        document.getElementById(shuffle_t[clickable_id]).className += " clickable";
        document.getElementById(shuffle_t[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffle_t.indexOf("") + ")");
    }
}

/**
 * Swaps the pieces and increments the total number of moves the player has done
 */
function swapPieces(clickable_id, empty_id) {
    animateMovement(clickable_id, empty_id);

    setTimeout(function() {
        var temp = shuffle_t[empty_id];
        shuffle_t[empty_id] = shuffle_t[clickable_id];
        shuffle_t[clickable_id] = temp;

        moveCounter();

        displayBoard();
        checkIfWon();
    }, 600);
}

/**
 * Animates the movement of the blocks
 */
function animateMovement(clickable_id, empty_id) {
    if (clickable_id - 4 == empty_id) {
        console.log(shuffle_t[clickable_id]);
        document.getElementById(shuffle_t[clickable_id]).className += " animate-up";
    } else if (clickable_id + 1 == empty_id) {
        document.getElementById(shuffle_t[clickable_id]).className += " animate-right";
    } else if (clickable_id + 4 == empty_id) {
        document.getElementById(shuffle_t[clickable_id]).className += " animate-down";
    } else if (clickable_id - 1 == empty_id) {
        document.getElementById(shuffle_t[clickable_id]).className += " animate-left";
    }
}

/**
 * Checks to see if the user won
 * Converts the two arrays into strings and compares them
 * If the user won, the end date is subtracted from the start date and the milliseconds are converted to seconds
 * The following items are displayed to the winner: total number of time elapsed in seconds, a winning image and
 * the number of moves used to complete the puzzle
 */
function checkIfWon() {
    if (cell.toString() == shuffle_t.toString()) { // Test the image, time and number of turns by swapping == to !=

        var html = "";
        html += "<img src='win.gif' alt='You win' />";
        html += "<p>ya! finally, Total time (in seconds): " + timeElapsed + "</p>";
        html += "<p>Total number of moves : " + movescount + "</p>";

        document.getElementById("win").innerHTML = html;

        endTime();
    }
}

function removeWon() {
    if (document.getElementById("win").innerHTML != "") document.getElementById("win").innerHTML = "";
}
