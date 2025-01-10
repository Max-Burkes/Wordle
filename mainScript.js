var boxes = document.getElementsByClassName("boxes");
const pos = [1, 1];
var words = ["nikki", "loves"];

const word = words[Math.floor(Math.random() * words.length)];
console.log(words);
console.log(word);
var counts = [];
var guess = [];

var menuUp = false;

/**
 * Counts the occurence of letters in the word
 */
for (var i = 0; i < 5; i++) {
    if (counts.includes(word.charAt(i))) {
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
}

document.getElementById("-1").addEventListener("keydown", changeBox);

/**Makes it so if you click off the text box, the
 * game automatically takes you back to the correct spot
 */
var dummy = document.getElementsByTagName("body");
dummy[0].addEventListener("click", highlightCurrent);

/** Registers which key the user presses and changes the 
 * game accordingly.
 */
function changeBox(event) {
    console.log(event.keyCode);
    if (event.keyCode >= 65 && event.keyCode <= 90 && pos[1] != -1) {
        
        event.preventDefault(); // Prevent the default keypress behavior

        addLetter.call(this, event.key);
    } else if (event.keyCode == 13 && pos[1] == -1) {
        console.log("Enter Recieved");
        checkAnswer.call(this);

    } else if (event.keyCode == 8 && (pos[1] > 1 || pos[1] == -1)) { //For when backspace is pressed

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

            document.getElementById("-1").focus();

        } else {
            var next = document.getElementById(pos[0] + "," + pos[1]).children[0];
            next.value = "";
            
            next.focus();
        }
    } 
    
}

/**
 * When the user presses enter, this method will compare their guess to the correct answer
 * and color the guessed letter accordingly.
 */
function checkAnswer() {
    if (pos[1] == -1) {
        let correct = true;

        for (var i = 0; i < 5; i++) {

            if (guess[i] == word.charAt(i)) {//If the user is right, mark green
                document.getElementById(pos[0] + "," + (i + 1)).className = "right";

            } else if (word.includes(guess[i])) {//right letter wrong place, mark yellow
                document.getElementById(pos[0] + "," + (i + 1)).className = "almost-right";
                correct = false;

            } else {//wrong letter, mark grey
                document.getElementById(pos[0] + "," + (i + 1)).className = "wrong";
                correct = false;
            }
        }

        if(correct) {
            winner();

        } else {
            pos[0] += 1;
            pos[1] = 1;
            document.getElementById(pos[0] + "," + pos[1]).children[0].focus();

            guess = [];
        }
    }
}

function winner() {
    console.log("You win");
}

/**
 * Ensures the user can only press on the box they're typing in
 */
function unclick() {
    if (this.parentElement.id != pos[0] + "," + pos[1]) {
        this.blur();
        highlightCurrent();
    }
}

function highlightCurrent() {
    var temp = "";
    if(pos[1] != -1) {
        temp += pos[0] + ",";
    }
    document.getElementById(temp + pos[1]).children[0].focus()
}