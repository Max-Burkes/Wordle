console.log(screen.width);

var boxes = document.getElementsByClassName("boxes");
const pos = [1, 1];
var Words;

/**
 * Gets a list of 5-letter words from a github .txt file.
 * @returns 
 */
function getWords() {
    return fetch ("https://raw.githubusercontent.com/Max-Burkes/Wordle/refs/heads/main/5-letter%20Words.txt")
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error! stats:', response.status)
            }
            return response.text();
        })
        .then((data) => {
            return data.split("\n");
        })
        .catch((error) => {
            console.error('Error fetching file');
            return [];
        });
}

/**
 * Most of the wordle logic is behind this function.
 * This is because the page needs to load the words
 * first, and then let the user play. If it wasn't
 * like this, the words wouldn't be loaded because 
 * js loads things in seperately from running
 * other code. The .then statement makes the
 * program wait for the words to be loaded before 
 * running the rest of the program.
 */
getWords().then((words) => {
    Words = words;

    const word = Words[Math.floor(Math.random() * Words.length)].toUpperCase();
    console.log(word);

    var counts = [];
    var guess = [];

    //var menuUp = false;

    /**
     * Counts the occurence of letters in the word
     */
    for (var i = 0; i < 5; i++) {
        if (Object.keys(counts).includes(word.charAt(i))) {
            counts[word.charAt(i)] += 1;
        } else {
            counts[word.charAt(i)] = 1;
        }
    }


    boxes[0].focus();

    /**Adds listeners to the input fields */
    for (var i = 0; i < 30; i++) {
        boxes[i].addEventListener("keydown", changeBox);
        boxes[i].addEventListener("click", unclick);
        boxes[i].addEventListener("focus", unclick);
    }

    //document.getElementById("-1").addEventListener("keydown", changeBox);

    /**Makes it so if you click off the text box, the
     * game automatically takes you back to the correct spot
     */
    document.addEventListener("click", highlightCurrent);
    document.addEventListener("keydown", globalChange); //Used for backspace and enter on final key

    /** Registers which key the user presses and changes the 
     * game accordingly.
     */
    function changeBox(event) {
        if (event.keyCode >= 65 && event.keyCode <= 90 && pos[1] != -1) {
            
            event.preventDefault(); // Prevent the default keypress behavior

            addLetter.call(this, event.key.toUpperCase());

        } else if (event.keyCode == 13 && pos[1] == -1) {
            checkAnswer.call(this);

        } else if (event.keyCode == 8 && (pos[1] > 1 || pos[1] == -1)) { //For when backspace is pressed
            guess.pop();

            if (pos[1] == -1) {
                pos[1] = 6;
            }

            var previous = document.getElementById(pos[0] + "," + (pos[1] - 1)); //gets previous box element
            previous.innerHTML = '<input class="boxes"></input>'; //reinstantiates the previous box to be typed in

            //Since we created a new box, events need to be manually given to it
            previous.children[0].addEventListener("keydown", changeBox);
            previous.children[0].addEventListener("click", unclick);
            pos[1] -= 1;
            highlightCurrent();
        } 
    }

    /*Changes an input box to a letter that the user typed in*/ 
    function addLetter(letter) {

        guess.push(letter);

        if (this.className != "empty-box") {
            this.parentElement.innerHTML = letter;

            pos[1] += 1;

            if (pos[1] > 5) {
                pos[1] = -1;

                //document.getElementById("-1").focus();

            } else {
                var next = document.getElementById(pos[0] + "," + pos[1]).children[0];
                next.value = "";
                
                next.focus();
            }
        } 
        
    }

    /**
     * This function is used when the user has entered the last letter in the row.
     * It checks if the user then presses enter or backspace, and adjusts the
     * screen as such.
     * @param {} event 
     */
    function globalChange(event) {
        if (pos[1] == -1) {
            changeBox(event);
        }
    }

    /**
     * When the user presses enter, this method will compare their guess to the correct answer
     * and color the guessed letter accordingly.
     */
    function checkAnswer() {
        if (pos[1] == -1) {
            let correct = true;

            let countsCopy = [];

            for (var key in counts) {
                countsCopy[key] = counts[key];
            }

            let guessString = "";
            for (let i = 0; i < 5; i++) {
                guessString += guess[i];
            }
            
            if (words.includes(guessString.toLowerCase())) {

                let currentLetter;
                let currentKey;
                for (let i = 0; i < 5; i++) {
                    currentLetter = document.getElementById(pos[0] + "," + (i + 1));
                    currentKey = document.getElementById(guess[i]);

                    if (guess[i] == word.charAt(i)) {//If the user is right, mark green
                        countsCopy[guess[i]] -= 1;
                        currentLetter.className = "right";
                        currentKey.className = "letter " + guess[i] + " right";
                    }
                    
                }

                for (let i = 0; i < 5; i++) {
                    currentLetter = document.getElementById(pos[0] + "," + (i + 1));
                    currentKey = document.getElementById(guess[i]);

                    if (word.includes(guess[i]) && countsCopy[guess[i]] > 0 && currentLetter.className != "right") {//right letter wrong place, mark yellow
                        countsCopy[guess[i]] -= 1;
                        currentLetter.className = "almost-right";

                        if (currentKey.className != "letter " + guess[i] + " right") {
                            currentKey.className = "letter " + guess[i] + " almost-right";
                        }

                        correct = false;

                    } else if (currentLetter.className != "right"){//wrong letter, mark grey
                        currentLetter.className = "wrong";

                        if (currentKey.className != "letter " + guess[i] + " right" &&  currentKey.className != "letter " + guess[i] + " almost-right") {
                            currentKey.className = "letter " + guess[i] + " wrong";
                        }
                        correct = false;
                    }
                }

                if(correct) { //initiates win sequence
                    winner();

                } else { //If the user doesn't win, then the game moves to next row
                    pos[0] += 1;
                    pos[1] = 1;

                    if (pos[0] > 6) { //If no more rows are left, the user loses
                        setTimeout( function () {
                            alert("You lost. The word was " + word + ". Play again?");
                        }, 0);
                        location.reload();
                    }

                    document.getElementById(pos[0] + "," + pos[1]).children[0].focus();

                    guess = [];
                }

            } else {
                alert("Not a real word");
            }
        }
    }

    function winner() {
        setTimeout( function() {
            alert("You win")
        }, 0);
        location.reload();
    }

    /**
     * Ensures the user can only type in the box they're supposed
     * to type in by bluring other boxes and highlighting the
     * current box.
     */
    function unclick() {
        if (this.className == "boxes" && this.parentElement.id != pos[0] + "," +pos[1]) {
            this.blur();
        }

        if (pos[1] != -1 && this.parentElement.id != pos[0] + "," +pos[1]) {
            highlightCurrent();
        }
    }

    /**
     * Highlights the current cell the user will type in
     */
    function highlightCurrent() {
        if (pos[1] != -1) {
            document.getElementById(pos[0] + "," + pos[1]).children[0].focus();
        }
    }
});